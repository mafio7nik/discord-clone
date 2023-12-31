import React, { use, useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, } from 'firebase/storage';
import { storage } from '@/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

import { Card, message, Progress } from 'antd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react'; // Import your custom X component here
import Image from 'next/image';
import { set } from 'zod';


interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'messageFile' | 'serverImage';
}

export const FileUpload = ({
  onChange,
  value,
  endpoint,
}: FileUploadProps) => {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [downloadURL, setDownloadURL] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progressUpload, setProgressUpload] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fileIsRemoved, setFileIsRemoved] = useState(false);

  const handleSelectedFile = (files: FileList | null) => {
    if (files && files[0] && files[0].size < 10000000) {
      setImageFile(files[0]);
    } else {
      message.error('File size too large or no file selected');
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      const name = imageFile.name;
      // Replace the following line with your Firebase storage reference setup
      const storageRef = ref(storage, `${endpoint}/${uuidv4()}`);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressUpload(progress);

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          message.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
            onChange(url);
            setIsLoading(true);
          });
        }
      );
    } else {
      message.error('File not found');
    }
  };

  if(!downloadURL && fileIsRemoved === false) {
    console.log('no download url')
    setDownloadURL(value)
    setIsLoading(true)
  }

  const handleRemoveFile = () => {
    setFileIsRemoved(true);
    setImageFile(undefined);
    setDownloadURL('');
    setProgressUpload(0);
  };

  const onInputClick = ( event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }



  return (
    <div className="container mt-5">
      <div className="col-lg-8 offset-lg-2">
        <Input
          type="file"
          placeholder="Select file to upload"
          accept="image/png"
          onChange={(e) => handleSelectedFile(e.target.files)}
          onClick={onInputClick}
        />

        <div className="mt-5">
          {imageFile && (
            <Card hidden={downloadURL !== ""} className='bg-slate-100'>
              {!downloadURL && (
                <div className="text-right items-center">
                  <div className="flex items-center justify-center">
                    <Progress percent={Math.floor(progressUpload)}  className='flex:1 mr-10px'/>
                    <Button
                      disabled={isUploading}
                      type="button"
                      onClick={handleUploadFile}
                      variant='primary'
                      className='mt-0'
                    >
                      Upload
                    </Button>
                  </div>
                  <p>{`Size: ${(imageFile.size / (1024 * 1024)).toFixed(2)} MB`}</p>
                </div>
              )}
            </Card>
          )}
          {downloadURL && (
            <Card className='bg-slate-100'>
                <div className="flex justify-center items-center bg-slate-100">
                  {isLoading && (
                    <div role="status" className="absolute inset-0 flex justify-center items-center" >
                      <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  )}
                  <div className='relative w-20 h-20'>
                    <Image
                      fill
                      src={value}
                      alt="Upload"
                      className={`rounded-full`} // Hide the image if isLoading is true
                      onLoad={() => setIsLoading(false)} // Set isLoading to false when the image is loaded
                      onError={() => setIsLoading(false)} // Set isLoading to false if there's an error loading the image
                    />
                    <button
                    onClick={() => { onChange(""); setIsLoading(true); handleRemoveFile(); }}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  </div>
                </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
