"use client";

import { Toolbar } from "./toolbar";

interface WorkspaceIdLayoutProps {
    children: React.ReactNode;
};

export default function WorkspaceIdLayout({ children }: WorkspaceIdLayoutProps) {
    return (
        <div className="h-full">
            <Toolbar />

            {children}
        </div>
    );
}
