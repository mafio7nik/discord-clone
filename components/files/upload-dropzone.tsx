import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/firebaseConfig";
import { Input } from "../ui/input";
import { Progress, message } from "antd";
import { Button } from "../ui/button";

interface UploadDropzoneFirebaseProps {
  endpoint: "messageFile" | "serverImage";
  onClientUploadComplete: (url: string) => void;
  onUploadError: (error: string) => void;
};


const UploadDropzoneFirebase = ({
  endpoint,
  onClientUploadComplete,
  onUploadError,
}: UploadDropzoneFirebaseProps) => {
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [progressUpload, setProgressUpload] = useState<number>(0);

  const handleUploadFile = () => {
    if (imageFile) {
      const name = imageFile.name;
      message.info(`Uploading ${name}...`);
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
          onUploadError(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            onClientUploadComplete(url);
          });
        }
      );
    }
  }


  return (
    <div>
      <Input
        className="bg-indigo-500 text-white hover:bg-indigo-500/90 border-indigo-600 border-0" 
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0])}
      />
      {imageFile && (
        <div className="flex items-center justify-center mt-2">
          <Progress  percent={progressUpload}/>
          <Button onClick={() => handleUploadFile()} variant="primary" type="button">Upload</Button> 
        </div>
      )}
    </div>
  )
}

export default UploadDropzoneFirebase;