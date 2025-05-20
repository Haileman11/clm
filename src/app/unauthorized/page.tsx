"use client";

import { Button, Result, Space } from "antd";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Result
      status="403"
      title="Access Denied"
      subTitle="Sorry, you don't have the required permissions to access this application."
      extra={
        <Space>
          <Button type="primary" onClick={() => signOut({ callbackUrl: "/" })}>
            Sign Out
          </Button>
          <Button onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Space>
      }
    />
  );
} 