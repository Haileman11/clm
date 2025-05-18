"use client";

import {
  List,
  useTable,
  EditButton,
  DeleteButton,
  ShowButton,
  CreateButton,
  DateField,
} from "@refinedev/antd";
import { Table, Space, Input, Select } from "antd";
import { useState } from "react";
import { CONTRACT_STATUS } from "@lib/types";
export default function ContractList() {
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof CONTRACT_STATUS[keyof typeof CONTRACT_STATUS] | "">("");

  const { tableProps } = useTable({
    resource: "contracts",
    filters: {
      initial: [
      {
        field: "name",
        operator: "contains",
        value: searchText,
      },
      ...(statusFilter ? [{
        field: "status",
        operator: "eq" as const,
        value: statusFilter,
      }] : []),
    ],}
  });

  return (
    <List
      headerButtons={({ createButtonProps }) => (
        <>
          <Input.Search
            placeholder="Search contracts..."
            style={{ width: 300, marginRight: 16 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            style={{ width: 200, marginRight: 16 }}
            placeholder="Filter by status"
            allowClear
            onChange={(value) => setStatusFilter(value)}
          >
            {Object.values(CONTRACT_STATUS).map((status) => (
              <Select.Option key={status} value={status}>
                {status.replace(/_/g, " ")}
              </Select.Option>
            ))}
          </Select>
          <CreateButton {...createButtonProps} />
        </>
      )}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column
          dataIndex="effectiveDate"
          title="Effective Date"
          render={(value) => <DateField value={value} />}
        />
        <Table.Column
          dataIndex="expirationDate"
          title="Expiration Date"
          render={(value) => <DateField value={value} />}
        />
        <Table.Column dataIndex="clientLegalEntity" title="Client" />
        <Table.Column dataIndex="termType" title="Term Type" />
        <Table.Column dataIndex="contractType" title="Contract Type" />
        <Table.Column dataIndex="supplierService" title="Service" />
        <Table.Column dataIndex="country" title="Country" />
        <Table.Column dataIndex="currency" title="Currency" />
        <Table.Column
          dataIndex="totalValue"
          title="Total Value"
          render={(value) => value.toLocaleString()}
        />
        <Table.Column dataIndex="status" title="Status" />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
} 