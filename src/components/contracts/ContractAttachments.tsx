import { Upload, Button, List, message } from "antd";
import { UploadOutlined, DeleteOutlined, FileOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Attachment {
  id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

interface ContractAttachmentsProps {
  contractId?: string;
  attachments: Attachment[];
  onAttachmentsChange?: (attachments: Attachment[]) => void;
}

export const ContractAttachments = ({
  contractId,
  attachments = [],
  onAttachmentsChange,
}: ContractAttachmentsProps) => {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      if (contractId) {
        formData.append("contractId", contractId);
      }

      const response = await fetch("/api/contracts/attachments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      message.success(`${file.name} uploaded successfully`);
      
      if (onAttachmentsChange) {
        onAttachmentsChange([...attachments, data]);
      }
    } catch (error) {
      message.error(`${file.name} upload failed`);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleDelete = async (attachment: Attachment) => {
    try {
      // If we have an ID, it's a saved attachment
      if (attachment.id) {
        const response = await fetch(`/api/contracts/attachments?id=${attachment.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Delete failed");
        }
      }

      message.success("Attachment deleted successfully");
      
      if (onAttachmentsChange) {
        onAttachmentsChange(attachments.filter(a => a.url !== attachment.url));
      }
    } catch (error) {
      message.error("Failed to delete attachment");
      console.error("Delete error:", error);
    }
  };

  return (
    <div>
      <Upload
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        showUploadList={false}
        beforeUpload={handleUpload}
        disabled={uploading}
      >
        <Button icon={<UploadOutlined />} loading={uploading}>
          Upload Attachment
        </Button>
      </Upload>

      <List
        style={{ marginTop: 16 }}
        itemLayout="horizontal"
        dataSource={attachments}
        renderItem={(attachment) => (
          <List.Item
            actions={[
              <Button
                key="delete"
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(attachment)}
              >
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<FileOutlined />}
              title={
                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                  {attachment.name}
                </a>
              }
              description={`Uploaded by ${attachment.uploadedBy} on ${new Date(
                attachment.uploadedAt
              ).toLocaleDateString()}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}; 