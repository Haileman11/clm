"use client";

import { ThemedTitleV2 } from "@refinedev/antd";
import { useLogin } from "@refinedev/core";
import { Button, Layout, Space, Typography } from "antd";

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
          icon={<img
            src="/logo.png"
            alt=""
            style={{ height: "8px",  }}
          />}
          text="Contract Lifecycle Management Safaricom"
          wrapperStyles={{
            fontSize: "22px",
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
