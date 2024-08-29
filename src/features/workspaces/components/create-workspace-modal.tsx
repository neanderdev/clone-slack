import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";

import { useCreateWorkspace } from "../api/use-create-workspace";

export function CreateWorkspaceModal() {
    const router = useRouter();
    const [name, setName] = useState("");

    const [open, setOpen] = useCreateWorkspaceModal();

    const { mutate, isPending } = useCreateWorkspace();

    function handleClose() {
        setOpen(false);
        setName("");
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        mutate({ name }, {
            onSuccess(id) {
                toast.success("Workspace created");

                router.push(`/workspace/${id}`);

                handleClose();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                        disabled={isPending}
                        minLength={3}
                        autoFocus
                        required
                    />

                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
