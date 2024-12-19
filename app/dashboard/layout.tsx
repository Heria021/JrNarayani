"use client"
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-screen flex gap-2 items-start justify-start m-0 p-0">
            <Sidebar />
            <div className="flex flex-col w-full h-full">
                <Header />
                <div className="flex-1 p-4 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}