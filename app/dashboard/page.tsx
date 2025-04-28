'use client'
import Face from '@/components/shared/Face';
import { Card, CardFooter } from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { FolderPlus, MonitorSmartphone, PlusIcon, Sheet, Receipt, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Estimate {
  _id: Id<"estimate">;
  _creationTime: number;
  clientName: string;
  estimateNumber: string;
  price: {
    total: number;
  };
}

const Page = () => {
  const recentWork = useQuery(api.recents.fetchRecentEntries);
  const recentEstimates = useQuery(api.estimate.getRecentEstimates);

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
    <div className="container mx-auto px-4 py-6 space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Explore More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href={'/dashboard/project'} className="group">
            <Card className="p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-border/50">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <PlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-lg">New Project</h3>
              <p className="text-sm text-muted-foreground mt-1">Start a new project from scratch</p>
            </Card>
          </Link>
          <Link href={'/dashboard/Narayani'} className="group">
            <Card className="p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-border/50">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <PlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-lg">Web Portfolio</h3>
              <p className="text-sm text-muted-foreground mt-1">Create your professional portfolio</p>
            </Card>
          </Link>
          <Link href={'/dashboard/client'} className="group">
            <Card className="p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-border/50">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 rounded-lg bg-[#ff6745]/10 text-[#ff6745] group-hover:bg-[#ff6745]/20 transition-colors">
                  <Sheet className="w-5 h-5" />
                </div>
                <PlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-lg">New Estimate</h3>
              <p className="text-sm text-muted-foreground mt-1">Generate a new client estimate</p>
            </Card>
          </Link>
        </div>
      </section>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Modifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {recentWork === undefined ? (
            // Skeleton loader for recent works
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-border/50">
                <div className="w-full h-40 relative overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
                <CardFooter className="p-4 bg-card/50 backdrop-blur-sm">
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex -space-x-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="w-8 h-8 rounded-md" />
                        ))}
                      </div>
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            recentWork?.slice(0, 5).map((Item, index) => (
              <Card key={index} className="group overflow-hidden transition-all duration-200 hover:shadow-md border-border/50">
                <Link href={`/dashboard/portfolio/${Item.projectId}`}>
                  <div className="w-full h-40 relative overflow-hidden">
                    <Face projectId={Item.projectId} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
                <CardFooter className="p-4 bg-card/50 backdrop-blur-sm">
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium truncate max-w-[200px]">{Item.projectId}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{calculateTimeDifference(Item._creationTime)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex -space-x-2">
                        {Item.uploads && Item.uploads.length > 0 ? (
                          Item.uploads.slice(0, 3).map((upload, index) => (
                            <div 
                              key={index} 
                              className={cn(
                                "relative w-8 h-8 rounded-md overflow-hidden border-2 border-background transition-transform hover:scale-110",
                                upload.type === "application/pdf" ? "bg-muted" : ""
                              )}
                            >
                              {upload.type !== "application/pdf" ? (
                                <Image
                                  src={upload.url}
                                  alt={`Upload ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="w-8 h-8 rounded-md bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary truncate">
                          {Item.update || "No recent updates"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </section>

      <div className="h-px bg-border/50" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Recent Estimates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {recentEstimates === undefined ? (
            // Skeleton loader for estimates
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="group overflow-hidden transition-all duration-200 hover:shadow-md border-border/50">
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            recentEstimates?.map((estimate: Estimate, index: number) => (
              <Card key={index} className="group overflow-hidden transition-all duration-200 hover:shadow-md border-border/50">
                <Link href={`/dashboard/Client/${estimate._id}`}>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="p-2 rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-muted-foreground">{calculateTimeDifference(estimate._creationTime)}</p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg truncate">{estimate.clientName}</h3>
                      <p className="text-sm text-muted-foreground">Estimate #{estimate.estimateNumber}</p>
                      <p className="text-sm font-medium">₹{estimate.price.total.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Page;