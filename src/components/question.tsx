"use client";

import type { Question } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { pusherClient } from "~/lib/pusher";
import { api } from "~/trpc/react";
import { Textarea } from "./ui/textarea";
import { LoadingPage, LoadingSpinner } from "./loading";
import Done from "~/components/done";
import { getSession } from "next-auth/react";

type Props = {
  question: Question;
  part: string;
};

const Question = ({ question, part }: Props) => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userID, setUserID] = useState<string | null>(null);
  const debouncedResponse = useDebounce(response, 1000);
  const updateResponse = api.question.updateResponse.useMutation();
  const sendIsEditing = api.question.sendIsEditing.useMutation();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setUserID(session?.user?.id ?? null);
      setResponse(question.response);
      setIsLoading(false);
    };
    fetchSession();
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
    pusherClient.subscribe(`presence${part}`);

    pusherClient.bind("incoming-message", (data: Question) => {
      console.log("data received", data);

      if (data.id === question.id) {
        setResponse(data.response);
        setIsEditing(data.editing);
      }

      const socketId = pusherClient.connection.socket_id;
      console.log("Socket ID:", socketId);
      console.log(isEditing, userID, question.id);
    });
    pusherClient.bind(
      "isEditing",
      (data: { questionId: string; isEditing: boolean }) => {
        if (data.questionId == question.id) {
          setIsEditing(data.isEditing);
        }
      },
    );
    return () => {
      setIsEditing(false);
      pusherClient.unsubscribe(`presence${part}`);
    };
  }, [question]);

  const handleFocus = async () => {
    await sendIsEditing.mutateAsync({
      part,
      questionId: question.id,
      isEditing: true,
    });
  };

  const handleBlur = async () => {
    await sendIsEditing.mutateAsync({
      part,
      questionId: question.id,
      isEditing: true,
    });
  };
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
        <div className={`mt-2 flex h-[100px] w-[500px] flex-col `}>
          <Textarea
            value={response}
            onChange={(e) => {
              console.log("question response changed", e.target.value);
              setResponse(e.target.value);
              setIsEditing(true);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isEditing} // Disable if not the editor
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
