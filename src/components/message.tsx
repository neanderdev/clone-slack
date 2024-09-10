import { format, isToday, isYesterday } from "date-fns";
import dynamic from "next/dynamic";

import { Doc, Id } from "../../convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Hint } from "./hint";
import { Thumbnail } from "./thumbnail";

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
    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                <div className="flex items-start gap-2">
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                            {format(new Date(createdAt), "hh:mm")}
                        </button>
                    </Hint>

                    <div className="flex flex-col w-full">
                        <Renderer value={body} />

                        <Thumbnail url={image} />

                        {updatedAt ? (
                            <span className="text-xs text-muted-foreground">
                                (edited)
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }

    const avatarFallback = authorName.charAt(0).toUpperCase();

    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
            <div className="flex items-start gap-2">
                <button>
                    <Avatar>
                        <AvatarImage src={authorImage} />

                        <AvatarFallback>
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                </button>

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
            </div>
        </div>
    );
}
