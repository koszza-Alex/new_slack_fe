"use client";

import { MainPage } from "@/components/MainPage/MainPage";
import TopBar from "@/components/TopBar/TopBar";
import { WorkSpace } from "@/components/WorkSpace/WorkSpace";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/Authcontext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // ✅ use context instead of useState
  const { user, setUser } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/auth/sign_in");
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.status === 401 || res.status === 500) {
          router.push("/auth/sign_in");
          return;
        }

        // ✅ set global user
        setUser(data);

      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <TopBar />

      <div className="flex h-[calc(100vh-40px)]">
  
        <WorkSpace userData={user}/>

        <div className="flex-grow h-full">
          {children}
        </div>

        <div className="w-full">
          <MainPage userData={user}/>
        </div>
      </div>
    </div>
  );
}