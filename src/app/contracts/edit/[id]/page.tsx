"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Tooltip,
  Space,
  Typography,
  Upload,
} from "antd";
import {
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  CONTRACT_STATUS,
  CONTRACT_TYPE_OPTIONS,
  TERM_TYPE_OPTIONS,
  SUPPLIER_SERVICE_OPTIONS,
  CURRENCY_OPTIONS,
  COUNTRY_OPTIONS,
  STAKEHOLDER_ROLES,
} from "@lib/types";
import dayjs from "dayjs";
import { useState } from "react";
import { BaseRecord, HttpError, useList, useShow } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { message } from "antd";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function ContractEdit() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const router = useRouter();

  // Check if contract is active
  if (record?.status === "ACTIVE") {
    message.error("Active contracts cannot be edited");
    router.push(`/contracts/show/${record.id}`);
    return null;
  }

  const { formProps, saveButtonProps } = useForm({
    meta: {
      select: "*, vendor(*), stakeholders(*)",
    },
  });

  const [selectedCurrency, setSelectedCurrency] = useState<string>("ETB");
  const { data: usersData, isLoading: isUsersLoading } = useList<User>({
    resource: "users",
    pagination: { mode: "off" }, // Get all users
  });

  const users = usersData?.data ?? [];

  const buildSelectProps = (role: string) => {
    const filtered = users.filter((user) => user.role === role);
    return {
      options: filtered.map((user) => ({
        label: `${user.firstName} ${user.lastName} (${user.email})`,
        value: user.id,
      })),
    };
  };

  return (
    <Edit
      saveButtonProps={saveButtonProps}
      isLoading={isLoading && isUsersLoading}
    >
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...record,
          stakeholders: {
            CONTRACT_MANAGER:
              record?.stakeholders
                .filter((u: User) => u.role === "CONTRACT_MANAGER")
                .map((u: User) => u.id) || [],
            CONTRACT_OWNER:
              record?.stakeholders
                .filter((u: User) => u.role === "CONTRACT_OWNER")
                .map((u: User) => u.id) || [],
            LEGAL_TEAM:
              record?.stakeholders
                .filter((u: User) => u.role === "LEGAL_TEAM")
                .map((u: User) => u.id) || [],
            CATEGORY_SOURCING_MANAGER:
              record?.stakeholders
                .filter((u: User) => u.role === "CATEGORY_SOURCING_MANAGER")
                .map((u: User) => u.id) || [],
          },
        }}
      >
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
            rules={[{ required: true, message: "Please enter contract name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="clientLegalEntity"
            label="Client Legal Entity"
            rules={[{ required: true, message: "Please enter client legal entity" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="termType"
            label="Term Type"
            rules={[{ required: true, message: "Please select term type" }]}
          >
            <Select>
              {TERM_TYPE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <Tooltip title={option.description}>{option.label}</Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="contractType"
            label="Contract Type"
            rules={[{ required: true, message: "Please select contract type" }]}
          >
            <Select>
              {CONTRACT_TYPE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <Tooltip title={option.description}>{option.label}</Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
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
            rules={[{ required: true, message: "Please select effective date" }]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="expirationDate"
            label="Expiration Date"
            rules={[{ required: true, message: "Please select expiration date" }]}
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
            rules={[{ required: true, message: "Please select supplier service" }]}
          >
            <Select showSearch>
              {SUPPLIER_SERVICE_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  <Tooltip title={option.description}>{option.label}</Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: "Please select country" }]}
          >
            <Select
              showSearch
              placeholder="Select a country"
              optionFilterProp="label"
              filterOption={(input, option) => {
                const label = option?.label?.props?.children || "";
                return label.toLowerCase().includes(input.toLowerCase());
              }}
              options={COUNTRY_OPTIONS.map((option) => ({
                label: (
                  <Tooltip title={option.description}>{option.label}</Tooltip>
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
            rules={[{ required: true, message: "Please select currency" }]}
          >
            <Select
              onChange={(value) => setSelectedCurrency(value)}
              options={CURRENCY_OPTIONS.map((option) => ({
                label: (
                  <Tooltip title={option.description}>{option.label}</Tooltip>
                ),
                value: option.value,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="totalValue"
            label="Total Contract Value"
            rules={[{ required: true, message: "Please enter total value" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|Br\s?|(,*)/g, "")}
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
            <Select {...buildSelectProps("vendor")} showSearch />
          </Form.Item>

          {STAKEHOLDER_ROLES.map(({ value, label, required }) => (
            <Form.Item
              key={value}
              name={["stakeholders", value]}
              label={label}
              rules={required ? [{ required: true }] : []}
            >
              <Select
                {...buildSelectProps(value)}
                mode="multiple"
                showSearch
                filterOption={(input, option) =>
                  (option?.label?.toString() ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
              />
            </Form.Item>
          ))}
        </Form.Item>

        <Form.Item label="Attachments">
          <Form.Item
            name="attachments"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList.map((file: any) => {
                if (file.response) {
                  // Customize formdata with API response structure
                  return {
                    ...file,
                    ...file.response,
                  };
                }
                return file;
              });
            }}
            noStyle
          >
            <Upload.Dragger
              name="file"
              action={`/api/contracts/attachments`}
              listType="picture"
              maxCount={5}
              multiple
            >
              <p className="ant-upload-text">Drag & drop a file in this area</p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      </Form>
    </Edit>
  );
}
