"use client";

import { ThemedLayoutV2 } from "@refinedev/antd";
import { Header } from "@components/header";
import Image from "next/image";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemedLayoutV2
      Header={Header}
      Title={() => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/icon.ico"
            height={24}
            width={24}
            alt="Safaricom Logo"
            style={{ margin: "12px" }}
          />
          <span style={{ fontWeight: "bold" }}>CLM</span>
        </div>
      )}
    >
      {children}
    </ThemedLayoutV2>
  );
};
