import { createContext, useContext, useState, ReactNode, useEffect } from "react";
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
    const [reset, setReset] = useState<boolean>(false);

    // Log when projectId changes
    useEffect(() => {
        console.log("UploadContext - projectId changed:", projectId);
    }, [projectId]);

    // Log when reset changes
    useEffect(() => {
        console.log("UploadContext - reset changed:", reset);
    }, [reset]);

    // Wrapper for setProjectId to add logging
    const handleSetProjectId = (id: Id<"projects"> | null) => {
        console.log("Setting projectId to:", id);
        setProjectId(id);
    };

    // Wrapper for setReset to add logging
    const handleSetReset = (bool: boolean) => {
        console.log("Setting reset to:", bool);
        setReset(bool);
    };

    return (
        <UploadContext.Provider value={{ 
            projectId, 
            setProjectId: handleSetProjectId, 
            reset, 
            setReset: handleSetReset 
        }}>
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