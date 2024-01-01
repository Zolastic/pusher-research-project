import React from "react";
import Link from "next/link";
import Question from "~/components/question";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("api/auth/signin");
  }  

  const questions = await api.question.getAll.query({ part: "1" });

  // group questions by major part e.g. 2.1, 2.2
  const groupedQuestions = questions.reduce((acc: any, question) => {
    const majorPart = question.part.split('.').slice(0, 2).join('.');

    // check if an array for the major part exists yet e.g. if there is no array for questions in 2.2, create one
    if (!acc[majorPart]) {
      acc[majorPart] = [];
    }

    // push the questions to the corresponding array
    acc[majorPart].push(question);
    return acc;
  }, {});

  // sort questions within each group
  for (const majorPart in groupedQuestions) {
    groupedQuestions[majorPart].sort((a: any, b: any) => a.part.localeCompare(b.part));
  }

  // convert groupedQuestions from an object into an array so that the .map function can be used
  const sortedQuestions = Object.values(groupedQuestions);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-slate-100 px-4">
        {sortedQuestions.map((part: any) => (
          <div key={part} className="flex flex-col items-center m-4 bg-slate-200 rounded">
            {part.map((question: Question) => (
              <Question key={question.id} question={question} part="part2" />
            ))}
          </div>
        ))}
        <div>
          <Link href={`/part2`} className="mt-5">
            <Button className="bg-[#300D4F] text-muted hover:bg-[#c9abab]">
              <p>
                Next Page <ChevronRight size={16} className="inline" />
              </p>
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default page;
