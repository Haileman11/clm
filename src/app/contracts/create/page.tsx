"use client";

import {
  CONTRACT_STATUS,
  CONTRACT_TYPE_OPTIONS,
  TERM_TYPE_OPTIONS,
  SUPPLIER_SERVICE_OPTIONS,
  CURRENCY_OPTIONS,
  COUNTRY_OPTIONS,
} from "@lib/types";
import { Create, useForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Tooltip,
  Space,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { BaseRecord, HttpError } from "@refinedev/core";

const { Text } = Typography;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Stakeholder {
  userId: string;
  role: string;
}

interface ContractFormValues extends BaseRecord {
  name: string;
  clientLegalEntity: string;
  termType: string;
  contractType: string;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  supplierService: string;
  country: string;
  currency: string;
  totalValue: number;
  vendorId: string;
  stakeholders: {
    [key: string]: string[];
  };
}

const STAKEHOLDER_ROLES = [
  { value: "CONTRACT_MANAGER", label: "Contract Manager", required: true },
  { value: "CONTRACT_OWNER", label: "Contract Owner", required: true },
  { value: "LEGAL_TEAM", label: "Legal Team", required: false },
  { value: "CATEGORY_SOURCING_MANAGER", label: "Category Sourcing Manager", required: false },
] as const;

export default function ContractCreate() {
  const { formProps, saveButtonProps } = useForm<ContractFormValues, HttpError, ContractFormValues>({
    resource: "contracts",
    onMutationSuccess: (data, variables) => {
      // Transform stakeholders to the unified format
      if (variables.stakeholders) {
        const transformedStakeholders: Stakeholder[] = [];
        for (const [role, userIds] of Object.entries(variables.stakeholders)) {
          if (Array.isArray(userIds)) {
            userIds.forEach(userId => {
              transformedStakeholders.push({
                userId: typeof userId === 'object' && userId !== null ? (userId as { id: string }).id : userId,
                role
              });
            });
          }
        }
        variables.stakeholders = transformedStakeholders as any;
      }
    }
  });

  const [selectedCurrency, setSelectedCurrency] = useState<string>("ETB");

  const { selectProps: vendorSelectProps } = useSelect({
    resource: "vendors",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: contractManagerSelectProps } = useSelect<User>({
    resource: "users",
    optionLabel: (item) => `${item.firstName} ${item.lastName} (${item.email})`,
    optionValue: "id",
    meta: {
      role: "CONTRACT_MANAGER"
    }
  });

  const { selectProps: contractOwnerSelectProps } = useSelect<User>({
    resource: "users",
    optionLabel: (item) => `${item.firstName} ${item.lastName} (${item.email})`,
    optionValue: "id",
    meta: {
      role: "CONTRACT_OWNER"
    }
  });

  const { selectProps: legalTeamSelectProps } = useSelect<User>({
    resource: "users",
    optionLabel: (item) => `${item.firstName} ${item.lastName} (${item.email})`,
    optionValue: "id",
    meta: {
      role: "LEGAL_TEAM"
    }
  });

  const { selectProps: categorySourcingManagerSelectProps } = useSelect<User>({
    resource: "users",
    optionLabel: (item) => `${item.firstName} ${item.lastName} (${item.email})`,
    optionValue: "id",
    meta: {
      role: "CATEGORY_SOURCING_MANAGER"
    }
  });

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

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        {/* Basic Information */}
        <Form.Item
          label={
            <span>
              <FileTextOutlined /> Basic Information
            </span>
          }
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="clientLegalEntity"
            label="Client Legal Entity"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="termType"
            label="Term Type"
            rules={[{ required: true }]}
          >
            <Select>
              {TERM_TYPE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <Tooltip title={option.description}>
                    {option.label}
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="contractType"
            label="Contract Type"
            rules={[{ required: true }]}
          >
            <Select>
              {CONTRACT_TYPE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <Tooltip title={option.description}>
                    {option.label}
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              {CONTRACT_STATUS.map((status) => (
                <Select.Option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form.Item>

        {/* Contract Period */}
        <Form.Item
          label={
            <span>
              <CalendarOutlined /> Contract Period
            </span>
          }
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="effectiveDate"
            label="Effective Date"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="expirationDate"
            label="Expiration Date"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form.Item>

        {/* Service Information */}
        <Form.Item
          label={
            <span>
              <ShopOutlined /> Service Information
            </span>
          }
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="supplierService"
            label="Supplier Service"
            rules={[{ required: true }]}
          >
            <Select>
              {SUPPLIER_SERVICE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <Tooltip title={option.description}>
                    {option.label}
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Select a country"
              optionFilterProp="label"
              filterOption={(input, option) => {
                const label = option?.label?.props?.children || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
              options={COUNTRY_OPTIONS.map((option) => ({
                label: (
                  <Tooltip title={option.description}>
                    {option.label}
                  </Tooltip>
                ),
                value: option.value,
              }))}
            />
          </Form.Item>
        </Form.Item>

        {/* Financial Information */}
        <Form.Item
          label={
            <span>
              <DollarOutlined /> Financial Information
            </span>
          }
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true }]}
          >
            <Select
              onChange={(value) => setSelectedCurrency(value)}
              options={CURRENCY_OPTIONS.map((option) => ({
                label: (
                  <Tooltip title={option.description}>
                    {option.label}
                  </Tooltip>
                ),
                value: option.value,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="totalValue"
            label="Total Contract Value"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) => `${getCurrencySymbol(selectedCurrency)}${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|Br\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Form.Item>

        {/* Stakeholders */}
        <Form.Item
          label={
            <span>
              <TeamOutlined /> Stakeholders
            </span>
          }
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="vendorId"
            label="Vendor"
            rules={[{ required: true }]}
          >
            <Select {...vendorSelectProps} />
          </Form.Item>
          
          <Form.Item
            name={["stakeholders", "CONTRACT_MANAGER"]}
            label={
              <Space>
                Contract Manager
                <Text type="danger">*</Text>
              </Space>
            }
            rules={[{ required: true }]}
          >
            <Select
              {...contractManagerSelectProps}
              mode="multiple"
              showSearch
              filterOption={(input, option) => {
                const label = option?.label?.toString() || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            />
          </Form.Item>

          <Form.Item
            name={["stakeholders", "CONTRACT_OWNER"]}
            label={
              <Space>
                Contract Owner
                <Text type="danger">*</Text>
              </Space>
            }
            rules={[{ required: true }]}
          >
            <Select
              {...contractOwnerSelectProps}
              mode="multiple"
              showSearch
              filterOption={(input, option) => {
                const label = option?.label?.toString() || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            />
          </Form.Item>

          <Form.Item
            name={["stakeholders", "LEGAL_TEAM"]}
            label="Legal Team"
          >
            <Select
              {...legalTeamSelectProps}
              mode="multiple"
              showSearch
              filterOption={(input, option) => {
                const label = option?.label?.toString() || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            />
          </Form.Item>

          <Form.Item
            name={["stakeholders", "CATEGORY_SOURCING_MANAGER"]}
            label="Category Sourcing Manager"
          >
            <Select
              {...categorySourcingManagerSelectProps}
              mode="multiple"
              showSearch
              filterOption={(input, option) => {
                const label = option?.label?.toString() || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            />
          </Form.Item>
        </Form.Item>
      </Form>
    </Create>
  );
}
