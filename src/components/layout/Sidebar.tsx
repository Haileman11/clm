import React from 'react';
import { SettingOutlined, ClockCircleOutlined } from '@ant-design/icons';

const Sidebar: React.FC = () => {
  const menuItems = [
    {
      key: "admin",
      label: "Admin",
      icon: <SettingOutlined />,
      children: [
        {
          key: "cron-logs",
          label: "Cron Logs",
          icon: <ClockCircleOutlined />,
          path: "/admin/cron-logs",
        },
      ],
    },
  ];

  return (
    <div>
      {/* Render your menu items here */}
    </div>
  );
};

export default Sidebar; 