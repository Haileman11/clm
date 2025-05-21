"use client";

import { SUPPLIER_SERVICE_OPTIONS, COUNTRY_OPTIONS } from "@lib/types";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Tooltip } from "antd";

export default function VendorCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: "vendors",
  });

  const { selectProps: parentVendorSelectProps } = useSelect({
    resource: "vendors",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
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
        <Form.Item
          label="VAT Registration ID"
          name="vatRegistrationId"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
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
        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select
            options={[
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
              { label: "Pending", value: "PENDING" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Parent Vendor" name="parentVendorId">
          <Select {...parentVendorSelectProps} />
        </Form.Item>
      </Form>
    </Create>
  );
}
