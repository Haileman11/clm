"use client";

import {
  List,
  useTable,
  DeleteButton,
  ShowButton,
  CreateButton,
} from "@refinedev/antd";
import { Table, Space } from "antd";
import { useGetIdentity } from "@refinedev/core";

export default function UserManagementPage() {
  const { data: identity } = useGetIdentity();
  const { tableProps } = useTable({
    resource: "users",
  });

  return (
    <List
      headerButtons={({ createButtonProps }) => (
        <>
          <CreateButton {...createButtonProps} />
        </>
      )}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="firstName" title="First Name" />
        <Table.Column dataIndex="lastName" title="Last Name" />
        <Table.Column dataIndex="email" title="Email" />
        <Table.Column dataIndex="department" title="Department" />
        <Table.Column dataIndex="role" title="Role" />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
} 