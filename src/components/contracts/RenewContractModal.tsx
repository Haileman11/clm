import { Modal, Form, InputNumber, message } from "antd";
import { useApiUrl } from "@refinedev/core";

interface RenewContractModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  contractId: string;
}

export const RenewContractModal: React.FC<RenewContractModalProps> = ({
  open,
  onCancel,
  onSuccess,
  contractId,
}) => {
  const [form] = Form.useForm();
  const apiUrl = useApiUrl();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response = await fetch(`${apiUrl}/contracts/${contractId}/renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ extensionPeriod: values.extensionPeriod }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to renew contract");
      }

      message.success("Contract renewed successfully");
      form.resetFields();
      onSuccess();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to renew contract");
    }
  };

  return (
    <Modal
      title="Renew Contract"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Renew"
      cancelText="Cancel"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ extensionPeriod: 12 }}
      >
        <Form.Item
          label="Extension Period (months)"
          name="extensionPeriod"
          rules={[
            { required: true, message: "Please enter the extension period" },
            { type: "number", min: 1, message: "Period must be at least 1 month" },
            { type: "number", max: 60, message: "Period cannot exceed 60 months" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            max={60}
            placeholder="Enter number of months"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 