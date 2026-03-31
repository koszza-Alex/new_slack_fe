"use client";

import Image from "next/image";
import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { RingLoader } from "react-spinners"; // Import the spinner
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { mutate } from "swr";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "This is required — you’ll need to enter an email.")
    .email("Enter a valid email address."),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function SlackSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitted },
    watch,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const emailValue = watch("email");
  const isButtonDisabled = isSubmitted && !isValid;

  const onSubmit = async (data: EmailFormData) => {
    try {
      setLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const response = await res.json();      

      // ✅ Save into SWR cache (IMPORTANT)
      mutate(["workspaces", data.email], response.workspaces, false);

      router.push(`/auth/workspace_list?email=${data.email}`);

    } catch (err) {
      console.error(err);
      alert("Failed to fetch workspaces");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm text-center">

        <Image src="/slack_logo.svg" alt="Slack Logo" width={150} height={60} className="mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-2">Enter your email</h1>

        <p className="text-gray-600 mb-6">
          We suggest using the email address you use at work.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

          <div className="relative">
            <input
              type="email"
              placeholder="name@work-email.com"
              {...register("email")}
              className={`
                w-full px-4 py-3 rounded-xl border text-lg
                ${errors.email
                  ? "border-red-500"
                  : isSubmitted && isValid
                    ? "border-blue-500"
                    : "border-gray-300"
                }
              `}
            />

            {isSubmitted && isValid && emailValue && (
              <FiCheckCircle
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500"
              />
            )}
          </div>

          {errors.email && (
            <p className="text-red-500 text-sm text-left">
              ⓘ {errors.email.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isButtonDisabled || loading}
            className={`
              w-full py-3 rounded-xl text-white font-medium mt-2
              ${!isButtonDisabled && !loading
                ? "bg-[#611f69] hover:bg-[#4a154b]"
                : "bg-gray-300 cursor-not-allowed"
              }
            `}
          >
            {loading ? <RingLoader color="#ffffff" size={30} /> : "Continue"}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-sm text-gray-500">
            OR SIGN IN WITH
          </span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 border border-gray-400 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <FcGoogle size={20} />
            <span>Google</span>
          </button>

          <button
            type="button"
            className="flex-1 border border-gray-400 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <FaApple size={18} />
            <span>Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
}