"use client";

import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Card, Descriptions, Tag, Tooltip } from "antd";
import { SUPPLIER_SERVICE_OPTIONS, COUNTRY_OPTIONS } from "@lib/types";

const { Title } = Typography;

export default function VendorShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "INACTIVE":
        return "error";
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getSupplierServiceDescription = (service: string) => {
    return SUPPLIER_SERVICE_OPTIONS.find(option => option.value === service)?.description || "";
  };

  const getCountryDescription = (country: string) => {
    return COUNTRY_OPTIONS.find(option => option.value === country)?.description || "";
  };

  return (
    <Show isLoading={isLoading}>
      <Card>
        <Title level={5}>Vendor Details</Title>
        <Descriptions bordered>
          <Descriptions.Item label="Name" span={3}>
            {record?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Number" span={3}>
            {record?.number || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Supplier Service" span={3}>
            <Tooltip title={getSupplierServiceDescription(record?.supplierService)}>
              {record?.supplierService}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="VAT Registration ID" span={3}>
            {record?.vatRegistrationId || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={3}>
            {record?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Country" span={3}>
            <Tooltip title={getCountryDescription(record?.country)}>
              {record?.country}
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            <Tag color={getStatusColor(record?.status)}>
              {record?.status}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Parent Vendor" span={3}>
            {record?.parentVendor?.name || "None"}
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