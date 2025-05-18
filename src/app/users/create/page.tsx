"use client";

import { USER_ROLES } from "@lib/types";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: "users",
    redirect: "list",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true }]}
        >
          <Select>
            {USER_ROLES.map((role) => (
              <Select.Option key={role} value={role}>
                {role.replace(/_/g, " ")}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Create>
  );
} 