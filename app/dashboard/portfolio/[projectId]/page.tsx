'use client'
import React from 'react'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Bath, BedDouble, CalendarIcon, Car, EllipsisVertical, Fence, FileEdit, LocateFixedIcon, PhoneCall, PrinterCheck, Scaling, Settings, UserRound } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UpdatesFiles } from '../../_components/Updates'
import { use } from 'react' 

type Props = {
    params: {
        projectId: Id<"projects">
    }
}

const ProjectPage = ({ params }: Props) => {
    // @ts-ignore
    const { projectId } = use(params) 
    
    const project = useQuery(api.upload.fetchProjectEntry, { projectId })
    const bluePrints = useQuery(api.bluePrint.fetchProjectById, { projectId })

    if (!project) return <div>Loading...</div>

    return (
        <div className="w-full h-screen p-2 overflow-y-scroll">
            <div className='grid grid-cols-2 gap-4 my-4'>
                {project.uploads?.[0] && (
                    <Image
                        src={project.uploads[0].url}
                        alt="Main"
                        width={1280}
                        height={853}
                        quality={100}
                        className="object-cover w-full h-full rounded-sm"
                    />
                )}
                <div className="px-6 py-3">
                    <div className="flex">
                        <div className="flex-grow">
                            <h1 className="text-1xl font-semibold text-gray-800 mb-1">Project: {project.projectName}</h1>
                            <p className="text-sm text-gray-700 mb-4 leading-4">{project.description}</p>
                        </div>
                        <div className="">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <EllipsisVertical />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <FileEdit />
                                            <span>Edit</span>
                                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <PrinterCheck />
                                            <span>Print</span>
                                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <UpdatesFiles projectId={project._id} />
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <Settings />
                                            <span>Settings</span>
                                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    {/* Project Details Section */}
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
                    {/* Additional Information */}
                    <div className="my-2">
                        <hr className='border border-primary/60' />
                    </div>
                    <div className="">
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
                    {/* Project Specializations */}
                    <div className="my-2">
                        <hr className='border border-primary/60' />
                    </div>
                    <div className="">
                        <h1 className="text-1xl font-semibold text-gray-800 mb-1">Project Specializations</h1>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 pl-2">
                        {project.tools.map((tool, index) => (
                            <span key={index} className="px-2 py-1 text-sm rounded border-border border">
                                {tool}
                            </span>
                        ))}
                    </div>
                    <div className="flex justify-end items-center text-gray-700">
                        <CalendarIcon className="w-4 h-4 mr-1 text-primary" />
                        <p className="text-sm pr-4 font-medium">
                            Finished on: <span className="text-gray-900 font-semibold">{project.startDate}</span>
                        </p>
                    </div>
                </div>
            </div>
            {/* Additional Project Images */}
            <div className="grid grid-cols-3 gap-2">
                {project.uploads.map((image, index) => (
                    <div key={index} className="flex flex-col items-center h-80 group">
                        <Image
                            src={image.url}
                            alt={image.name}
                            width={1280}
                            height={853}
                            quality={100}
                            className="object-cover w-full h-full rounded-sm transition-transform duration-300 ease-out transform group-hover:scale-95 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
                {bluePrints?.uploads.map((image, index) => (
                    <div key={index} className="flex flex-col items-center h-80 group">
                        <Image
                            src={image.url}
                            alt={image.name}
                            width={1280}
                            height={853}
                            quality={100}
                            className="object-cover w-full h-full rounded-sm transition-transform duration-300 ease-out transform group-hover:scale-95 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProjectPage