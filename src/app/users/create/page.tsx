"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, AutoComplete, message } from "antd";
import { useState } from "react";
import { useApiUrl } from "@refinedev/core";
import debounce from "lodash/debounce";

interface KeycloakUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string | null;
  enabled: boolean;
}

export default function UserCreate() {
  const { formProps, saveButtonProps } = useForm();
  const [emailOptions, setEmailOptions] = useState<{ value: string; label: string; user: KeycloakUser }[]>([]);
  const [searching, setSearching] = useState(false);
  const apiUrl = useApiUrl();

  const handleEmailSearch = debounce(async (value: string) => {
    if (!value || value.length < 3) {
      setEmailOptions([]);
      return;
    }

    setSearching(true);
    try {
      const response = await fetch(`${apiUrl}/users/search?email=${encodeURIComponent(value)}`);
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();

      if (data.users && data.users.length > 0) {
        const options = data.users.map((user: KeycloakUser) => ({
          value: user.email,
          label: `${user.firstName} ${user.lastName} (${user.email})`,
          user: user,
        }));
        setEmailOptions(options);
      } else {
        setEmailOptions([]);
        message.info('No users found with this email');
      }
    } catch (error) {
      console.error("Error searching users:", error);
      message.error('Failed to search users');
      setEmailOptions([]);
    } finally {
      setSearching(false);
    }
  }, 500);

  const handleEmailSelect = (value: string, option: any) => {
    if (option.user) {
      const user = option.user as KeycloakUser;
      formProps.form?.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role || undefined,
      });

      // Show a message if the user is already in the system
      if (user.id) {
        message.info('User found in Keycloak. Please review and update the details if needed.');
      }
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <AutoComplete
            options={emailOptions}
            onSearch={handleEmailSearch}
            onSelect={handleEmailSelect}
            notFoundContent={searching ? "Searching..." : "No users found"}
            style={{ width: '100%' }}
          >
            <Input.Search
              placeholder="Search by email (minimum 3 characters)"
              loading={searching}
              allowClear
              enterButton="Search"
            />
          </AutoComplete>
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
          <Select
            options={[
              { label: "Contract Manager", value: "CONTRACT_MANAGER" },
              { label: "Contract Owner", value: "CONTRACT_OWNER" },
              { label: "Vendor", value: "VENDOR" },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
} 