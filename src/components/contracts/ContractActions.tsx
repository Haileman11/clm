import { Button, Space, message } from "antd";
import { usePermissions } from "@hooks/usePermissions";
import { WithPermission } from "@components/withPermission";
import { RenewContractModal } from "./RenewContractModal";
import { useState } from "react";

interface ContractActionsProps {
  contractId: string;
  status: string;
  onSuccess: () => void;
}

export function ContractActions({
  contractId,
  status,
  onSuccess,
}: ContractActionsProps) {
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const handleActivate = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/activate`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to activate contract");
      }

      onSuccess();
    } catch (error) {
      message.error("Failed to activate contract");
    }
  };
  const handleTerminate = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/terminate`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to terminate contract");
      }

      message.success("Contract terminated successfully");
      onSuccess?.();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "Failed to terminate contract"
      );
    }
  };
  const handleRenew = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ extensionPeriod: 12 }), // Default to 12 months
      });

      if (!response.ok) {
        throw new Error("Failed to renew contract");
      }

      onSuccess();
    } catch (error) {
      message.error("Failed to renew contract");
    }
  };

  return (
    <Space>
      <WithPermission action="contract:activate">
        {status === "REVIEWED" && (
          <Button type="primary" onClick={handleActivate}>
            Activate
          </Button>
        )}
      </WithPermission>

      <WithPermission action="contract:renew">
        {status === "ACTIVE" && (
          <Button type="primary" onClick={() => setRenewModalOpen(true)}>
            Renew
          </Button>
        )}
      </WithPermission>
      <WithPermission action="contract:terminate">
        {status === "ACTIVE" && (
          <Button danger onClick={handleTerminate}>
            Terminate Contract
          </Button>
        )}
      </WithPermission>
      <RenewContractModal
        open={renewModalOpen}
        onCancel={() => setRenewModalOpen(false)}
        onSuccess={() => {
          setRenewModalOpen(false);
          onSuccess?.();
        }}
        contractId={contractId}
      />
    </Space>
  );
}
