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
} from "antd";
import { useState } from "react";

export default function ContractCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: "contracts",
  });

  const [selectedCurrency, setSelectedCurrency] = useState<string>("ETB");

  const { selectProps: vendorSelectProps } = useSelect({
    resource: "vendors",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: stakeholderSelectProps } = useSelect({
    resource: "users",
    optionLabel: "email",
    optionValue: "id",
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
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Effective Date"
          name="effectiveDate"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Expiration Date"
          name="expirationDate"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Client Legal Entity"
          name="clientLegalEntity"
          rules={[{ required: true }]}
        >
          <Input defaultValue="Safaricom Ethiopia" />
        </Form.Item>
        <Form.Item
          label="Term Type"
          name="termType"
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
          label="Contract Type"
          name="contractType"
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
        <Form.Item
          label="Supplier Service"
          name="supplierService"
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
        <Form.Item label="Country" name="country" rules={[{ required: true }]}>
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
        <Form.Item
          label="Currency"
          name="currency"
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
          label="Total Contract Value"
          name="totalValue"
          rules={[{ required: true }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|Br\s?|(,*)/g, "")}
          />
        </Form.Item>
        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select>
            {CONTRACT_STATUS.map((status) => (
              <Select.Option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Vendor" name="vendorId" rules={[{ required: true }]}>
          <Select {...vendorSelectProps} />
        </Form.Item>
        <Form.Item
          label="Stakeholders"
          name="stakeholders"
          rules={[{ required: true }]}
        >
          <Select {...stakeholderSelectProps} mode="multiple" />
        </Form.Item>
      </Form>
    </Create>
  );
}
