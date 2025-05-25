import { Button, message } from "antd";
import { useApiUrl } from "@refinedev/core";
import { useState } from "react";
import { RenewContractModal } from "./RenewContractModal";

interface ContractActionsProps {
  contractId: string;
  status: string;
  onSuccess?: () => void;
}

export const ContractActions: React.FC<ContractActionsProps> = ({
  contractId,
  status,
  onSuccess,
}) => {
  const apiUrl = useApiUrl();
  const [renewModalOpen, setRenewModalOpen] = useState(false);

  const handleActivate = async () => {
    try {
      const response = await fetch(`${apiUrl}/contracts/${contractId}/activate`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to activate contract");
      }

      message.success("Contract activated successfully");
      onSuccess?.();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to activate contract");
    }
  };

  const handleTerminate = async () => {
    try {
      const response = await fetch(`${apiUrl}/contracts/${contractId}/terminate`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to terminate contract");
      }

      message.success("Contract terminated successfully");
      onSuccess?.();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to terminate contract");
    }
  };

  return (
    <div className="space-x-2">
      {status === "REVIEWED" && (
        <Button type="primary" onClick={handleActivate}>
          Activate Contract
        </Button>
      )}
      {status === "ACTIVE" && (
        <>
          <Button type="primary" onClick={() => setRenewModalOpen(true)}>
            Renew Contract
          </Button>
          <Button danger onClick={handleTerminate}>
            Terminate Contract
          </Button>
        </>
      )}
      <RenewContractModal
        open={renewModalOpen}
        onCancel={() => setRenewModalOpen(false)}
        onSuccess={() => {
          setRenewModalOpen(false);
          onSuccess?.();
        }}
        contractId={contractId}
      />
    </div>
  );
}; 