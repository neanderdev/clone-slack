import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValue: string;
};

export function PreferencesModal({ open, setOpen, initialValue }: PreferencesModalProps) {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This action is irreversible.",
    );

    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);

    const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
    const { mutate: removeWorkspace, isPending: isRemovingWorkspace } = useRemoveWorkspace();

    function handleEdit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        updateWorkspace({
            id: workspaceId,
            name: value,
        }, {
            onSuccess: () => {
                toast.success("Workspace updated");

                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update workspace");
            }
        });
    }

    async function handleRemove() {
        const ok = await confirm();

        if (!ok) return;

        removeWorkspace({
            id: workspaceId,
        }, {
            onSuccess: () => {
                toast.success("Workspace removed");

                router.replace("/");
            },
            onError: () => {
                toast.error("Failed to remove workspace");
            }
        });
    }

    return (
        <>
            <ConfirmDialog />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            {value}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold">
                                            Workspace name
                                        </p>

                                        <p className="text-sm text-[#1264A3] hover:underline font-semibold">
                                            Edit
                                        </p>
                                    </div>

                                    <p className="text-sm">
                                        {value}
                                    </p>
                                </div>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename this workspace
                                    </DialogTitle>
                                </DialogHeader>

                                <form className="space-y-4" onSubmit={handleEdit}>
                                    <Input
                                        value={value}
                                        onChange={(event) => setValue(event.target.value)}
                                        placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                                        disabled={isUpdatingWorkspace}
                                        minLength={3}
                                        maxLength={80}
                                        autoFocus
                                        required
                                    />

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={isUpdatingWorkspace}>
                                                Cancel
                                            </Button>
                                        </DialogClose>

                                        <Button type="submit" disabled={isUpdatingWorkspace}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <button
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
                            onClick={handleRemove}
                            disabled={isRemovingWorkspace}
                        >
                            <TrashIcon className="size-4" />

                            <p className="text-sm font-semibold">
                                Delete workspace
                            </p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
