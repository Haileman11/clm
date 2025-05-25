import { Button, Space, message } from "antd";
import { usePermissions } from "@hooks/usePermissions";
import { WithPermission } from "@components/withPermission";

interface ContractActionsProps {
  contractId: string;
  status: string;
  onSuccess: () => void;
}

export function ContractActions({ contractId, status, onSuccess }: ContractActionsProps) {
  const { can } = usePermissions();

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
          <Button onClick={handleRenew}>Renew</Button>
        )}
      </WithPermission>
    </Space>
  );
} 