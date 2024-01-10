"use client"

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { pusherClient } from '~/lib/pusher';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"

type Props = {
  header: string,
  part: string
}

type Member = {
  id: string | undefined,
  info: {
    image: string | null | undefined,
    name: string | null | undefined
  }
}

function header({ header, part }: Props) {
  const { data: session } = useSession();

  // const user = { id: session?.user.id, info: { image: session?.user.image, name: session?.user.name} }
  const [users, setUsers] = useState<Member[]>([]);

  function handleMembers(members: { id: any, each: any }) {
    return new Promise<Member[]>((resolve) => {
      const usersArr: Member[] = [];
  
      members.each(function (member: Member) {
        console.log("member", member);
        if (member !== undefined) usersArr.push(member);
      });
  
      resolve(usersArr);
    });
  }

  const channel = pusherClient.subscribe(`presence-${part}`);
//  If you import from pusher, type 'Members': members, count, myID, me, and 7 more.
//  Hence, I declared my own type Member

  channel.bind(
    "pusher:subscription_succeeded",
    function (members: { id: any, each: any }) {
      handleMembers(members).then((usersArr) => {
        setUsers(usersArr);
      });
    },
  );

  channel.bind("pusher:member_added", function (members: { id: any, each: any }) {
    console.log("Member added:", members.id);
    handleMembers(members).then((usersArr) => {
      setUsers(usersArr);
    });
  });

  channel.bind("pusher:member_removed", function (members: { id: any, each: any }) {
    console.log("Member removed:", members.id);
    handleMembers(members).then((usersArr) => {
      setUsers(usersArr);
    });
  });

  useEffect(() => {
    console.log("users", users)
  }, [users])

  return (
    <div className="flex items-center justify-between m-4 bg-[#653AAB] rounded-xl shadow-lg">
        <h1 className="p-4 text-white font-bold text-4xl">
            {header}
        </h1>
        <div className="flex">
          {users.map((user) => (
            <TooltipProvider key={user.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10 m-2">
                    <AvatarImage src={user.info.image ? user.info.image : ""} alt="Avatar" />
                    <AvatarFallback>{user.info.name ? user.info.name.split(' ').map(word => word[0]).join('').toUpperCase() : ""}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{user.info.name ? user.info.name : "User not known"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
    </div>
  )
}

export default header