"use client";

import { ThemedTitleV2 } from "@refinedev/antd";
import { useLogin } from "@refinedev/core";
import { Button, Layout, Space, Typography } from "antd";
import Image from "next/image";

export default function Login() {
  const { mutate: login } = useLogin();

  return (
    <Layout
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Space direction="vertical" align="center">
        <ThemedTitleV2
          collapsed={false}
          icon={
            <Image src="/icon.ico" alt="Safaricom" height={24} width={24} />
          }
          text="Contract Lifecycle Management Safaricom"
          wrapperStyles={{
            // fontSize: "24px",
            display: "flex",
            flexDirection: "column",
            marginBottom: "36px",
          }}
        />
        <Button
          style={{ width: "240px" }}
          type="primary"
          size="middle"
          onClick={() => login({})}
        >
          Sign in
        </Button>
      </Space>
    </Layout>
  );
}
