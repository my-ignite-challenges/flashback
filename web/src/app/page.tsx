import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cookies } from "next/headers";

import { EmptyMemories } from "@/components/EmptyMemories";

import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Memory = {
  id: string;
  excerpt: string;
  coverUrl: string;
  createdAt: string;
};

export default async function Home() {
  const isAuthenticated = cookies().has("token");

  if (!isAuthenticated) {
    return <EmptyMemories />;
  }

  const token = cookies().get("token")?.value;
  const response = await api.get("/memories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const memories: Memory[] = response.data;
  console.log(memories);

  if (memories.length === 0) {
    return <EmptyMemories />;
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => (
        <div key={memory.id} className="space-y-4">
          <time className="flex items-center gap-2 text-sm text-gray-100 -ml-8 before:w-5 before:h-px before:bg-gray-50">
            {format(new Date(memory.createdAt), "dd 'de' MMMM',' yyyy", {
              locale: ptBR,
            })}
          </time>

          <Image
            src={memory.coverUrl}
            width={592}
            height={280}
            alt=""
            className="w-full aspect-video object-cover rounded-lg"
          />

          <p className="text-lg leading-relaxed text-gray-100">
            {memory.excerpt}
          </p>

          <Link
            href={`memories/${memory.id}`}
            className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
          >
            Ler mais
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  );
}
