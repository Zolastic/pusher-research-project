import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-4xl font-bold">
            Welcome to our{" "}
            <a
              href="https://pusher.com/"
              className="text-[#5F30E2] hover:underline"
            >
              Pusher
            </a>{" "}
            research project!
          </h1>
          <p className="mt-4 text-center">
            This is a showcase of tRPC with Next.js, Prisma and Pusher.
          </p>
          <Link href={`/demo`} className="mt-5">
            <Button variant={"link"} className="bg-[#300D4F] text-muted">
              Demo
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
