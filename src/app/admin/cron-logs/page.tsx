"use client";

import { List } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { Table, Tag, Card, Typography, Space, Button, message } from "antd";
import { ClockCircleOutlined, ReloadOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;

export default function CronLogsPage() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);
  const { data, isLoading, refetch } = useList({
    resource: "cronJobLog",
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
  });

  const handleTrigger = async () => {
    try {
      setIsTriggering(true);
      const response = await fetch('/api/cron/trigger', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger cron job');
      }

      message.success('Cron job triggered successfully');
      refetch();
    } catch (error) {
      message.error('Failed to trigger cron job');
    } finally {
      setIsTriggering(false);
    }
  };

  const columns = [
    {
      title: "Job Name",
      dataIndex: "jobName",
      key: "jobName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "SUCCESS" ? "success" : "error"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  const expandedRowRender = (record: any) => {
    const details = record.details ? JSON.parse(record.details) : null;
    if (!details) return null;

    return (
      <div style={{ padding: "16px" }}>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(details, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <List
      headerButtons={({ defaultButtons }) => [
        <Button
          key="trigger"
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={handleTrigger}
          loading={isTriggering}
        >
          Trigger Now
        </Button>,
        <Button
          key="refresh"
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>,
        ...(defaultButtons || []),
      ]}
    >
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space>
            <ClockCircleOutlined style={{ fontSize: "24px" }} />
            <Title level={4}>Cron Job Logs</Title>
          </Space>

          <Table
            dataSource={data?.data}
            columns={columns}
            loading={isLoading}
            rowKey="id"
            expandable={{
              expandedRowRender,
              expandedRowKeys,
              onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]),
            }}
            pagination={{
              total: data?.total,
              pageSize: 10,
            }}
          />
        </Space>
      </Card>
    </List>
  );
} 