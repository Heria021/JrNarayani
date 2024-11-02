'use client'
import React from 'react'
import Image from 'next/image'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { use } from 'react'
import ImageGallery from './_components/imageIteration'
import Options from './_components/options'
import ProjectDetails from './_components/details'
import { CalendarIcon } from 'lucide-react'
import Face from '@/components/shared/Face'

type Props = {
    params: {
        projectId: Id<"projects">
    }
}
const ProjectPage = ({ params }: Props) => {
    // @ts-expect-error
    const { projectId } = use(params)
    const project = useQuery(api.upload.fetchProjectEntry, { projectId })
    const bluePrints = useQuery(api.bluePrint.fetchProjectById, { projectId })
    const gallery = useQuery(api.gallery.fetchProjectById, { projectId })

    if (!project) return <div>Loading...</div>;

    return (
        <div className="w-full h-screen p-2 overflow-y-scroll">
            <div className='grid grid-cols-2 gap-4 my-4'>
                <Face projectId={project._id}/>
                <div className="px-6 py-3">
                    <div className="flex relative">
                        <div className="flex-grow pr-4">
                            <h1 className="text-1xl font-semibold text-gray-800 mb-1">Project: {project.projectName}</h1>
                            <p className="text-sm text-gray-700 mb-4 leading-4">{project.description}</p>
                        </div>
                        <div className="absolute top-0 right-0 mr-1 flex items-center justify-center cursor-pointer">
                            <Options projectId={projectId} />
                        </div>
                    </div>
                    <ProjectDetails project={{
                        area: project.area,
                        bedRooms: project.bedRooms,
                        bathRooms: project.bathRooms,
                        owner: project.owner,
                        addressCity: project.addressCity,
                        addressStreet: project.addressStreet,
                        contact: project.contact,
                        tools: project.tools
                    }} />
                    <div className="flex justify-end items-center text-gray-700">
                        <CalendarIcon className="w-4 h-4 mr-1 text-primary" />
                        <p className="text-sm pr-4 font-medium">
                            Finished on: <span className="text-gray-900 font-semibold">{project.startDate}</span>
                        </p>
                    </div>
                </div>
            </div>
            <ImageGallery images={gallery?.uploads} />
            <hr className='border border-border my-4' />
            <ImageGallery images={bluePrints?.uploads} />
        </div>
    )
}

export default ProjectPage