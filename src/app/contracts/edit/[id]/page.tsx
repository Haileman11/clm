"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber, Tooltip } from "antd";
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
} from "@lib/types";
import dayjs from "dayjs";
import { useState } from "react";

export default function ContractEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({
    onMutationSuccess: (data, variables: any) => {
      console.log(data, variables);
      if (variables.stakeholders) {
        variables.stakeholders = variables.stakeholders.map(
          (stakeholder: any) => {
            stakeholder.id;
          }
        );
      }
    },
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>("ETB");
  const { data, isLoading } = queryResult!;
  const record = data?.data;
  const { selectProps: vendorSelectProps } = useSelect({
    resource: "vendors",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: stakeholderSelectProps } = useSelect({
    resource: "users",
    optionLabel: "email",
    optionValue: "id",
    filters: [
      {
        field: "id",
        operator: "ne",
        value: record?.id,
      },
    ],
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
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
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
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
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
                  <Tooltip title={option.description}>{option.label}</Tooltip>
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
                  <Tooltip title={option.description}>{option.label}</Tooltip>
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
            rules={[{ required: true }]}
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
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${getCurrencySymbol(selectedCurrency)}${value}`.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )
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
            <Select {...vendorSelectProps} />
          </Form.Item>
          <Form.Item
            name="stakeholders"
            label="Stakeholders"
            rules={[{ required: true }]}
          >
            <Select {...stakeholderSelectProps} mode="multiple" />
          </Form.Item>
        </Form.Item>
      </Form>
    </Edit>
  );
}
