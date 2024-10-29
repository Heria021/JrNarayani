'use client'
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { FolderPlus, MonitorSmartphone, PlusIcon, Sheet } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Page = () => {
  const recentWork = useQuery(api.recents.fetchRecentEntries);
  return (
    <div className="p-4 space-y-4">

      <div className="">
        <div className="">
          <h2 className="font-semibold text-2xl">Project files</h2>
        </div>
        <div className="p-2">
          <div className=" flex items-center gap-4 ">
            <Card className="p-3 min-w-64 cursor-pointer hover:bg-secondary shadow-none">
              <div className="flex justify-between mb-4">
                <div className="p-1 rounded-sm bg-amber-500 text-secondary">
                  <FolderPlus />
                </div>
                <PlusIcon />
              </div>
              <h3 className="font-bold">New Project</h3>
            </Card>
            <Card className="p-3 min-w-64 cursor-pointer hover:bg-secondary shadow-none">
              <div className="flex justify-between mb-4">
                <div className="p-1 rounded-sm bg-green-600 text-secondary">
                  <Sheet />
                </div>
                <PlusIcon />
              </div>
              <h3 className="font-bold">New Datasheet</h3>
            </Card>
            <Card className="p-3 min-w-64 cursor-pointer hover:bg-secondary shadow-none">
              <div className="flex justify-between mb-4">
                <div className="p-1 rounded-sm bg-blue-600 text-secondary">
                  <MonitorSmartphone />
                </div>
                <PlusIcon />
              </div>
              <h3 className="font-bold">Add Portfolio</h3>
            </Card>
          </div>
        </div>
      </div>

      <div className="">
        <hr />
      </div>

      <div className="my-4">
        <h2 className="font-semibold text-2xl">Recent Updates</h2>
        <div className=" grid grid-cols-5 p-2 gap-4 ">
          {recentWork?.map((Item, index) => (
            <Card className=' cursor-pointer' key={index}>
              <CardContent className='p-1'>
                <Image
                  src={'https://cdn.pixabay.com/photo/2024/04/23/11/55/building-8714871_1280.jpg'}
                  alt={''}
                  width={1280}
                  height={853}
                  quality={100}
                  className="object-cover w-full h-full rounded-md"></Image>
              </CardContent>
              <CardFooter className='px-2 bg-gray-50 rounded-b-md'>
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1">
                    <p className='text-xs font-semibold text-gray-600'>Kulkarnis Villa File</p>
                    <p className='text-sm font-bold text-primary leading-none'>{Item.update}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className='text-xs font-medium text-gray-500'>50 mins ago</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="">
        <hr />
      </div>
    </div>
  );
};

export default Page;