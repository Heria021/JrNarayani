// components/Options.tsx
import React, { useRef, useState, useCallback } from 'react';
import { EllipsisVertical, FileEdit, PrinterCheck, Upload, Settings, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteProject from './ProjectDeleteDialog';
import { Id } from '@/convex/_generated/dataModel';
import { UpdatesFiles } from './ProjectUploadDialog';
import EditProjectDialog from './ProjectEditDialog';
import { toast } from 'sonner';

type ProjectOptionsProps = {
    projectId: Id<"projects">;
    project: any;
};

const ProjectOptions = ({ projectId, project }: ProjectOptionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeOption, setActiveOption] = useState<string | null>(null);
    
    const dialogTriggerRef = useRef<HTMLButtonElement>(null);
    const deleteTriggerRef = useRef<HTMLButtonElement>(null);
    const editTriggerRef = useRef<HTMLButtonElement>(null);

    const handleOptionClick = useCallback(async (action: string, handler: () => void) => {
        try {
            setIsLoading(true);
            setActiveOption(action);
            await handler();
        } catch (error) {
            toast.error(`Failed to ${action.toLowerCase()} project`);
            console.error(`Error in ${action}:`, error);
        } finally {
            setIsLoading(false);
            setActiveOption(null);
        }
    }, []);

    const handleOpenDialog = useCallback(() => {
        if (dialogTriggerRef.current) {
            handleOptionClick('Upload', () => {
                dialogTriggerRef.current?.click();
            });
        }
    }, [handleOptionClick]);

    const handleOpenDelete = useCallback(() => {
        if (deleteTriggerRef.current) {
            handleOptionClick('Delete', () => {
                deleteTriggerRef.current?.click();
            });
        }
    }, [handleOptionClick]);

    const handleOpenedit = useCallback(() => {
        if (editTriggerRef.current) {
            handleOptionClick('Edit', () => {
                editTriggerRef.current?.click();
            });
        }
    }, [handleOptionClick]);

    return (
        <DropdownMenu>
            <UpdatesFiles projectId={projectId} dialogTriggerRef={dialogTriggerRef} />
            <DeleteProject projectId={projectId} deleteTriggerRef={deleteTriggerRef} />
            <EditProjectDialog project={project} projectId={projectId} editTriggerRef={editTriggerRef} />
            <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-accent rounded-full transition-colors">
                    <EllipsisVertical className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem 
                        onClick={handleOpenedit} 
                        className={`cursor-pointer ${activeOption === 'Edit' ? 'bg-accent' : ''}`}
                        disabled={isLoading}
                    >
                        <FileEdit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="cursor-pointer"
                        disabled={isLoading}
                    >
                        <PrinterCheck className="mr-2 h-4 w-4" />
                        <span>Print</span>
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleOpenDialog} 
                        className={`cursor-pointer ${activeOption === 'Upload' ? 'bg-accent' : ''}`}
                        disabled={isLoading}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Uploads</span>
                        <DropdownMenuShortcut>⌘U</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        className="cursor-pointer"
                        disabled={isLoading}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        onClick={handleOpenDelete} 
                        className={`cursor-pointer text-red-800 focus:text-red-800 ${activeOption === 'Delete' ? 'bg-red-100' : ''}`}
                        disabled={isLoading}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ProjectOptions;