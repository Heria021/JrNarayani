import { FileText, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

interface UploadResponse {
  name: string;
  url: string;
  type: string;
  size: number;
  timestamp: string;
}

interface VideoProps {
  src: string;
  alt?: string;
  className?: string;
}

interface FileCardProps {
  uploadResponses: UploadResponse[];
  handleDelete: (name: string, timestamp: string) => void;
}

const Video = ({ src, alt, className }: VideoProps) => (
  <video className={className}>
    <source src={src} type="video/mp4" />
    {alt || "Your browser does not support the video tag."}
  </video>
);

export const FileCard = ({ uploadResponses, handleDelete }: FileCardProps) => {
  if (uploadResponses.length === 0) {
    return (
      <div className="flex w-full h-full items-center justify-center flex-col gap-2">
        <div className="flex items-center justify-center">
          <FileText size={48} strokeWidth={1} />
        </div>
        <p className="text-sm font-semibold">No Files Uploaded</p>
      </div>
    ); 
  }
  return (
    <div className="grid grid-cols-2 gap-4 text-white overflow-auto">
      {uploadResponses.map((response) => (
        <div key={response.timestamp} className="relative overflow-hidden group rounded-md">
          {response.type === 'video/quicktime' ? (
            <Video
              src={response.url}
              alt={response.name}
              className="object-contain w-full max-h-52"
            />
          ) : (
            <Image
              src={response.url}
              alt={response.name}
              width={1280}
              height={853}
              quality={100}
              className="object-contain w-full max-h-52"
            />
          )}

          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between bg-gradient-to-t from-black/70 to-transparent p-2 transition-opacity duration-300 opacity-100 group-hover:opacity-100">
            <div className="cursor-pointer p-1 rounded-sm flex justify-end ">
              <div className="rounded-sm bg-black">
                <Trash2Icon
                  className='p-1 cursor-pointer'
                  onClick={() => handleDelete(response.name, response.timestamp)}
                />
              </div>
            </div>
            <div className="">
              <div className="flex items-center justify-between gap-1">
                <p className="font-bold text-xs truncate whitespace-nowrap">{response.name}</p>
                <p className='text-xs'>{(response.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
              <hr className="my-1" />
              <p className="text-xs font-medium">{response.type}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};