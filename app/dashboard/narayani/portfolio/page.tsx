'use client';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Home, Trash2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Id } from '@/convex/_generated/dataModel';

type Project = {
  _id: Id<"portfolio">;
  _creationTime: number;
  id: Id<"projects">;
  projectName: string;
  description: string;
  uploads: {
    type: string;
    name: string;
    url: string;
    size: number;
    timestamp: string;
  }[];
};
const Portfolio = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const data = useQuery(api.portfolio.getAllPortfolioEntries);
  const createPortfolioEntry = useMutation(api.portfolio.createPortfolioEntry);
  const [projectName, setProjectName] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [debouncedProjectName, setDebouncedProjectName] = useState(projectName);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProjectName(projectName);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [projectName]);

  const project = useQuery(api.upload.getProjectByName, { projectName: debouncedProjectName });

  useEffect(() => {
    if (debouncedProjectName) {
      setResponse(project);
    } else {
      setResponse(null);
    }
  }, [project, debouncedProjectName]);

  useEffect(() => {
    if (data) setProjects(data);
  }, [data]);


  const handleUploadClick = async () => {
    if (response) {

      try {
        const portfolioEntry = await createPortfolioEntry({
          projectName: response.projectName,
          description: response.description,
          uploads: response.uploads,
          projectId: response._id,
        });
        setProjectName('')
        console.log('Portfolio entry created:', portfolioEntry);
      } catch (error) {
        console.error('Error creating portfolio entry:', error);
      }
    }
  };

  const deletePortfolioEntry = useMutation(api.portfolio.deletePortfolioEntry);

  const handleDelete = async (portfolioId: Id<"portfolio"> | undefined) => {
    if (portfolioId) {
      try {
        await deletePortfolioEntry({ portfolioId });
        console.log("Portfolio entry deleted successfully");
      } catch (error) {
        console.error("Failed to delete portfolio entry:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <div className=" space-y-2 my-2">
        <div className="relative">
          <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " strokeWidth={1.4} />
          <Input
            placeholder="Type here..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border px-4 py-5 rounded-xl w-full pl-10"
          />
        </div>
        {projectName &&

          <div className="h-48">
            <div className="w-full h-full grid grid-cols-4 gap-4">
              {!response ? (
                <>
                  <Skeleton className="w-full h-full rounded-xl" />
                  <div className="flex flex-col justify-between pb-4">
                    <div className=" space-y-1">
                      <Skeleton className="h-4 w-full max-w-[250px]" />
                      <Skeleton className="h-4 w-full leading-none max-w-[200px]" />
                      <Skeleton className="h-4 w-full leading-none max-w-[300px]" />
                      <Skeleton className="h-4 w-full leading-none max-w-[200px]" />
                    </div>
                    <Skeleton className="h-10 w-full max-w-[100px]" />
                  </div>
                </>
              ) : (
                <>
                  <Image
                    src={response.uploads[0]?.url || '/default-image.jpg'}
                    alt={response.projectName}
                    width={1280}
                    height={853}
                    quality={100}
                    className="object-cover overflow-hidden w-full h-full rounded-sm"
                  />
                  <div className="flex flex-col justify-between space-y-2 pb-4">
                    <div className="">
                      <h3 className="font-bold text-sm">{response.projectName}</h3>
                      <p className="text-sm line-clamp-3">{response.description}</p>
                      <h3 className="text-sm">
                        <span className="font-bold">Owner: </span> {response.owner}
                      </h3>
                    </div>
                    <div className="flex items-center justify-start">
                      <Button className="font-bold" onClick={handleUploadClick}>Upload</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        }
      </div>
      <div className="grid grid-cols-4 gap-4">
        {projects.map((item) => (
          <Card key={item._id} className="shadow-none hover:shadow-md cursor-pointer relative overflow-hidden">
            <div className="w-full h-44 relative">
              <Image
                src={item.uploads[0]?.url || '/default-image.jpg'}
                alt={item.projectName}
                width={1280}
                height={853}
                quality={100}
                className="object-cover w-full h-full rounded-sm"
              />
              <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button className="rounded-full text-green-500" aria-label="Project Verified" onClick={() => handleDelete(item._id)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="z-10 w-full text-white transition-transform duration-300 opacity-100">
                  <p className="font-bold text-sm">{item.projectName}</p>
                  <hr className="border-gray-300" />
                  <p className="text-xs italic line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;