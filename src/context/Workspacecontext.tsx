"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Workspace = {
  id: string;
  name: string;
};

type WorkspaceContextType = {
  workspace: Workspace | null;
  setWorkspace: (w: Workspace | null) => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  // Rehydrate from localStorage on mount so workspace_name survives page refreshes
  useEffect(() => {
    const id = localStorage.getItem("workspaceId");
    const name = localStorage.getItem("workspaceName");
    if (id && name) {
      setWorkspace({ id, name });
    }
  }, []);

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
};