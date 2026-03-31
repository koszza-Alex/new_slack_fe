"use client";

import { useParams } from "next/navigation";
import { ChannelList } from "./_components/ChannelList";
import clsx from "clsx"


export default function Page() {
  const params = useParams();

  const id = params.id;
  
  return (
    <div className="h-full flex">
      <ChannelList />
      <div className={clsx()}>

      </div>
    </div>
  )
}
