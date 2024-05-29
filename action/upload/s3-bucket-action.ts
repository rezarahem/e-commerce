'use server';

import { drizzleDb } from '@/drizzle/drizzle-db';
import { ProductImages } from '@/drizzle/schema';
import { FileArraySchema } from '@/zod';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { eq, inArray } from 'drizzle-orm';

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY as string,
    secretAccessKey: process.env.LIARA_SECRET_KEY as string,
  },
});

export const S3UploadAllImagesToBucketAndDbAction = async (
  data: FormData,
): Promise<{
  success: boolean;
  images?: {
    id: number;
    url: string;
  }[];
  errorMessage?: string;
}> => {
  const filesArray: File[] = [];
  const imagesUrl: string[] = [];

  for (const [, file] of data.entries()) {
    if (file instanceof File) {
      filesArray.push(file);
    }
  }

  const validatedFiles = FileArraySchema.safeParse(filesArray);
  if (!validatedFiles.success) {
    return {
      success: false,
      errorMessage: 'Invalid Inputs',
    };
  }
  try {
    // upload
    for (const file of filesArray) {
      try {
        const bytes = await file.arrayBuffer();
        const fileKey = `${Date.now()}_${file.name}`;

        const params = {
          Body: Buffer.from(bytes),
          Bucket: process.env.LIARA_BUCKET_NAME as string,
          Key: fileKey,
          ContentType: file.type,
        };
        const res = await s3.send(new PutObjectCommand(params));

        // some vlidation for s3
        if (res.$metadata.httpStatusCode === 200) {
          imagesUrl.push(`${process.env.LIARA_BUCKET_ADDRESS}/${fileKey}`);
        } else {
          console.log(
            `Failed to upload ${file.name}: Received status code ${res.$metadata.httpStatusCode}`,
          );
        }
      } catch (error) {
        console.log('[S3UploadAllImagesToBucketAndDbAction - single]', error);
      }
    }

    // write to the db
    if (imagesUrl.length === 0) {
      return {
        success: false,
        errorMessage: 'Operation Failed',
      };
    }

    const images = await drizzleDb
      .insert(ProductImages)
      .values(
        imagesUrl.map((url) => ({
          url,
        })),
      )
      .returning({
        id: ProductImages.id,
        url: ProductImages.url,
      });

    if (!images || images.length === 0) {
      return {
        success: false,
        errorMessage: 'Operation Failed',
      };
    }

    return {
      success: true,
      images,
      errorMessage: '',
    };
  } catch (error) {
    console.log('[S3UploadAllImagesToBucketAndDbAction]', error);
    return {
      success: true,
    };
  }
};

export const S3DeleteImageFromBucketAndDbAction = async (image: {
  id: number;
  url: string;
}): Promise<{
  success: boolean;
  errorMessage?: string;
}> => {
  try {
    if (!image) {
      return {
        success: false,
        errorMessage: 'Invalid Inputs',
      };
    }

    const segments = image.url.split('/');
    const fileKey = segments[segments.length - 1];

    if (!fileKey) {
      return {
        success: false,
        errorMessage: 'Invalid Inputs',
      };
    }

    const params = {
      Bucket: process.env.LIARA_BUCKET_NAME as string,
      Key: fileKey,
    };

    const res = await s3.send(new DeleteObjectCommand(params));

    if (res.$metadata.httpStatusCode !== 204) {
      return {
        success: false,
        errorMessage: 'Operation failed',
      };
    }

    const [deletedImage] = await drizzleDb
      .delete(ProductImages)
      .where(eq(ProductImages.id, image.id))
      .returning();

    if (!deletedImage) {
      return {
        success: false,
        errorMessage: 'Operation failed',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log('[S3DeleteImageFromBucketAndDbAction]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};

export const S3DeleteAllImagesFromBucketAndDbAction = async (
  images: {
    id: number;
    url: string;
  }[],
): Promise<{
  success: boolean;
  errorMessage?: string;
}> => {
  if (!images || images.length === 0) {
    return {
      success: false,
      errorMessage: 'Invalid Inputs',
    };
  }
  try {
    for (const image of images) {
      try {
        const segments = image.url.split('/');
        const fileKey = segments[segments.length - 1];

        if (!fileKey) {
          return {
            success: false,
            errorMessage: 'Invalid Inputs',
          };
        }

        const params = {
          Bucket: process.env.LIARA_BUCKET_NAME as string,
          Key: fileKey,
        };

        const res = await s3.send(new DeleteObjectCommand(params));

        if (res.$metadata.httpStatusCode !== 204) {
          return {
            success: false,
            errorMessage: 'Operation failed',
          };
        }
      } catch (error) {
        console.log('[S3DeleteAllImagesFromBucketAndDbAction - single]', error);
      }
    }

    const deletedImages = await drizzleDb
      .delete(ProductImages)
      .where(
        inArray(
          ProductImages.id,
          images.map((image) => image.id),
        ),
      )
      .returning();

    return {
      success: true,
    };
  } catch (error) {
    console.log('[S3DeleteAllImagesFromBucketAndDbAction]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};

export const S3DeleteAllImagesOnlyFromBucket = async (
  images: {
    id: number;
    url: string;
  }[],
): Promise<{
  success: boolean;
  errorMessage?: string;
}> => {
  if (!images || images.length === 0) {
    return {
      success: false,
      errorMessage: 'Invalid Inputs',
    };
  }
  try {
    for (const image of images) {
      try {
        const segments = image.url.split('/');
        const fileKey = segments[segments.length - 1];

        if (!fileKey) {
          return {
            success: false,
            errorMessage: 'Invalid Inputs',
          };
        }

        const params = {
          Bucket: process.env.LIARA_BUCKET_NAME as string,
          Key: fileKey,
        };

        const res = await s3.send(new DeleteObjectCommand(params));

        if (res.$metadata.httpStatusCode !== 204) {
          return {
            success: false,
            errorMessage: 'Operation failed',
          };
        }
      } catch (error) {
        console.log('[S3DeleteAllImagesOnlyFromBucket - single]', error);
      }
    }
    return {
      success: true,
    };
  } catch (error) {
    console.log('[S3DeleteAllImagesOnlyFromBucket]', error);
    return {
      success: false,
      errorMessage: 'Internal Error',
    };
  }
};
