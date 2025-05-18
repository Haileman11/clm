import { Layout } from "@components/layout";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "@app/api/auth/[...nextauth]/options";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/login");
  }

  return <Layout>{children}</Layout>;
}
