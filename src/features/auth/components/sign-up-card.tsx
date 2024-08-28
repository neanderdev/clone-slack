"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
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

interface SignUpCardProps {
    setState: (state: SignInFlow) => void;
};

export function SignUpCard({ setState }: SignUpCardProps) {
    const { signIn } = useAuthActions();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    function onPasswordSignUp(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");

            return;
        }

        setPending(true);

        signIn("password", { name, email, password, flow: "signUp" })
            .catch(() => {
                setError("Something went wrong");
            })
            .finally(() => {
                setPending(false);
            });
    }

    function onProviderSignUp(value: "github" | "google") {
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
                    Sign up to continue
                </CardTitle>
            </CardHeader>

            <CardDescription>
                Use your email or another service to continue
            </CardDescription>

            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mt-4">
                    <TriangleAlert className="size-4" />

                    <p>{error}</p>
                </div>
            )}

            <CardContent className="pt-5 px-0 pb-0">
                <form onSubmit={onPasswordSignUp} className="space-y-2.5">
                    <Input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={pending}
                        required
                    />

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

                    <Input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
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
                        onClick={() => onProviderSignUp("google")}
                        variant="outline"
                        size="lg"
                        disabled={pending}
                    >
                        <FcGoogle className="size-5 absolute top-3 left-2.5" />

                        Continue with Google
                    </Button>

                    <Button
                        className="w-full relative"
                        onClick={() => onProviderSignUp("github")}
                        variant="outline"
                        size="lg"
                        disabled={pending}
                    >
                        <FaGithub className="size-5 absolute top-3 left-2.5" />

                        Continue with Github
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground pt-2.5">
                    Already have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signIn")}>Sign in</span>
                </p>
            </CardContent>
        </Card>
    );
}
