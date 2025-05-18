"use client";

import { Edit } from "@refinedev/antd";
import { useEdit } from "@refinedev/core";
import { Form, Input, Select, DatePicker, InputNumber } from "antd";
import dayjs from "dayjs";

export default function ContractEdit() {
  const { formProps, saveButtonProps, queryResult } = useEdit();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Contract Number"
          name="contractNumber"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Vendor"
          name="vendorId"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: record?.vendor?.name, value: record?.vendorId }
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
          })}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true }]}
          getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
          })}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" },
              { label: "Pending", value: "pending" }
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Value"
          name="value"
          rules={[{ required: true }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Edit>
  );
} 