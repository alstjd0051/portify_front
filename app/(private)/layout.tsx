import { MainLayout } from "@/components/layouts/main-layout";
import { authOptions } from "@/components/shared/lib/next-auth/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const PrivateLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/");
  }
  return <MainLayout>{children}</MainLayout>;
};

export default PrivateLayout;
