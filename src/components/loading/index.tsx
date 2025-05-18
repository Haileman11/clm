import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingScreen = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} color="#4CAF50" spin />;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Spin indicator={antIcon} />
      <div style={{ fontSize: "16px", color: "#666" }}>Loading...</div>
    </div>
  );
};

export default LoadingScreen; 