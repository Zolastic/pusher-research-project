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

  const questions = await api.question.getAll.query({ partOrder: 1 });

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
