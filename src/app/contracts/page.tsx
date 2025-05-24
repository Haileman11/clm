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
import { Table, Space, Input, Select, Button, Tag } from "antd";
import { useState } from "react";
import { CONTRACT_STATUS } from "@lib/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ImportExportButtons } from "@/components/contracts/ImportExportButtons";

interface ExtendedSession {
  user: {
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function ContractList() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const router = useRouter();
  const isReadOnly = session?.user?.role !== "CONTRACT_MANAGER";

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
      headerProps={{
        title: "Contracts",
        extra: <ImportExportButtons />,
      }}
      headerButtons={
        !isReadOnly
          ? [
              <Button
                type="primary"
                onClick={() => router.push("/contracts/create")}
              >
                Create Contract
              </Button>,
            ]
          : undefined
      }
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="name"
          title="Name"
          render={(value, record: any) => (
            <Button
              type="link"
              onClick={() => router.push(`/contracts/show/${record.id}`)}
            >
              {value}
            </Button>
          )}
        />
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
        <Table.Column
          dataIndex="status"
          title="Status"
          render={(value) => (
            <Tag
              color={
                value === "active"
                  ? "success"
                  : value === "expired"
                  ? "error"
                  : "warning"
              }
            >
              {value.toUpperCase()}
            </Tag>
          )}
        />
        {!isReadOnly && (
          <Table.Column
            title="Actions"
            render={(_, record: any) => (
              <Space>
                <Button
                  type="link"
                  onClick={() => router.push(`/contracts/edit/${record.id}`)}
                >
                  Edit
                </Button>
              </Space>
            )}
          />
        )}
      </Table>
    </List>
  );
} 