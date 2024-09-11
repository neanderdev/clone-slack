import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";
import { toast } from "sonner";

import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";

import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

import { Doc, Id } from "../../convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Hint } from "./hint";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";

const Editor = dynamic(() => import("./editor").then((mod) => mod.Editor), { ssr: false });
const Renderer = dynamic(() => import("./renderer").then((mod) => mod.Renderer), { ssr: false });

interface MessageProps {
    id: Id<"messages">;
    memberId: Id<"members">;
    authorImage?: string;
    authorName?: string;
    isAuthor: boolean;
    reactions?: Array<
        Omit<Doc<"reactions">, "memberId"> & {
            count: number;
            memberIds: Id<"members">[];
        }
    >;
    body: Doc<"messages">["body"];
    image: string | null | undefined;
    createdAt: Doc<"messages">["_creationTime"];
    updatedAt: Doc<"messages">["updatedAt"];
    isEditing: boolean;
    setEditingId: (id: Id<"messages"> | null) => void;
    isCompact?: boolean;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number;
};

function formatFullTime(date: Date) {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
}

export function Message({
    id,
    memberId,
    authorImage,
    authorName = "Member",
    isAuthor,
    reactions,
    body,
    image,
    createdAt,
    updatedAt,
    isEditing,
    setEditingId,
    isCompact,
    hideThreadButton,
    threadCount,
    threadImage,
    threadTimestamp
}: MessageProps) {
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete message",
        "Are you sure you want to delete this message? This cannot be undone.",
    );

    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage();
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage();

    const isPending = isUpdatingMessage || isRemovingMessage;

    function handleUpdate({ body }: { body: string }) {
        updateMessage({ id, body }, {
            onSuccess: () => {
                toast.error("Message updated");

                setEditingId(null);
            },
            onError: () => {
                toast.error("Failed to update message");
            },
        });
    }

    async function handleRemove() {
        const ok = await confirm();

        if (!ok) return;

        removeMessage({ id }, {
            onSuccess: () => {
                toast.error("Message deleted");

                // TODO: Close thread if opened
            },
            onError: () => {
                toast.error("Failed to delete message");
            },
        });
    }

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />

                <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                    <div className="flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt), "hh:mm")}
                            </button>
                        </Hint>

                        {isEditing ? (
                            <div className="w-full h-full">
                                <Editor
                                    variant="update"
                                    onSubmit={handleUpdate}
                                    onCancel={() => setEditingId(null)}
                                    defaultValue={JSON.parse(body)}
                                    disabled={isPending}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <Renderer value={body} />

                                <Thumbnail url={image} />

                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">
                                        (edited)
                                    </span>
                                ) : null}
                            </div>
                        )}
                    </div>

                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => { }}
                            handleDelete={handleRemove}
                            handleReaction={() => { }}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        );
    }

    const avatarFallback = authorName.charAt(0).toUpperCase();

    return (
        <>
            <ConfirmDialog />

            <div
                className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200",
                )}
            >
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage src={authorImage} />

                            <AvatarFallback>
                                {avatarFallback}
                            </AvatarFallback>
                        </Avatar>
                    </button>

                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                variant="update"
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingId(null)}
                                defaultValue={JSON.parse(body)}
                                disabled={isPending}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button
                                    className="font-bold text-primary hover:underline"
                                    onClick={() => { }}
                                >
                                    {authorName}
                                </button>

                                <span>&nbsp;&nbsp;</span>

                                <Hint label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {format(new Date(createdAt), "h:mm a")}
                                    </button>
                                </Hint>
                            </div>

                            <Renderer value={body} />

                            <Thumbnail url={image} />

                            {updatedAt ? (
                                <span className="text-xs text-muted-foreground">
                                    (edited)
                                </span>
                            ) : null}
                        </div>
                    )}
                </div>

                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => { }}
                        handleDelete={handleRemove}
                        handleReaction={() => { }}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        </>
    );
}
