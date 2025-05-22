"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Descriptions, Tag, Space, Divider } from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  CONTRACT_TYPE_OPTIONS,
  TERM_TYPE_OPTIONS,
  SUPPLIER_SERVICE_OPTIONS,
  CURRENCY_OPTIONS,
  COUNTRY_OPTIONS,
  STAKEHOLDER_ROLES,
} from "@lib/types";
import { User } from "@prisma/client";

const { Title, Text } = Typography;

export default function ContractShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  console.log(record);
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

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "ETB":
        return "Br ";
      case "USD":
        return "$ ";
      default:
        return "";
    }
  };

  const getOptionLabel = (
    value: string,
    options: { value: string; label: string }[]
  ) => {
    return options.find((option) => option.value === value)?.label || value;
  };

  const renderStakeholderList = (stakeholders: any[], role: string) => {
    console.log(stakeholders, role);
    const stakeholdersWithRole = stakeholders.filter(
      (u: User) => u.role === role
    );
    if (!stakeholdersWithRole?.length)
      return <Text type="secondary">None</Text>;

    return (
      <Space direction="vertical">
        {stakeholdersWithRole.map((stakeholder: any) => (
          <Text key={stakeholder.id}>
            {stakeholder.firstName} {stakeholder.lastName} ({stakeholder.email})
          </Text>
        ))}
      </Space>
    );
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
              <Descriptions.Item label="Name" span={2}>
                <Text strong>{record?.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Client Legal Entity" span={2}>
                {record?.clientLegalEntity}
              </Descriptions.Item>
              <Descriptions.Item label="Term Type">
                {getOptionLabel(record?.termType, TERM_TYPE_OPTIONS)}
              </Descriptions.Item>
              <Descriptions.Item label="Contract Type">
                {getOptionLabel(record?.contractType, CONTRACT_TYPE_OPTIONS)}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(record?.status)}>
                  {record?.status?.replace(/_/g, " ")}
                </Tag>
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
              <Descriptions.Item label="Effective Date">
                {record?.effectiveDate
                  ? new Date(record.effectiveDate).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Expiration Date">
                {record?.expirationDate
                  ? new Date(record.expirationDate).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        {/* Service Information */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <ShopOutlined /> Service Information
            </Title>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Supplier Service">
                {getOptionLabel(
                  record?.supplierService,
                  SUPPLIER_SERVICE_OPTIONS
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Country">
                {getOptionLabel(record?.country, COUNTRY_OPTIONS)}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        {/* Financial Information */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <DollarOutlined /> Financial Information
            </Title>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Currency">
                {getOptionLabel(record?.currency, CURRENCY_OPTIONS)}
              </Descriptions.Item>
              <Descriptions.Item label="Total Contract Value">
                <Text strong>
                  {getCurrencySymbol(record?.currency)}
                  {record?.totalValue?.toLocaleString()}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>

        {/* Stakeholders */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <TeamOutlined /> Stakeholders
            </Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Vendor">
                <Text strong>{record?.vendor?.name}</Text>
              </Descriptions.Item>
              {STAKEHOLDER_ROLES.map(({ value, label, required }) => (
                <Descriptions.Item label={label} key={value}>
                  {renderStakeholderList(record?.stakeholders || [], value)}
                </Descriptions.Item>
              ))}
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
                {record?.createdAt
                  ? new Date(record.createdAt).toLocaleString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {record?.updatedAt
                  ? new Date(record.updatedAt).toLocaleString()
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Card>
      </Space>
    </Show>
  );
}
