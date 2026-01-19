"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import driftLogo from "@/public/drift-logo.svg";
import { bButton } from "@/src/modules/bigButton";

export default function Home() {
  const router = useRouter();

  function handleRegisterClick() {
    router.replace("/login");
  }

  return (
    <div className="grid grid-cols-1 items-center justify-center">
      <div className="flex justify-center">
        <Image src={driftLogo} alt="Drift Logo" width={200} priority />
      </div>

      <div>
        <h1 className="inline-block text-4xl font-bold text-white">drift</h1>
        <h2 className="mt-4 text-white">
          Simple kanban boards for focused project management
        </h2>
      </div>

      <div className="mt-20">
        {bButton("blue", "md", "Sign Up", true, "", handleRegisterClick)}
      </div>
    </div>
  );
}
