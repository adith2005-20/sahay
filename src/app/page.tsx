
import { LatestPost } from "@/app/_components/post";
import { api, HydrateClient } from "@/trpc/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-white">
        <Link href={'/dashboard'}>
        <Button>Go to dashboard</Button>
        </Link>
        
      </main>
    </HydrateClient>
  );
}
