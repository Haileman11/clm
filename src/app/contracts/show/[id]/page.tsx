"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Descriptions, Tag } from "antd";

const { Title } = Typography;

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
      <Card>
        <Title level={5}>Contract Details</Title>
        <Descriptions bordered>
          <Descriptions.Item label="Contract Number" span={3}>
            {record?.contractNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Vendor" span={3}>
            {record?.vendor?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date" span={3}>
            {new Date(record?.startDate).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="End Date" span={3}>
            {new Date(record?.endDate).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            <Tag color={getStatusColor(record?.status)}>
              {record?.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Value" span={3}>
            ${record?.value?.toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            {record?.description}
          </Descriptions.Item>
          <Descriptions.Item label="Created At" span={3}>
            {new Date(record?.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" span={3}>
            {new Date(record?.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Show>
  );
} 