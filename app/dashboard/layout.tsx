"use client"
import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <div className="w-full h-screen flex gap-2 items-center justify-center m-0 p-0">
                <Sidebar/>
                <div className="h-screen w-full flex flex-col">
                    <div className="flex-none">
                        <Header />
                    </div>
                    <div className="flex-grow h-screen overflow-auto p-4">
                        {children}
                    </div>
                </div>
            </div>
    );
}