"use client";

import { MainPage } from "@/components/MainPage/MainPage";
import TopBar from "@/components/TopBar/TopBar";
import { WorkSpace } from "@/components/WorkSpace/WorkSpace";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useAuth } from "@/context/Authcontext";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

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

        setUser(data);
        // Store userId so SocketProvider can send it as a presence identifier
        if (data?.id) {
          localStorage.setItem("userId", data.id);
        }

      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  // DM routes render their own full layout (sidebar + DmPage) inside {children}.
  // MainPage must not render alongside them or it creates a broken double-panel layout.
  const isDmRoute = pathname?.includes("/dm/");

  return (
    <div className="h-screen flex flex-col">
      <TopBar />

      <div className="flex h-[calc(100vh-40px)]">

        <WorkSpace userData={user} />

        {isDmRoute ? (
          // DM route: children already contains sidebar + DmPage
          <div className="flex-1 h-full overflow-hidden">
            {children}
          </div>
        ) : (
          <>
            {/* Channel route: children = ChannelList sidebar, MainPage = chat area */}
            <div className="flex-grow h-full">
              {children}
            </div>

            <div className="w-full">
              <MainPage userData={user} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}