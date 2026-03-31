"use client";

import { useParams } from "next/navigation";
import clsx from "clsx"


export default function Page() {
  const params = useParams();

  const id = params.threadId;
  
  return (
    <div className="h-full flex">
      <div className={clsx()}>
        {id}
      </div>
    </div>
  )
}
