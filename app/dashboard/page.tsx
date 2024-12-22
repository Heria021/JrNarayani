'use client'
import Face from '@/components/shared/Face';
import { Card, CardFooter } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { FolderPlus, MonitorSmartphone, PlusIcon, Sheet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { DetailsTable } from './Contacts/_components/contact-table';

const Page = () => {
  const recentWork = useQuery(api.recents.fetchRecentEntries);
  const contacts = useQuery(api.contact.getTopContacts);

  function calculateTimeDifference(timestamp: number) {
    const currentTime = Date.now();
    const differenceInMs = currentTime - timestamp;
    const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));
    const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    if (differenceInMinutes < 60) {
      return `${differenceInMinutes} minute${differenceInMinutes === 1 ? "" : "s"} ago`;
    } else if (differenceInHours < 24) {
      return `${differenceInHours} hour${differenceInHours === 1 ? "" : "s"} ago`;
    } else {
      return `${differenceInDays} day${differenceInDays === 1 ? "" : "s"} ago`;
    }
  }

  return (
    <div className="p-2 space-y-4">
      <div className="">
        <div className="">
          <h2 className="font-semibold text-2xl">Explore More</h2>
        </div>
        <div className="p-2">
          <div className=" flex items-center gap-4 ">
            <Link href={'/dashboard/build'}>
              <Card className="p-3 min-w-64 cursor-pointer hover:bg-secondary shadow-none">
                <div className="flex justify-between mb-4">
                  <div className="p-1 rounded-sm bg-amber-500 text-secondary">
                    <FolderPlus />
                  </div>
                  <PlusIcon />
                </div>
                <h3 className="font-bold">New Project</h3>
              </Card>
            </Link>
            <Link href={'/dashboard/narayani'}>
              <Card className="p-3 min-w-64 cursor-pointer hover:bg-secondary shadow-none">
                <div className="flex justify-between mb-4">
                  <div className="p-1 rounded-sm bg-blue-600 text-secondary">
                    <MonitorSmartphone />
                  </div>
                  <PlusIcon />
                </div>
                <h3 className="font-bold">Web Portfolio</h3>
              </Card>
            </Link>
            <Link href={'/dashboard/Client'}>
              <Card className="p-3 min-w-64 cursor-pointer hover:bg-secondary shadow-none">
                <div className="flex justify-between mb-4">
                  <div className="p-1 rounded-sm bg-[#ff6745] text-secondary">
                    <Sheet />
                  </div>
                  <PlusIcon />
                </div>
                <h3 className="font-bold">New Estimate</h3>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      <div className="">
        <hr />
      </div>

      <div className="my-4">
        <h2 className="font-semibold text-2xl">Recent Modifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-2 gap-4">
          {recentWork?.slice(0, 5).map((Item, index) => (
            <Card className="cursor-pointer" key={index}>
              <Link href={`/dashboard/portfolio/${Item.projectId}`}>
                <div className="w-full h-40">
                  <Face projectId={Item.projectId} />
                </div>
              </Link>
              <CardFooter className="p-2 bg-gray-50 rounded-b-md flex flex-col gap-1 flex-grow">
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1 flex-1">
                    <p className="text-xs font-semibold text-gray-600 max-w-28 truncate">{Item.projectId}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs font-medium text-gray-500">{calculateTimeDifference(Item._creationTime)}</p>
                  </div>
                </div>
                <div className="relative flex gap-6 justify-start items-center w-full">
                  <div className="relative w-20 h-10 flex items-center">
                    {Item.uploads && Item.uploads.length > 0 ? (
                      Item.uploads.slice(0, 3).map((upload, index) => (
                        upload.type !== "application/pdf" ?
                          <Image
                            key={index}
                            src={upload.url}
                            alt={`Upload ${index + 1}`}
                            width={1280}
                            height={853}
                            quality={100}
                            className="absolute top-0 w-8 h-10 object-cover rounded-sm z-10 border border-border"
                            style={{
                              left: `${index * 10}px`,
                            }}
                          />
                          :
                          <Image
                            key={index}
                            src={'/images/pdf-svgrepo-com.png'}
                            alt={`Upload ${index + 1}`}
                            width={1280}
                            height={853}
                            quality={100}
                            className="absolute top-0 w-8 h-10 object-cover rounded-sm z-10 border border-border"
                            style={{
                              left: `${index * 10}px`,
                            }}
                          />

                      ))
                    ) : (
                      <span className="w-8 h-10"></span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-primary leading-none">{Item.update}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="">
        <hr />
      </div>

      <div className="">
        <h2 className="font-semibold text-2xl">Incoming Contact Requests</h2>
        <div className="p-2">
          <div className="border-border border rounded-sm overflow-hidden ">
            <DetailsTable data={contacts || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;