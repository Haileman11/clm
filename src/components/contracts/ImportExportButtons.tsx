import { Button, Upload, message } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useExport, useImport } from "@refinedev/core";
import { BaseRecord, HttpError } from "@refinedev/core";

interface Stakeholder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Contract extends BaseRecord {
  vendor?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    country?: string;
  };
  stakeholders: Stakeholder[];
}

export const ImportExportButtons = () => {
  const [importing, setImporting] = useState(false);

  const { triggerExport, isLoading: isExportLoading } = useExport<Contract>({
    resource: "contracts",
    mapData: (item) => {
      const contractManager = item.stakeholders.find(s => s.role === "CONTRACT_MANAGER");
      const contractOwner = item.stakeholders.find(s => s.role === "CONTRACT_OWNER");
      const legalTeam = item.stakeholders.filter(s => s.role === "LEGAL_TEAM");
      const categorySourcingManager = item.stakeholders.filter(s => s.role === "CATEGORY_SOURCING_MANAGER");

      return {
        ...item,
        vendorName: item.vendor?.name,
        vendorEmail: item.vendor?.email,
        vendorPhone: item.vendor?.phone,
        vendorAddress: item.vendor?.address,
        vendorCountry: item.vendor?.country,
        contractManagerName: contractManager ? `${contractManager.firstName} ${contractManager.lastName}` : "",
        contractManagerEmail: contractManager?.email || "",
        contractOwnerName: contractOwner ? `${contractOwner.firstName} ${contractOwner.lastName}` : "",
        contractOwnerEmail: contractOwner?.email || "",
        legalTeamName: legalTeam.map(lt => `${lt.firstName} ${lt.lastName}`).join(", "),
        legalTeamEmail: legalTeam.map(lt => lt.email).join(", "),
        categorySourcingManagerName: categorySourcingManager.map(csm => `${csm.firstName} ${csm.lastName}`).join(", "),
        categorySourcingManagerEmail: categorySourcingManager.map(csm => csm.email).join(", "),
      };
    },
  });

  const { handleChange, isLoading: isImportLoading } = useImport<Contract>({
    resource: "contracts",
  });

  const handleImport = async (file: File) => {
    try {
      setImporting(true);
      const formData = new FormData();
      formData.append("file", file);
      await handleChange({file: file});
    } finally {
      setImporting(false);
    }
    return false; // Prevent default upload behavior
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Upload
        accept=".csv"
        showUploadList={false}
        beforeUpload={handleImport}
        disabled={importing || isImportLoading}
      >
        <Button icon={<UploadOutlined />} loading={importing || isImportLoading}>
          Import
        </Button>
      </Upload>
      <Button 
        icon={<DownloadOutlined />} 
        onClick={() => triggerExport()} 
        loading={isExportLoading}
      >
        Export
      </Button>
    </div>
  );
}; 