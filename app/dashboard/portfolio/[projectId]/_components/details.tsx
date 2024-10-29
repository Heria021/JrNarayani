import React from 'react';
import { Scaling, BedDouble, Bath, Car, Fence, UserRound, LocateFixedIcon, PhoneCall } from 'lucide-react';

type ProjectDetailsProps = {
    project: {
        area: number;
        bedRooms: number;
        bathRooms: number;
        owner: string;
        addressCity: string;
        addressStreet: string;
        contact: string;
        tools: string[];
    };
};

const ProjectDetails= ({ project }:ProjectDetailsProps) => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-4 pl-2">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Scaling className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">{project.area} sq.ft</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <BedDouble className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">{project.bedRooms} Bedrooms</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Bath className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">{project.bathRooms} Bathrooms</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Car className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">Parking</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Fence className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">Garden</p>
                    </div>
                </div>
            </div>

            <div className="my-2">
                <hr className='border border-primary/60' />
            </div>
            <div>
                <h1 className="text-1xl font-semibold text-gray-800 mb-1">Owner</h1>
            </div>
            <div className="grid grid-cols-2 gap-4 pl-2">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <UserRound className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">{project.owner}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <LocateFixedIcon className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">{project.addressCity}, {project.addressStreet}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <PhoneCall className="w-5 h-5 text-primary" />
                        <p className="text-sm text-primary/75">{project.contact}</p>
                    </div>
                </div>
            </div>

            <div className="my-2">
                <hr className='border border-primary/60' />
            </div>
            <div>
                <h1 className="text-1xl font-semibold text-gray-800 mb-1">Project Specializations</h1>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 pl-2">
                {project.tools.map((tool, index) => (
                    <span key={index} className="px-2 py-1 text-sm rounded border-border border">
                        {tool}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ProjectDetails;