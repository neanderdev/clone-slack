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

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { useCreateChannel } from "../api/use-create-channel";

import { useCreateChannelModal } from "../store/use-create-channel-modal";

export function CreateChannelModal() {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useCreateChannel();
    const [open, setOpen] = useCreateChannelModal();

    const [name, setName] = useState("");

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value.replace(/\s+/g, "-").toLowerCase();

        setName(value);
    }

    function handleClose() {
        setName("");
        setOpen(false);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        mutate({
            name, workspaceId,
        }, {
            onSuccess: (id) => {
                toast.success("Channel created");

                router.push(`/workspace/${workspaceId}/channel/${id}`);

                handleClose();
            },
            onError: () => {
                toast.error("Failed to create channel");
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        placeholder="e.g. plan-budget"
                        value={name}
                        onChange={handleChange}
                        minLength={3}
                        maxLength={80}
                        disabled={isPending}
                        autoFocus
                        required
                    />

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
