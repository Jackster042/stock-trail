import Header from "@/components/shared/Header";
import DemoBanner from "@/components/shared/DemoBanner";
import { getCachedSession } from "@/lib/better-auth/get-session";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getCachedSession();

  // Allow anonymous access - user is optional
  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  return (
    <main className="min-h-screen text-gray-400">
      {/* Demo Banner */}
      <DemoBanner />
      {/* Header Component */}
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default layout;
