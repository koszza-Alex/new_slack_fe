"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  ChevronDown,
  Grid2x2,
  ArrowRight,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import {useWorkspace} from "../../../context/Workspacecontext"

/* ================================
   FETCHER
================================ */

const fetcher = async ([_, email]: [string, string]) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  return data.workspaces;
};

/* ================================
   COLORS
================================ */

const getWorkspaceColor = (index: number) => {
  const colors = ["#36C5F0", "#2EB67D", "#ECB22E", "#E01E5A", "#4A154B"];
  return colors[index % colors.length];
};

/* ================================
   COMPONENT
================================ */

export default function WorkspacesPage() {
  const router = useRouter();
  const email = useSearchParams().get("email");
  const {setWorkspace} = useWorkspace();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"workspaces" | "invites">(
    "workspaces"
  );

  const { data: workspaces } = useSWR(
    email ? ["workspaces", email] : null,
    fetcher
  );

  const onToMain = async (ws: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/generate-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, workspaceName: ws.name }),
        }
      );

    const result = await res.json();

    //  store everything you need
    localStorage.setItem("token", result.token);
    localStorage.setItem("workspaceId", ws.id);
    localStorage.setItem("workspaceName", ws.name);
    setWorkspace(ws);

    //  FIXED
    router.push(`/${ws.id}`);
  } catch (err) {
    console.error(err);
  }
};
  const shouldScroll = (workspaces?.length || 0) > 3;

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex flex-col">
      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <nav className="bg-[#481a54] text-white">
        <div className="max-w-[76.875rem] mx-auto px-4 py-3 flex justify-between items-center">
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <span className="cursor-pointer">
              <img src={"/slack-workspace-logo.png"} />
            </span>
            <div className="hidden lg:flex gap-6 text-sm">
              {["Features", "Solutions", "Enterprise", "Resources", "Pricing"].map(
                (item) => (
                  <button
                    key={item}
                    className="focus:outline-dotted flex focus:outline-2 cursor-pointer focus:outline-gray-300 p-3"
                  >
                    {item}
                    {(item !== "Enterprise" && item !== "Pricing") ? <ChevronDown size={14} className="mt-1" /> : ""}
                  </button>
                )
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button className="hidden lg:block focus:outline-dotted focus:outline-2 focus:outline-gray-300">
              <Search className="w-5 h-5" />
            </button>

            <button className="hidden cursor-pointer hover:outline-2 lg:block px-4 py-2 border border-white rounded text-sm focus:outline-dotted focus:outline-2 focus:outline-gray-300">
              TALK TO SALES
            </button>

            <button className="hidden lg:block px-4 py-2 bg-white text-[#481a54] rounded text-sm focus:outline-dotted focus:outline-2 focus:outline-gray-300" onClick={() =>
              router.push(
                `/auth/create_workspace?email=${email}`
              )
            }>
              CREATE A NEW WORKSPACE
            </button>

            {/* MOBILE TOGGLE (RIGHT) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 focus:outline-dotted focus:outline-2 focus:outline-gray-300"
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* ========================= */}
      {/* MOBILE MODAL */}
      {/* ========================= */}

      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-6 text-lg">
          <p>Features </p>
          <p>Solutions</p>
          <p>Enterprise</p>
          <p>Resources</p>
          <p>Pricing</p>
        </div>
      </div>

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <div className="relative bg-[#481a54] text-white text-center pt-20 pb-40">
        <div className="bg-[#481a54] w-full h-[150px] absolute bottom-[-75px] rounded-[50%]" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome back 👋</h1>
          <p className="text-lg text-white/90">
            Choose a workspace to get started.
          </p>
        </div>
      </div>

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}
      <div className="-mt-28 flex z-25 justify-center px-4 sm:px-6 pb-16">
        <div className="w-full max-w-3xl">
          {/* TITLE */}
          <div className="flex items-center gap-2 mb-4">
            <Grid2x2 className="w-5 h-5 text-white" />
            <h2 className="text-lg font-bold text-white">
              My workspaces
            </h2>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* TABS */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("workspaces")}
                className={`px-6 py-3 text-sm font-medium ${activeTab === "workspaces"
                  ? "border-b-2 border-black"
                  : "text-gray-500"
                  }`}
              >
                Workspaces
              </button>

              <button
                onClick={() => setActiveTab("invites")}
                className={`px-6 py-3 text-sm font-medium ${activeTab === "invites"
                  ? "border-b-2 border-black"
                  : "text-gray-500"
                  }`}
              >
                Open invites
              </button>
            </div>

            {/* CONTENT */}
            {activeTab === "workspaces" && (
              <>
                <div className="px-6 py-4 text-sm text-gray-600 border-b">
                  Ready to launch
                </div>

                <div
                  className={`${shouldScroll ? "max-h-[260px] overflow-y-auto" : ""
                    }`}
                >
                  {!workspaces && (
                    <div className="p-6 text-center text-gray-400">
                      Loading...
                    </div>
                  )}

                  {workspaces?.map((ws: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => onToMain(ws)}
                      className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: getWorkspaceColor(i) }}
                        >
                          {ws.name[0]}
                        </div>

                        <div>
                          <p className="font-semibold">{ws.name}</p>
                          <p className="text-sm text-gray-500 flex gap-3 pt-1">
                            <span className="w-[20px] h-[20px] ">
                              <img src={"https://secure.gravatar.com/avatar/c013060e472489a463b58202db9a3b2f.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0002-48.png"} />
                            </span>
                            {ws.members || 0} members • Last active
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="px-6 py-5 border-t text-sm">
                  <button
                    onClick={() =>
                      router.push(
                        `/auth/create_workspace?email=${email}`
                      )
                    }
                    className="text-[#1264a3] font-medium hover:underline"
                  >
                    Create a new workspace
                  </button>

                  <p className="mt-2 text-gray-600">
                    Not seeing your workspace?{" "}
                    <span className="text-[#1264a3] cursor-pointer hover:underline">
                      Try a different email
                    </span>
                  </p>
                </div>
              </>
            )}

            {activeTab === "invites" && (
              <div className="p-10 text-center text-gray-400">
                No invites yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}