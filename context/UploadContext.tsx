import { createContext, useContext, useState, ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface UploadContextType {
    projectId: Id<"projects"> | null;
    setProjectId: (id: Id<"projects"> | null) => void;
    reset: boolean;
    setReset: (bool: boolean) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
    const [projectId, setProjectId] = useState<Id<"projects"> | null>(null);
    const [reset, setReset] =  useState<boolean>(false);

    return (
        <UploadContext.Provider value={{ projectId, setProjectId, reset, setReset }}>
            {children}
        </UploadContext.Provider>
    );
}

export function useUploadContext() {
    const context = useContext(UploadContext);
    if (!context) {
        throw new Error("useUploadContext must be used within a UploadProvider");
    }
    return context;
}