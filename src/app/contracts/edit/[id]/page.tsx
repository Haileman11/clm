"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, InputNumber } from "antd";
import { CalendarOutlined, DollarOutlined, FileTextOutlined, ShopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function ContractEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const { selectProps: vendorSelectProps } = useSelect({
    resource: "vendors",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
            name="contractNumber"
            label="Contract Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="EXPIRED">Expired</Select.Option>
              <Select.Option value="PENDING">Pending</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="value"
            label="Value"
            rules={[{ required: true }]}
          >
            <InputNumber
              prefix="$"
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
        </Form.Item>

        {/* Vendor Information */}
        <Form.Item
          label={
            <span>
              <ShopOutlined /> Vendor Information
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
            name="startDate"
            label="Start Date"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true }]}
            getValueProps={(value) => ({
              value: value ? dayjs(value) : undefined,
            })}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form.Item>
      </Form>
    </Edit>
  );
} 