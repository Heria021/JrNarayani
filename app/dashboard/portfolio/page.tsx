'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';

interface Project {
  _id: string;
  projectName: string;
  owner: string;
  contact: string;
  addressStreet: string;
  addressCity: string;
  description: string;
  tools: string[];
  uploads: {
    name: string;
    url: string;
    type: string;
    size: number;
    timestamp: string;
  }[];
}


const Page = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const data = useQuery(api.upload.getAllProjects);

  useEffect(() => {
    if (data) {
      setProjects(data);
    }
  }, [data]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-4 h-full overflow-scroll'>
      <div className="grid grid-cols-3 gap-4">
        {projects.map((item) => (
          <Link key={item._id} href={`/dashboard/portfolio/${item._id}`}>
            <Card className="shadow-none hover:shadow-md cursor-pointer relative overflow-hidden group">
              <div className="w-full h-64 relative">
                <Image
                  src={item.uploads[0]?.url || '/default-image.jpg'}
                  alt={item.projectName}
                  width={1280}
                  height={853}
                  quality={100}
                  className="object-cover w-full h-full rounded-sm"
                />
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <div className="z-10 w-full text-white transition-transform duration-300 opacity-0 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0">
                    <p className="font-bold">{item.projectName}</p>
                    <hr className="my-1 border-gray-300" />
                    <p className='text-sm italic line-clamp-4'>{item.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;