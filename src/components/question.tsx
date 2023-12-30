"use client";

import type { Question } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "./ui/input";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";

type Props = {
  question: Question;
};

const Question = ({ question }: Props) => {
  const [response, setResponse] = useState<string>("");
  const debouncedResponse = useDebounce(response, 1000);
  const updateResponse = api.question.updateResponse.useMutation();

  useEffect(() => {
    const updateResponseToDb = async () => {
      if (debouncedResponse) {
        await updateResponse
          .mutateAsync({
            id: question.id,
            response: debouncedResponse,
          })
          .catch((error) => {
            console.error("Error updating response:", error);
          });
      }
    };

    void updateResponseToDb();
  }, [debouncedResponse]);

  useEffect(() => {
    setResponse(question.response);
  }, [question]);

  useEffect(() => {
    pusherClient.subscribe("pusherResearchProject");

    pusherClient.bind("incoming-message", (data: Question) => {
      if (data.id === question.id) {
        setResponse(data.response);
      }
    });

    return () => {
      pusherClient.unsubscribe("pusherResearchProject");
    };
  }, []);

  return (
    <>
      <div className="py-16">
        <label
          htmlFor="about"
          className="flex w-full space-x-2 text-base font-medium leading-6 text-gray-900"
        >
          <span className="text-lg">{question.question}</span>
        </label>
        <div className="mt-2 flex h-[100px] w-[500px]">
          <Input
            value={response}
            onChange={(e) => {
              setResponse(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Question;
