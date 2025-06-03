import { BellOutlined } from "@ant-design/icons";
import { Dropdown, List, Badge, Avatar, theme } from "antd";
import { useList } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { useSession } from "next-auth/react";
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const NotificationDropdown = () => {
  const { data: user } = useSession();
  console.log(user);
  const { data, isLoading } = useList({
    resource: `notifications`,
    filters: [
      {
        field: "email",
        operator: "eq",
        value: user?.user.email,
      },
    ],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { pageSize: 10 },
    queryOptions: {
      enabled: !!user,
    },
  });
  const { token } = useToken();

  const items = (
    <List
      bordered
      style={{ backgroundColor: token.colorBgElevated, width: 300 }}
      itemLayout="vertical"
      dataSource={data?.data ?? []}
      loading={isLoading}
      header="Notifications"
      renderItem={(item) => (
        <List.Item>
          <div>
            <strong>{item.title}</strong>
            <div style={{ fontSize: 12, color: "#888" }}>{item.body}</div>
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <Dropdown overlay={items} trigger={["click"]}>
      <Avatar
        icon={
          <Badge dot={true}>
            <BellOutlined style={{ fontSize: 18, cursor: "pointer" }} />
          </Badge>
        }
      />
    </Dropdown>
  );
};
