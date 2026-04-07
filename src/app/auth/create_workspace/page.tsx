"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavItem from "@/components/WorkSpace/NavItem";

export default function SlackClonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || ""; // ✅ safe fallback

  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState("");
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  /* ================================
     VALIDATION
  ================================ */
  const isStep1Valid = workspaceName.trim().length>0;
  const isStep2Valid = userName.trim().length>0;
  /* ================================
     SUBMIT
  ================================ */

  const onSubmit = async () => {
    if (!isStep2Valid) return;

    setIsSubmitting(true);

    const data = {
      email,
      dispname: userName,
      workspaceName,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/complete-registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.workspace?.id) {
        console.error("Registration failed:", result);
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("workspaceId", result.workspace.id);
      localStorage.setItem("workspaceName", result.workspace.name ?? workspaceName);
    

      // ✅ small delay so user sees loading
      setTimeout(() => {
        router.push(
          `../../${result.workspace.id}`
        );
      }, 0);
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false); // only stop on error
    }
  };

  /* ================================
     INIT LOCAL STORAGE
  ================================ */

  useEffect(() => {
    localStorage.setItem("step", "1");
    localStorage.setItem("workspaceName", "");
    localStorage.setItem("userName", "");
  }, []);

  /* ================================
     SAVE STATE
  ================================ */

  useEffect(() => {
    localStorage.setItem("step", String(step));
    localStorage.setItem("workspaceName", workspaceName);
    localStorage.setItem("userName", userName);
  }, [step, workspaceName, userName]);

  /* ================================
     SYNC URL (App Router FIX)
  ================================ */

  useEffect(() => {
    if (!email) return;

    router.replace(`?step=${step}&email=${email}`);
  }, [step, email, router]);

  /* ================================
     UI
  ================================ */

  return (
    <div
      className={`flex flex-col h-screen font-sans transition-opacity duration-300 ${isSubmitting ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
    >
      {/* TOP BAR */}
      <div className="h-[38px] px-2 bg-[#410f41] w-full" />

      <div className="flex flex-1 w-full">
        {/* SIDEBAR */}
        <div className="hidden lg:flex h-full min-w-[395px] bg-[rgb(92,42,92)] text-white">
          <div className="w-[75px] min-w-[75px] h-full bg-[#410f41] pt-[10px] flex flex-col items-center gap-4">
            <NavItem label="Home" hasDot id="home" />
            <NavItem label="DMs" id="dms" />
            <NavItem label="Activity" id="activity" />
            <NavItem label="Files" id="files" />
            <NavItem label="More" id="more" />
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 bg-[#f8f8f8] flex justify-center px-4">
          <div className="w-full max-w-[800px] p-8">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <p className="text-sm text-gray-500 mb-4 mt-24">
                  Step 1 of 3
                </p>

                <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1c1d] mb-4">
                  What do you want to call your Slack workspace?
                </h1>

                <p className="text-[#616061] mb-6">
                  Choose something that your team will recognize.
                </p>

                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Ex: Acme Marketing or Acme Co"
                  className="w-full border border-[#1264a3] focus:ring-2 focus:ring-[#1d9bd1]/30 rounded-lg px-4 py-3 outline-none"
                />

                <button
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className={`mt-6 px-6 py-2 rounded-md ${isStep1Valid
                      ? "bg-[#4a154b] text-white"
                      : "bg-[#e8e8e8] text-[#a0a0a0]"
                    }`}
                >
                  Next
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <p className="text-sm text-gray-500 mb-4 mt-24">
                  Step 2 of 3
                </p>

                <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1c1d] mb-4">
                  What’s your name?
                </h1>

                <p className="text-[#616061] mb-6">
                  Adding your name helps teammates.
                </p>

                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border border-[#1264a3] focus:ring-2 focus:ring-[#1d9bd1]/30 rounded-lg px-4 py-3 mb-6 outline-none"
                />

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 rounded-md border"
                  >
                    Back
                  </button>

                  <button
                    onClick={onSubmit}
                    disabled={!isStep2Valid}
                    className={`px-6 py-2 rounded-md ${isStep2Valid
                        ? "bg-[#611f69] text-white"
                        : "bg-[#e8e8e8] text-[#a0a0a0]"
                      }`}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#611f69] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">
              Setting up your workspace...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}