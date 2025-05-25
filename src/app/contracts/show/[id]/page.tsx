"use client";

import { Show } from "@refinedev/antd";
import { useShow, useApiUrl } from "@refinedev/core";
import {
  Typography,
  Card,
  Descriptions,
  Tag,
  Space,
  Divider,
  List,
  Button,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import {
  CONTRACT_TYPE_OPTIONS,
  TERM_TYPE_OPTIONS,
  SUPPLIER_SERVICE_OPTIONS,
  CURRENCY_OPTIONS,
  COUNTRY_OPTIONS,
  STAKEHOLDER_ROLES,
} from "@lib/types";
import { RequestReview } from "@/components/contracts/RequestReview";
import { ContractReviews } from "@/components/contracts/ContractReviews";
import { message } from "antd";
import { ContractActions } from "@/components/contracts/ContractActions";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function ContractShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const apiUrl = useApiUrl();
  const router = useRouter();
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
    <Show
      isLoading={isLoading}
      headerButtons={({ defaultButtons }) => {
        if (record?.status === "ACTIVE" && Array.isArray(defaultButtons)) {
          return defaultButtons.filter((button: { key?: string }) => button.key !== "edit");
        }
        return defaultButtons;
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Basic Information */}
        <Card
          title={
            <div className="flex justify-between items-center">
              <span>Basic Information</span>
              {record && (
                <ContractActions
                  contractId={record.id?.toString() || ""}
                  status={record.status}
                  onSuccess={() => {
                    message.success("Contract status updated successfully");
                    router.refresh();
                  }}
                />
              )}
            </div>
          }
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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
              {record?.renewedDate && (
                <>
                  <Descriptions.Item label="Last Renewed Date">
                    {new Date(record.renewedDate).toLocaleDateString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Renewed By">
                    {record.renewedBy
                      ? `${record.renewedBy.firstName} ${record.renewedBy.lastName}`
                      : "-"}
                  </Descriptions.Item>
                </>
              )}
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

        {/* Attachments */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={4}>
              <PaperClipOutlined /> Attachments
            </Title>
            {record?.attachments && record.attachments.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={record.attachments as Attachment[]}
                renderItem={(attachment: Attachment) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {attachment.name}
                        </a>
                      }
                      description={`Uploaded by ${
                        attachment.uploadedBy
                      } on ${new Date(
                        attachment.uploadedAt
                      ).toLocaleDateString()}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">No attachments found</Text>
            )}
          </Space>
        </Card>

        {/* Reviews */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Space style={{ width: "100%", justifyContent: "space-between" }}>
              <Title level={4}>
                <TeamOutlined /> Reviews
              </Title>
              {(record?.status === "NEW" ||
                record?.status === "PENDING_REVIEW") &&
                record?.id && (
                  <RequestReview
                    contractId={record.id.toString()}
                    onSuccess={() => {
                      // Refresh the page to show updated reviews
                      window.location.reload();
                    }}
                    stakeholders={record?.stakeholders}
                  />
                )}
            </Space>
            <ContractReviews
              contractId={record?.id?.toString() || ""}
              reviews={record?.reviews || []}
              onReviewUpdate={() => {
                // Refresh the page to show updated reviews
                window.location.reload();
              }}
            />
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
