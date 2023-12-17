import React from "react";
import Question from "~/components/question";
import { api } from "~/trpc/server";

const page = async () => {
  const questions = await api.question.getAll.query();

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-slate-100 px-4">
        {questions.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </main>
    </>
  );
};

export default page;
