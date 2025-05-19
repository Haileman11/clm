"use client";

import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function UserEdit() {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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
          label="Email"
          name="email"
          rules={[
            { required: true },
            { type: "email", message: "Please enter a valid email" },
          ]}
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
          <Select
            options={[
              { label: "Contract Manager", value: "CONTRACT_MANAGER" },
              { label: "Contract Owner", value: "CONTRACT_OWNER" },
              { label: "Vendor", value: "VENDOR" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Keycloak ID"
          name="keycloakId"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
} 