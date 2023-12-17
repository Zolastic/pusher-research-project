"use client";

import type { Question } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";

type Props = {
  question: Question;
};

const Question = ({ question }: Props) => {
  const [response, setResponse] = useState<string>("");
  const { mutate: updateResponse } = api.question.updateResponse.useMutation();

  const handleResponseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResponse(e.target.value);
    updateResponse({ id: question.id, response: e.target.value });
  };

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
          <Input value={response} onChange={handleResponseChange} />
        </div>
      </div>
    </>
  );
};

export default Question;
