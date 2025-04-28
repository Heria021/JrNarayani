"use client"

import Header from "./_components/header/Header"
import Sidebar from "./_components/sidebar/Sidebar"

interface DashboardWrapperProps {
    header: React.ReactNode;
    sidebar: React.ReactNode;
    children: React.ReactNode;
}

function DashboardWrapper({ header, sidebar, children }: DashboardWrapperProps) {
    return (
        <div className="w-full h-screen flex flex-col bg-background">
            <div className="flex h-full">
                {sidebar}
                <div className="flex flex-col flex-1 min-h-0">
                    {header}
                    <main className="flex-1 overflow-auto p-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DashboardWrapper
            header={<Header />}
            sidebar={<Sidebar />}
        >
            {children}
        </DashboardWrapper>
    );
}