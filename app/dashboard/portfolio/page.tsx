'use client';

import { Card } from '@/components/ui/card';
import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { Id } from '@/convex/_generated/dataModel';
import { Face } from '@/components/shared/Face';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, SortAsc, SortDesc } from 'lucide-react';

interface Project {
  _id: string;
  projectName: string;
  owner: string;
  contact: string;
  addressStreet: string;
  addressCity: string;
  description: string;
  tools: string[];
}

const ProjectCard = React.memo(({ project }: { project: Project }) => (
  <Link href={`/dashboard/portfolio/${project._id}`}>
    <Card className="shadow-none hover:shadow-md cursor-pointer relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
      <div className="w-full h-64 relative">
        <Face projectId={project._id as Id<'projects'>}/>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <div className="z-10 w-full text-white transition-transform duration-300 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0">
            <p className="font-bold">{project.projectName}</p>
            <hr className="my-1 border-gray-300" />
            <p className='text-sm italic line-clamp-4'>{project.description}</p>
          </div>
        </div>
      </div>
    </Card>
  </Link>
));

ProjectCard.displayName = 'ProjectCard';

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="shadow-none">
        <Skeleton className="w-full h-64" />
      </Card>
    ))}
  </div>
);

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const data = useQuery(api.upload.getAllProjects);

  const filteredProjects = useMemo(() => {
    if (!data) return [];
    
    return data.filter(project => 
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  if (!data) {
    return (
      <div className='p-4 h-full overflow-scroll'>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col'>
      <div className="p-4 sticky top-0 bg-background z-10 border-b">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {data.length} projects
          </p>
        </div>
      </div>

      <div className="p-4 overflow-auto flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;