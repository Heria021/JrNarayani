import React from 'react';
import { Scaling, BedDouble, Bath, Car, Fence, UserRound, LocateFixedIcon, PhoneCall } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
    return (
        <div className="space-y-6">
            <Card className="p-4">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Scaling className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{project.area} sq.ft</p>
                                <p className="text-xs text-muted-foreground">Total Area</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <BedDouble className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{project.bedRooms} Bedrooms</p>
                                <p className="text-xs text-muted-foreground">Sleeping Rooms</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Bath className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{project.bathRooms} Bathrooms</p>
                                <p className="text-xs text-muted-foreground">Washrooms</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Car className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Parking</p>
                                <p className="text-xs text-muted-foreground">Available</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Fence className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Garden</p>
                                <p className="text-xs text-muted-foreground">Outdoor Space</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Owner Information</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <UserRound className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{project.owner}</p>
                                <p className="text-xs text-muted-foreground">Property Owner</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <LocateFixedIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{project.addressCity}, {project.addressStreet}</p>
                                <p className="text-xs text-muted-foreground">Location</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <PhoneCall className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">{project.contact}</p>
                                <p className="text-xs text-muted-foreground">Contact Number</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <h2 className="text-lg font-semibold text-foreground mb-4">Project Specializations</h2>
                <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool, index) => (
                        <span 
                            key={index} 
                            className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                            {tool}
                        </span>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ProjectDetails;