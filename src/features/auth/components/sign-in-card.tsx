"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { SignInFlow } from "../types";

interface SignInCardProps {
    setState: (state: SignInFlow) => void;
};

export function SignInCard({ setState }: SignInCardProps) {
    const { signIn } = useAuthActions();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pending, setPending] = useState(false);

    function onProviderSignIn(value: "github" | "google") {
        setPending(true);

        signIn(value)
            .finally(() => {
                setPending(false);
            });
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Login to continue
                </CardTitle>
            </CardHeader>

            <CardDescription>
                Use your email or another service to continue
            </CardDescription>

            <CardContent className="pt-5 px-0 pb-0">
                <form className="space-y-2.5">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={pending}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={pending}
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={pending}
                    >
                        Continue
                    </Button>
                </form>

                <Separator />

                <div className="flex flex-col gap-y-2.5 pt-5">
                    <Button
                        className="w-full relative"
                        onClick={() => onProviderSignIn("google")}
                        variant="outline"
                        size="lg"
                        disabled={pending}
                    >
                        <FcGoogle className="size-5 absolute top-3 left-2.5" />

                        Continue with Google
                    </Button>

                    <Button
                        className="w-full relative"
                        onClick={() => onProviderSignIn("github")}
                        variant="outline"
                        size="lg"
                        disabled={pending}
                    >
                        <FaGithub className="size-5 absolute top-3 left-2.5" />

                        Continue with Github
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground pt-2.5">
                    Don&apos;t have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signUp")}>Sign up</span>
                </p>
            </CardContent>
        </Card>
    );
}
