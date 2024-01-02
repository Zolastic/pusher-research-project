"use client";

import type { Question } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";
import { Textarea } from "./ui/textarea";
import { LoadingPage, LoadingSpinner } from "./loading";
import Done from "~/components/done";

// ... (existing imports)

type Props = {
  question: Question;
  part: string;
};

const Question = ({ question, part }: Props) => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // New state to track editing status
  const debouncedResponse = useDebounce(response, 1000);
  const updateResponse = api.question.updateResponse.useMutation();

  useEffect(() => {
    setResponse(question.response);
    setIsEditing(question.editing); // Initialize the editing status
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
            editing: true,
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
        setIsEditing(data.editing); // Update the editing status based on incoming events
      }
    });

    return () => {
      pusherClient.unsubscribe(part);
    };
  }, [question]); // Update the UI when the 'question' prop changes

  if (isLoading)
    return (
      <div className="my-[100px]">
        <LoadingSpinner />
      </div>
    );

  return (
    <>
      <div className="flex flex-col items-center justify-center py-16">
        <label
          htmlFor="about"
          className="flex w-full space-x-2 text-base font-medium leading-6 text-gray-900"
        >
          <span className="text-lg">{question.part}</span>
          <span className="text-lg">{question.question}</span>
        </label>
        <div
          className={`mt-2 flex h-[100px] w-[500px] flex-col ${
            isEditing ? "bg-orange-100" : ""
          }`}
        >
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
