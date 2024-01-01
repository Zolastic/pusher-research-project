import React from "react";
import Link from "next/link";
import Question from "~/components/question";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";

const page = async () => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("api/auth/signin");
  }  

  const questions = await api.question.getAll.query({ part: "2" });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-slate-100 px-4">
        {questions.map((part: any) => (
          <div key={part} className="flex flex-col items-center m-4 bg-slate-200 rounded">
            {part.map((question: Question) => (
              <Question key={question.id} question={question} part="part2" />
            ))}
          </div>
        ))}
        <div>
          <Link href={`/part1`} className="mt-5">
            <Button className="bg-[#300D4F] text-muted hover:bg-[#c9abab]">
              <p>
                Previous Page <ChevronLeft size={16} className="inline" />
              </p>
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default page;
