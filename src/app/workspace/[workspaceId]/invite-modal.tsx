import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
};

export function InviteModal({ open, setOpen, name, joinCode }: InviteModalProps) {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are your sure?",
        "This will deactivate the current invite code and generate a new one.",
    );

    const { mutate, isPending } = useNewJoinCode();

    function handleCopy() {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;

        navigator.clipboard
            .writeText(inviteLink)
            .then(() => toast.success("Invite link copied to clipboard"));
    }

    async function handleNewCode() {
        const ok = await confirm();

        if (!ok) return;

        mutate({
            workspaceId,
        }, {
            onSuccess: () => {
                toast.success("Invite code regenerated");
            },
            onError: () => {
                toast.error("Failed to regenerate invite code");
            },
        });
    }

    return (
        <>
            <ConfirmDialog />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to your {name}</DialogTitle>

                        <DialogDescription>
                            Use the code below to invite people to your workspace
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-y-4 items-center justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">
                            {joinCode}
                        </p>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
                        >
                            Copy link

                            <CopyIcon className="size-4 ml-2" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-between w-full">
                        <Button
                            variant="outline"
                            onClick={handleNewCode}
                            disabled={isPending}
                        >
                            New code

                            <RefreshCcw className="size-4 ml-2" />
                        </Button>

                        <DialogClose asChild>
                            <Button>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
