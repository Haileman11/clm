"use client";

import {
  List,
  useTable,
  EditButton,
  DeleteButton,
  ShowButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space, Input } from "antd";
import { useState } from "react";

export default function VendorList() {
  const [searchText, setSearchText] = useState("");
  const { tableProps } = useTable({
    resource: "vendors",
    filters: {
      permanent: [
        {
          field: "name",
          operator: "contains",
          value: searchText,
        },
      ],
    },      
  });

  return (
    <List
      headerButtons={({ createButtonProps }) => (
        <>
          <Input.Search
            placeholder="Search vendors..."
            style={{ width: 300, marginRight: 16 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <CreateButton {...createButtonProps} />
        </>
      )}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="name" title="Name" />
        <Table.Column dataIndex="number" title="Number" />
        <Table.Column dataIndex="supplierService" title="Service" />
        <Table.Column dataIndex="vatRegistrationId" title="VAT ID" />
        <Table.Column dataIndex="address" title="Address" />
        <Table.Column dataIndex="country" title="Country" />
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