import { NextRequest, NextResponse } from 'next/server';
import { FileArraySchema } from '@/zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: 'default',
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY as string,
    secretAccessKey: process.env.LIARA_SECRET_KEY as string,
  },
});

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const filesArray: File[] = [];

  for (const [, file] of formData.entries()) {
    if (file instanceof File) {
      filesArray.push(file);
    }
  }

  const validatedFiles = FileArraySchema.safeParse(filesArray);
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

  //   console.log(filesArray);

  return NextResponse.json({ success: true });
};
