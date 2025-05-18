"use client";

import { Edit } from "@refinedev/antd";
import { useEdit } from "@refinedev/core";
import { Form, Input, Select } from "antd";

export default function VendorEdit() {
  const { formProps, saveButtonProps, queryResult } = useEdit();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true },
            { type: "email" }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Pending", value: "pending" }
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
} 