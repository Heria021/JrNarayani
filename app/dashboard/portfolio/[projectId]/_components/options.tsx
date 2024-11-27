// components/Options.tsx
import React, { useRef } from 'react';
import { EllipsisVertical, FileEdit, PrinterCheck, Upload, Settings, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DeleteProject from './deleteProject';
import { Id } from '@/convex/_generated/dataModel';
import { UpdatesFiles } from './updates';
import EditProjectDialog from './edit';

type OptionsProps = {
    projectId: Id<"projects">;
    project : any
};

const Options = ({ projectId, project }: OptionsProps) => {
    const dialogTriggerRef = useRef<HTMLButtonElement>(null);
    const deleteTriggerRef = useRef<HTMLButtonElement>(null);
    const editTriggerRef = useRef<HTMLButtonElement>(null);

    const handleOpenDialog = () => {
        if (dialogTriggerRef.current) {
            dialogTriggerRef.current.click();
        }
    };
    const handleOpenDelete = () => {
        if (deleteTriggerRef.current) {
            deleteTriggerRef.current.click();
        }
    };
    const handleOpenedit = () => {
        if (editTriggerRef.current) {
            editTriggerRef.current.click();
        }
    };

    return (
        <DropdownMenu>
            <UpdatesFiles projectId={projectId} dialogTriggerRef={dialogTriggerRef} />
            <DeleteProject projectId={projectId} deleteTriggerRef={deleteTriggerRef} />
            <EditProjectDialog project={project} projectId={projectId} editTriggerRef={editTriggerRef} />
            <DropdownMenuTrigger asChild>
                <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleOpenedit} className='cursor-pointer'>
                        <FileEdit />
                        <span>Edit</span>
                        <DropdownMenuShortcut>⌘E+A</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'>
                        <PrinterCheck />
                        <span>Print</span>
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenDialog} className=' cursor-pointer'>
                        <Upload />
                        <span>Uploads</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer'>
                        <Settings />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenDelete} className=' cursor-pointer text-red-800 focus:text-red-800'>
                        <Trash2/>
                        <span>Delete</span>
                        <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Options;