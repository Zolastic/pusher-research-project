"use client";

import type { Question } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";
import { Textarea } from "./ui/textarea";
import { LoadingPage, LoadingSpinner } from "./loading";
import Done from "~/components/done";

type Props = {
  question: Question;
  part: string;
};

const Question = ({ question, part }: Props) => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const debouncedResponse = useDebounce(response, 1000);
  const updateResponse = api.question.updateResponse.useMutation();

  useEffect(() => {
    setResponse(question.response);
    setIsLoading(false);
  }, [question]);

  useEffect(() => {
    const updateResponseToDb = async () => {
      if (
        !isLoading &&
        debouncedResponse !== undefined &&
        debouncedResponse !== null
      ) {
        await updateResponse
          .mutateAsync({
            id: question.id,
            response: debouncedResponse,
            part,
          })
          .catch((error) => {
            console.error("Error updating response:", error);
          });
      }
    };

    void updateResponseToDb();
  }, [debouncedResponse]);

  useEffect(() => {
    // Subscribe to a presence channel
    const channel = pusherClient.subscribe(`presence-${part}`);

    // Bind to the necessary events
    channel.bind("incoming-message", (data: Question) => {
      console.log("Incoming message:", data);
      if (data.id === question.id) {
        setResponse(data.response);
      }
    });

    // // Presence channels also support 'pusher:subscription_succeeded' and 'pusher:member_added' events
    // channel.bind(
    //   "pusher:subscription_succeeded",
    //   function (members: { count: any; me: any, each: any }) {
    //     // console.log("Successfully subscribed!");
    //     // console.log("Number of members:", members.count);
    //     // console.log("Me:", members.me);
    //     console.log("members", members.each)
    //     members.each(function (member: { id: any; info: any; }) {
    //       console.log("member", member)
    //     });
    //   },
    // );

    // channel.bind("pusher:member_added", function (member: { id: any }) {
    //   console.log("Member added:", member.id);
    // });

    // channel.bind("pusher:member_removed", function (member: { id: any }) {
    //   console.log("Member removed:", member.id);
    // });

    return () => {
      // Unsubscribe from the presence channel when the component is unmounted
      pusherClient.unsubscribe(`presence-${part}`);
    };
  }, []);

  if (isLoading)
    return (
      <div className="my-[100px]">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <label
          htmlFor="about"
          className="flex w-full space-x-2 text-base font-medium leading-6 text-gray-900"
        >
          <span className="text-lg">{question.order}.</span>
          <span className="text-lg">{question.question}</span>
        </label>
        <div className="mt-2 flex h-[100px] w-[500px] flex-col">
          <Textarea
            value={response}
            onChange={(e) => {
              console.log("question response changed", e.target.value);
              setResponse(e.target.value);
            }}
          />
          <div className="ml-auto flex">
            <Done id={question.id} checked={question.done} part={part} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Question;
