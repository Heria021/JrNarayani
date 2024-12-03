'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';

type ProjectCardProps = {
    project: {
        _id: Id<"portfolio">;
        projectName: string;
        description: string;
        uploads: { url: string }[];
    };
    onDelete: (portfolioId: Id<"portfolio">) => void;
};

const SharedProjects = ({ project, onDelete }: ProjectCardProps) => (
    <Card key={project._id} className="shadow-none hover:shadow-md cursor-pointer relative overflow-hidden">
        <div className="w-full h-48 relative">
            <Image
                src={project.uploads[0]?.url || '/default-image.jpg'}
                alt={project.projectName}
                width={1280}
                height={853}
                quality={100}
                className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-4">
                <div className="flex justify-end">
                    <button className="rounded-full text-green-500" aria-label="Project Verified" onClick={() => onDelete(project._id)}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
                <div className="z-10 w-full text-white transition-transform duration-300 opacity-100">
                    <p className="font-bold text-sm">{project.projectName}</p>
                    <hr className="border-gray-300" />
                    <p className="text-xs italic line-clamp-2">{project.description}</p>
                </div>
            </div>
        </div>
    </Card>
);

export default SharedProjects;