'use server';

import { FileArraySchema } from '@/zod';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY as string,
    secretAccessKey: process.env.LIARA_SECRET_KEY as string,
  },
});

export const S3UploadAction = async (
  data: FormData,
): Promise<
  | {
      success: boolean;
      imagesUrl: string[];
      errorMessage: string;
    }
  | undefined
> => {
  try {
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
        imagesUrl,
        errorMessage: 'فایل غیر مجاز',
      };
    }

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
        console.log('[S3UploadAction - single]', error);
      }
    }

    return {
      success: true,
      imagesUrl,
      errorMessage: '',
    };
  } catch (error) {
    console.log('[S3UploadAction]', error);
  }
};

export const S3DeleteAction = async (
  url: string,
): Promise<
  | {
      success: boolean;
      errorMessage: string;
    }
  | undefined
> => {
  try {
    if (!url) {
      return {
        success: false,
        errorMessage: 'Invalid Inputs',
      };
    }

    const segments = url.split('/');
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
    } else {
      return {
        success: true,
        errorMessage: '',
      };
    }
  } catch (error) {
    console.log('[S3DeleteAction]', error);
  }
};
