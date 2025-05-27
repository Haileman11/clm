import type { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { RefineContext } from "./_refine_context";
import { initializeCronJobs } from '@lib/cron/manager';

export const metadata: Metadata = {
  title: "CLM Safaricom",
  description: "Contract lifecycle manangement app for safaricom",
  icons: {
    icon: "/icon.ico",
  },
};

// Initialize cron jobs
if (process.env.NODE_ENV === 'production') {
  initializeCronJobs();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang="en">
      <body>
        <Suspense>
          <RefineContext defaultMode={defaultMode}>{children}</RefineContext>
        </Suspense>
      </body>
    </html>
  );
}
