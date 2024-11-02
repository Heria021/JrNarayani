'use client';
import { useEffect, useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Home } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { Input } from '@/components/ui/input';
import { Id } from '@/convex/_generated/dataModel';
import SharedProjects from './_componenets/SharedProjects';
import SearchedProjects from './_componenets/SearchedProjects';

type Project = {
  _id: Id<"portfolio">;
  _creationTime: number;
  projectId: Id<"projects">;
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
        const portfolioEntry = await createPortfolioEntry({projectId: response._id});
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
        {projectName && <SearchedProjects response={response} handleUploadClick={handleUploadClick}/>}
      </div>
      <div className="grid grid-cols-4 gap-4">
        {projects.map((item, index) => (
          <SharedProjects key={index} onDelete={handleDelete} project={item}/>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
