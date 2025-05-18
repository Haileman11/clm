"use client";

import { ThemedLayoutV2 } from "@refinedev/antd";
import { Header } from "@components/header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemedLayoutV2
      Header={Header}
      Title={() => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo.png"
            alt="CLM Logo"
            style={{ height: "8px", margin: "12px" }}
          />
          <span style={{fontWeight:"bold"}}>
            CLM
          </span>
        </div>
      )}
    >
      {children}
    </ThemedLayoutV2>
  );
}; 