"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/shared/ui/button";
import { Icons } from "@/components/shared/ui/icons";

export const AuthProviders = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>

      <Button
        variant="outline"
        onClick={() => signIn("github", { callbackUrl: "/" })}
      >
        <Icons.github className="mr-2 h-4 w-4" />
        Github
      </Button>
    </div>
  );
};
