/* eslint-disable @typescript-eslint/no-explicit-any */
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as dotenv from 'dotenv';

dotenv.config();

const bucketName = process.env.BUCKET;

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
};

const s3Config: S3ClientConfig = {
  region: "us-east-1",
  credentials: credentials
};

const s3Client = new S3Client(s3Config);

export function uploadFile(fileBuffer: Buffer, fileName: string, mimetype: string): Promise<any> {
  const uploadParams = {
    Bucket: bucketName,
    Body: fileBuffer,
    Key: fileName,
    ContentType: mimetype
  };
  return s3Client.send(new PutObjectCommand(uploadParams));
}

export function deleteFile(fileName: string): Promise<any> {
  const deleteParams = {
    Bucket: bucketName,
    Key: fileName,
  };
  return s3Client.send(new DeleteObjectCommand(deleteParams));
}

export async function getObjectSignedUrl(key: string): Promise<string> {
  const params = {
    Bucket: bucketName,
    Key: key
  };
  const command = new GetObjectCommand(params);
  const seconds = 60;
  const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
  return url;
}