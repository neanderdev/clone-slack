"use client";

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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

            <CardContent className="pt-5 px-0 pb-0">
                <form className="space-y-2.5">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        disabled={false}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={false}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        disabled={false}
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={false}
                    >
                        Continue
                    </Button>
                </form>

                <Separator />

                <div className="flex flex-col gap-y-2.5 pt-5">
                    <Button
                        className="w-full relative"
                        onClick={() => { }}
                        variant="outline"
                        size="lg"
                        disabled={false}
                    >
                        <FcGoogle className="size-5 absolute top-3 left-2.5" />

                        Continue with Google
                    </Button>

                    <Button
                        className="w-full relative"
                        onClick={() => { }}
                        variant="outline"
                        size="lg"
                        disabled={false}
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
