'use client'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import ImageGallery from './_components/ImageGallery'
import ProjectOptions from './_components/ProjectOptions'
import ProjectDetails from './_components/ProjectDetails'
import { CalendarIcon } from 'lucide-react'
import Face from '@/components/shared/Face'
import { useParams } from 'next/navigation'

const ProjectPage = () => {
    const { projectId } = useParams<{projectId: Id<"projects">}>();
    // const db = getFirestore();
    // const projectRef = collection(db, 'projects');
    const project = useQuery(api.upload.fetchProjectEntry, { projectId })
    const bluePrints = useQuery(api.bluePrint.fetchProjectById, { projectId })
    const gallery = useQuery(api.gallery.fetchProjectById, { projectId })
    if (!project) return <div>Loading...</div>;

    return (
        <div className="w-full min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative rounded-lg overflow-hidden shadow-lg max-h-[400px] flex items-center justify-center">
                        <div className="w-full h-full">
                            <Face projectId={project._id}/>
                        </div>
                    </div>
                    <div className="bg-card rounded-lg shadow-lg p-6 space-y-6">
                        <div className="flex relative">
                            <div className="flex-grow pr-4">
                                <h1 className="text-2xl font-semibold text-foreground mb-2">Project: {project.projectName}</h1>
                                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                            </div>
                            <div className="absolute top-0 right-0">
                                <ProjectOptions projectId={projectId} project={project} />
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
                        <div className="flex items-center justify-end text-muted-foreground">
                            <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                            <p className="text-sm font-medium">
                                Finished on: <span className="text-foreground font-semibold">{project.startDate}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Blueprints & Plans</h2>
                        <ImageGallery images={bluePrints?.uploads} usePdfImage={true} />
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">Project Gallery</h2>
                        <ImageGallery images={gallery?.uploads} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectPage