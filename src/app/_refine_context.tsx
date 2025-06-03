"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { GitHubBanner, Refine, type AuthProvider } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import routerProvider from "@refinedev/nextjs-router";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";
import LoadingScreen from "@components/loading";

type RefineContextProps = {
  defaultMode?: string;
};

export const RefineContext = (
  props: React.PropsWithChildren<RefineContextProps>
) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  );
};

type AppProps = {
  defaultMode?: string;
};

const App = (props: React.PropsWithChildren<AppProps>) => {
  const { data, status } = useSession();
  const to = usePathname();
  const isContractManager = data?.user?.role === "CONTRACT_MANAGER";

  if (status === "loading") {
    return <LoadingScreen />;
  }

  const authProvider: AuthProvider = {
    login: async () => {
      signIn("keycloak", {
        callbackUrl: to ? to.toString() : "/",
        redirect: true,
      });

      return {
        success: true,
      };
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: "/login",
      });

      return {
        success: true,
      };
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return {
        error,
      };
    },
    check: async () => {
      if (status === "unauthenticated") {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    },
    getPermissions: async () => {
      return null;
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data;
        return {
          id: user.id,
          name: user.name,
          avatar: user.image,
        };
      }

      return null;
    },
  };

  const defaultMode = props?.defaultMode;

  // Define resources based on user role
  const resources = [
    {
      name: "contracts",
      list: "/contracts",
      create: isContractManager ? "/contracts/create" : undefined,
      edit: isContractManager ? "/contracts/edit/:id" : undefined,
      show: "/contracts/show/:id",
      meta: {
        canDelete: isContractManager,
        icon: <FileTextOutlined />,
      },
    },
    // Only show these resources for CONTRACT_MANAGER
    ...(isContractManager
      ? [
          {
            name: "vendors",
            list: "/vendors",
            create: "/vendors/create",
            edit: "/vendors/edit/:id",
            show: "/vendors/show/:id",
            meta: {
              canDelete: true,
              icon: <TeamOutlined />,
            },
          },
          {
            name: "users",
            list: "/users",
            create: "/users/create",
            show: "/users/show/:id",
            meta: {
              canDelete: true,
              icon: <UserOutlined />,
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <RefineKbarProvider>
        <AntdRegistry>
          <ColorModeContextProvider defaultMode={defaultMode}>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "zcrf0C-hsa2nM-Q75LiF",
              }}
              resources={resources}
            >
              {props.children}
              <RefineKbar />
            </Refine>
          </ColorModeContextProvider>
        </AntdRegistry>
      </RefineKbarProvider>
    </>
  );
};
