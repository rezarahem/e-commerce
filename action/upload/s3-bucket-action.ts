'use server';

import { FileListSchema } from '@/schemas';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY as string,
    secretAccessKey: process.env.LIARA_SECRET_KEY as string,
  },
});

// export async function s3UploadAction(data: FormData) {
//   const file: File | null = data.get('file') as File;
//   if (!file) throw new Error('no file');
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   const supImage = `${Date.now()}_${file.name}`;

//   const params = {
//     Body: buffer,
//     Bucket: process.env.LIARA_BUCKET_NAME as string,
//     Key: supImage,
//   };

//   try {
//     await s3.send(new PutObjectCommand(params));
//     return {
//       success: true,
//       imagePath: `https://sup.storage.iran.liara.space/${supImage}`,
//     };
//   } catch (error) {
//     return {
//       error,
//     };
//   }
// }

export const S3UploadAction = async (data: FormData) => {
  const filesArray: File[] = [];

  for (const [, file] of data.entries()) {
    if (file instanceof File) {
      filesArray.push(file);
    }
  }

  const validatedFiles = FileListSchema.safeParse(filesArray);
  if (!validatedFiles.success) {
    console.log('not good-server');
    return;
  }

  for (const file of filesArray) {
    const bytes = await file.arrayBuffer();

    const params = {
      Body: Buffer.from(bytes),
      Bucket: process.env.LIARA_BUCKET_NAME as string,
      Key: `${Date.now()}_${file.name}`,
      ContentType: file.type,
    };

    try {
      await s3.send(new PutObjectCommand(params));
      console.log(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      throw error; // Optionally rethrow the error to handle it further up
    }
  }

  console.log('ok');
};
