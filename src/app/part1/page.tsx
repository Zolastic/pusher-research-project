import React from "react";
import Link from "next/link";
import Question from "~/components/question";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

const page = async () => {
  const questions = await api.question.getAll.query({ part: "1" });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-slate-100 px-4">
        {questions.map((question) => (
          <Question key={question.id} question={question} part="part1" />
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
