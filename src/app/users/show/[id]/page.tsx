"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Space, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function UserShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "CONTRACT_MANAGER":
        return "blue";
      case "CONTRACT_OWNER":
        return "green";
      case "VENDOR":
        return "orange";
      default:
        return "default";
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Title level={5}>Basic Information</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Name:</Text>{" "}
                <Text>
                  {record?.firstName} {record?.lastName}
                </Text>
              </div>
              <div>
                <Text strong>Email:</Text> <Text>{record?.email}</Text>
              </div>
              <div>
                <Text strong>Department:</Text> <Text>{record?.department}</Text>
              </div>
              <div>
                <Text strong>Role:</Text>{" "}
                <Tag color={getRoleColor(record?.role)}>{record?.role}</Tag>
              </div>
            </Space>
          </div>

          <div>
            <Title level={5}>System Information</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>User ID:</Text> <Text>{record?.id}</Text>
              </div>
              <div>
                <Text strong>Keycloak ID:</Text> <Text>{record?.keycloakId}</Text>
              </div>
            </Space>
          </div>
        </Space>
      </Card>
    </Show>
  );
} 