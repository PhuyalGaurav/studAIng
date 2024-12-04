"use client";
import React, { useState, ChangeEvent } from 'react';
import saveImage from '@/utils/saveImage';
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { GPT4oMessagesInput, O1MessagesInput } from '@/lib/types';
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  messages: GPT4oMessagesInput[] | O1MessagesInput[];
  setMessages: React.Dispatch<React.SetStateAction<GPT4oMessagesInput[] | O1MessagesInput[]>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ messages, setMessages }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const imageUrl = await saveImage(formData);

      const message: ChatCompletionMessageParam = {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: imageUrl
            }
          }
        ]
      };

      setIsSuccessful(true);
      setMessages([...messages, message]);
      setUploadResult('Image uploaded successfully! URL: ' + imageUrl);
    } catch (error) {
      console.log(error);
      setUploadResult('An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col flex-grow items-center w-[250px] sm:w-[450px] md:w-[550px] bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-4">Image Upload</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
        <div>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 transition-colors duration-200"
          />
        </div>
        {!isSuccessful && (
          <Button
            type="submit"
            disabled={!file || uploading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        )}
      </form>
      {uploadResult && (
        <p className={`mt-4 text-sm ${uploadResult.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {uploadResult}
        </p>
      )}
    </div>
  );
};

export default ImageUploader;