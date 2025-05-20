"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Descriptions, Tag, Space, Divider } from "antd";
import { CalendarOutlined, DollarOutlined, FileTextOutlined, ShopOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ContractShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Basic Information */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <FileTextOutlined /> Basic Information
            </Title>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Contract Number" span={2}>
                <Text strong>{record?.contractNumber}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {record?.description}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(record?.status)}>
                  {record?.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Value">
                <Text strong>${record?.value?.toLocaleString()}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        {/* Vendor Information */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <ShopOutlined /> Vendor Information
            </Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Vendor Name">
                <Text strong>{record?.vendor?.name}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        {/* Contract Period */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <CalendarOutlined /> Contract Period
            </Title>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Start Date">
                {new Date(record?.startDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {new Date(record?.endDate).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        {/* System Information */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <ClockCircleOutlined /> System Information
            </Title>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Created At">
                {new Date(record?.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {new Date(record?.updatedAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>
      </Space>
    </Show>
  );
} 