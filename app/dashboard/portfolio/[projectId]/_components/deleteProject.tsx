import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import React, { forwardRef, useState } from 'react';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

type DeleteProps = {
    projectId: Id<"projects">;
    deleteTriggerRef?: React.RefObject<HTMLButtonElement>;
};

const DeleteProject = forwardRef<HTMLButtonElement, DeleteProps>(({ projectId, deleteTriggerRef }, ref) => {
    const [confirmationText, setConfirmationText] = useState('');
    const deleteProject = useMutation(api.upload.deleteProject);

    const router = useRouter();
    const handleDelete = async () => {
        if (confirmationText === `Heria@${projectId}`) {
            router.push('/dashboard/portfolio')
            await deleteProject({ id: projectId });
        } else {
            alert("Confirmation text does not match.");
        }
    };

    return (
        <Dialog>
            <DialogTrigger ref={deleteTriggerRef} />
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                        Type <strong>{`Heria@${projectId}`}</strong> in the box below to delete project.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="confirmation" className="sr-only">
                            Confirmation
                        </Label>
                        <Input
                            id="confirmation"
                            placeholder={`${projectId}`}
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-end">
                    <Button type="button" variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
});

export default DeleteProject;