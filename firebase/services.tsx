import { storage } from "@/lib/firebase";
import { ref, uploadBytes, deleteObject, getDownloadURL, uploadBytesResumable } from "firebase/storage";

interface FileInput extends File {
  name: string;
}

interface UploadFileResponse {
  timestamp: number;
  name: string;
  size: number;
  type: string;
  url: string;
}

export const uploadFile = async (file: FileInput, onUploadProgress?: (progress: number) => void): Promise<UploadFileResponse> => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `uploads/${timestamp}_${file.name}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file);
  console.log(uploadTask);

  return new Promise<UploadFileResponse>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onUploadProgress) onUploadProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          timestamp,
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        });
      }
    );
  });
};

export const deleteFile = async (fileId: string) => {
  const fileRef = ref(storage, `uploads/${fileId}`);
  
  try {
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file: ", error);
  }
};

export const getFileURL = async (fileId: string) => {
  const fileRef = ref(storage, `uploads/${fileId}`);
  
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error fetching file URL: ", error);
  }
};



// Folder
export const uploadFileToFolder = async (
  file: FileInput,
  folderId: string, 
  onUploadProgress?: (progress: number) => void
): Promise<UploadFileResponse> => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `${folderId}/${timestamp}_${file.name}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise<UploadFileResponse>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onUploadProgress) onUploadProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({
          timestamp,
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        });
      }
    );
  });
};