"use client";

import type { Question } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";
import { Textarea } from "./ui/textarea";
import { LoadingPage, LoadingSpinner } from "./loading";
import Done from "~/components/done"

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
    pusherClient.subscribe(part);

    pusherClient.bind("incoming-message", (data: Question) => {
      if (data.id === question.id) {
        setResponse(data.response);
      }
    });

    return () => {
      pusherClient.unsubscribe(part);
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
      <div className="py-16 flex flex-col items-center justify-center">
        <label
          htmlFor="about"
          className="flex w-full space-x-2 text-base font-medium leading-6 text-gray-900"
        >
          <span className="text-lg">{question.part}</span>
          <span className="text-lg">{question.question}</span>
        </label>
        <div className="mt-2 flex flex-col h-[100px] w-[500px]">
          <Textarea
            value={response}
            onChange={(e) => {
              console.log("question response changed", e.target.value);
              setResponse(e.target.value);
            }}
          />
          <div className="flex ml-auto">
            <Done id={question.id} checked={question.done} part={part} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Question;
