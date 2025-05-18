"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Descriptions } from "antd";

const { Title } = Typography;

export default function VendorShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Title level={5}>Vendor Details</Title>
        <Descriptions bordered>
          <Descriptions.Item label="Name" span={3}>
            {record?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>
            {record?.email}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={3}>
            {record?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={3}>
            {record?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            {record?.status}
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