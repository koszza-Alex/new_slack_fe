"use client";

/* eslint-disable @next/next/no-img-element */
export default function SlackLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <img
        src="/loading/Slack0.gif"
        alt="Loading"
        width={200}
        height={200}
        className="mb-6"
      />

      {/* Typing dots */}
      <div className="flex space-x-2">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}