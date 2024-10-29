"use client"
import { BookUser, FolderClosed, HelpCircle, Home, LayoutGridIcon, MonitorSmartphoneIcon, Settings } from "lucide-react";
import Header from "./_components/header/Header";
import Link from "next/link";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <div className="w-full h-screen flex gap-2 items-center justify-center">
                <div className="w-64 md:w-72 lg:w-80 h-screen border-r shadow-sm border-border">
                    <div className="flex flex-col justify-between w-full h-full p-2">
                        <div className=" p-2 flex flex-col gap-4 justify-between">
                            <div className=" flex gap-2">
                                <div className=" flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full">
                                            <img
                                                src="https://i.pinimg.com/280x280_RS/41/a6/ea/41a6eac6f8d7162a601b0fcaccd6a7a6.jpg"
                                                alt="ox"
                                                className="w-full h-full object-cover"
                                            />
                                        </span>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Ramesh Suthar</p>
                                            <p className="text-sm text-muted-foreground leading-none">rameshsuthar65@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full border-b border-border space-y-2">
                            </div>
                            <div className=" flex flex-col gap-2">
                                <Link href={'/dashboard'}>
                                    <div className="flex items-center text-muted-foreground gap-2 hover:bg-muted p-2 rounded-sm cursor-pointer hover:text-primary">
                                        <span className="flex h-5 w-5 shrink-0 overflow-hidden ">
                                            <Home className="aspect-square h-full w-full" />
                                        </span>
                                        <p className=" text-sm font-semibold">Home</p>
                                    </div>
                                </Link>
                                <Link href={'/dashboard/portfolio'}>
                                    <div className="flex items-center text-muted-foreground gap-2 hover:bg-muted p-2 rounded-sm cursor-pointer hover:text-primary">
                                        <span className="flex h-5 w-5 shrink-0 overflow-hidden ">
                                            <LayoutGridIcon className="aspect-square h-full w-full" />
                                        </span>
                                        <p className=" text-sm font-semibold">All projects</p>
                                    </div>
                                </Link>
                                <Link href={'/dashboard/build'}>
                                    <div className="flex items-center text-muted-foreground gap-2 hover:bg-muted p-2 rounded-sm cursor-pointer hover:text-primary">
                                        <span className="flex h-5 w-5 shrink-0 overflow-hidden ">
                                            <FolderClosed className="aspect-square h-full w-full" />
                                        </span>
                                        <p className=" text-sm font-semibold">Project files</p>
                                    </div>
                                </Link>
                                <Link href={'/dashboard/contants'}>
                                    <div className="flex items-center text-muted-foreground gap-2 hover:bg-muted p-2 rounded-sm cursor-pointer hover:text-primary">
                                        <span className="flex h-5 w-5 shrink-0 overflow-hidden ">
                                            <BookUser className="aspect-square h-full w-full" />
                                        </span>
                                        <p className=" text-sm font-semibold">Contact</p>
                                    </div>
                                </Link>
                                <Link href={'/dashboard/narayani'}>
                                    <div className="flex items-center text-muted-foreground gap-2 hover:bg-muted p-2 rounded-sm cursor-pointer hover:text-primary">
                                        <span className="flex h-5 w-5 shrink-0 overflow-hidden ">
                                            <MonitorSmartphoneIcon className="aspect-square h-full w-full" />
                                        </span>
                                        <p className=" text-sm font-semibold">Narayani</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="">
                            <div className=" p-2 flex flex-col gap-2 justify-between">
                                <div className="flex items-center text-muted-foreground gap-2 hover:bg-muted p-2 rounded-sm cursor-pointer hover:text-primary">
                                    <span className="flex h-5 w-5 shrink-0 overflow-hidden ">
                                        <Settings className="aspect-square h-full w-full" />
                                    </span>
                                    <p className=" text-sm font-semibold">Settings</p>
                                </div>
                                <div className="flex items-center text-muted-foreground gap-2 hover:bg-muted p-2 rounded-sm cursor-pointer hover:text-primary">
                                    <span className="flex h-5 w-5 shrink-0 overflow-hidden ">
                                        <HelpCircle className="aspect-square h-full w-full" />
                                    </span>
                                    <p className=" text-sm font-semibold">Help</p>
                                </div>
                            </div>
                            <div className="w-full border-b border-border space-y-2">
                            </div>
                            <div className="flex items-center">
                                <span className="flex h-14 w-14 shrink-0 overflow-hidden rounded-full">
                                    <img
                                        src="https://narayani-zej2.onrender.com/media/logo/file-removebg-preview.png"
                                        alt="ox"
                                        className="h-full w-full object-contain filter grayscale brightness-0"
                                    />
                                </span>
                                <p className="font-bold text-primary text-xl">INTERACTIVITY</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-screen w-full flex flex-col">
                    <div className="flex-none">
                        <Header />
                    </div>
                    <div className="flex-grow">
                        {children}
                    </div>
                </div>
            </div>
    );
}