import { ImageIcon, Smile, XIcon } from "lucide-react";
import Image from "next/image";
import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";

import { cn } from "@/lib/utils";

import { EmojiPopover } from "./emoji-popover";
import { Hint } from "./hint";
import { Button } from "./ui/button";

import "quill/dist/quill.snow.css";

type EditorValue = {
    image: File | null;
    body: string;
};

interface EditorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update";
};

export function Editor({
    onSubmit,
    onCancel,
    placeholder = "Write something...",
    defaultValue = [],
    disabled = false,
    innerRef,
    variant = "create",
}: EditorProps) {
    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);

    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabledRef = useRef(disabled);
    const imageElementRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                const text = quill.getText();
                                const addedImage = imageElementRef.current?.files?.[0] || null;

                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                                if (isEmpty) return;

                                const body = JSON.stringify(quill.getContents());

                                submitRef.current?.({ body, image: addedImage });
                            },
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            },
                        },
                    },
                },
            },
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus();

        if (innerRef) {
            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        });

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);

            if (container) {
                container.innerHTML = "";
            }

            if (quillRef.current) {
                quillRef.current = null;
            }

            if (innerRef) {
                innerRef.current = null;
            }
        };
    }, [innerRef]);

    function toggleToolbar() {
        setIsToolbarVisible((current) => !current);

        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden");
        }
    }

    function onEmojiSelect(emojiValue: string) {
        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0, emojiValue);
    }

    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={imageElementRef}
                onChange={(event) => setImage(event.target.files![0])}
            />

            <div
                className={cn(
                    "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
                    disabled && "opacity-50"
                )}
            >
                <div ref={containerRef} className="h-full ql-custom"></div>

                {!!image && (
                    <div className="p-2">
                        <div className="relative size-[62px] flex items-center justify-center group/image">
                            <Hint label="Remove image">
                                <button
                                    className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                                    onClick={() => {
                                        setImage(null);

                                        imageElementRef.current!.value = "";
                                    }}
                                >
                                    <XIcon className="size-3.5" />
                                </button>
                            </Hint>

                            <Image
                                className="rounded-xl overflow-hidden border object-cover"
                                src={URL.createObjectURL(image)}
                                alt="Uploaded"
                                fill
                            />
                        </div>
                    </div>
                )}

                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
                        <Button
                            onClick={toggleToolbar}
                            variant="ghost"
                            size="iconSm"
                            disabled={disabled}
                        >
                            <PiTextAa className="size-4" />
                        </Button>
                    </Hint>

                    <EmojiPopover onEmojiSelect={onEmojiSelect}>
                        <Button
                            variant="ghost"
                            size="iconSm"
                            disabled={disabled}
                        >
                            <Smile className="size-4" />
                        </Button>
                    </EmojiPopover>

                    {variant === "create" && (
                        <Hint label="Image">
                            <Button
                                onClick={() => imageElementRef.current?.click()}
                                variant="ghost"
                                size="iconSm"
                                disabled={disabled}
                            >
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    )}

                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                onClick={onCancel}
                                variant="outline"
                                size="sm"
                                disabled={disabled}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                                onClick={() => {
                                    onSubmit({
                                        body: JSON.stringify(quillRef.current?.getContents()),
                                        image,
                                    });
                                }}
                                size="sm"
                                disabled={disabled || isEmpty}
                            >
                                Save
                            </Button>
                        </div>
                    )}

                    {variant === "create" && (
                        <Button
                            onClick={() => {
                                onSubmit({
                                    body: JSON.stringify(quillRef.current?.getContents()),
                                    image,
                                });
                            }}
                            className={cn(
                                "ml-auto",
                                isEmpty
                                    ? "bg-white hover:bg-white text-muted-foreground"
                                    : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                            )}
                            size="iconSm"
                            disabled={disabled || isEmpty}
                        >
                            <MdSend className="size-4" />
                        </Button>
                    )}
                </div>
            </div>

            {variant === "create" && (
                <div
                    className={cn(
                        "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                        !isEmpty && "opacity-100",
                    )}
                >
                    <p>
                        <strong>Shift + Return</strong> to add a new line
                    </p>
                </div>
            )}
        </div>
    );
}
