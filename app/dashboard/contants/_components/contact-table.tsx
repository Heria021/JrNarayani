'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
    TableHead,
} from "@/components/ui/table";

export type Details = {
    _id: string;
    id: string;
    email: string;
    name: string;
    city: string;
    contact: string;
    address: string;
    message: string;
    meetTime: string;
    timestamp: string;
    file: string;
};
export const DetailsTable = ({ data = [] }: { data: Details[] }) => {
    return (
        <div className="h-full flex-col flex w-full">
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Meet Time</TableHead>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>File</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
            <div className="flex-grow w-full overflow-auto">
                <Table>
                    <TableBody>
                        {data.slice().reverse().map((detail) => (
                            <TableRow key={detail.id}>
                                <TableCell className="font-medium">{detail.name}</TableCell>
                                <TableCell>{detail.city}</TableCell>
                                <TableCell>{detail.contact}</TableCell>
                                <TableCell>{detail.address}</TableCell>
                                <TableCell>{detail.message}</TableCell>
                                <TableCell>{detail.meetTime}</TableCell>
                                <TableCell>{detail.timestamp}</TableCell>
                                <TableCell>{detail.file}</TableCell>
                                <TableCell>{detail.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};