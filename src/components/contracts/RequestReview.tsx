import { Button, Modal, Form, Select, message } from "antd";
import { useState, useEffect } from "react";
import { useApiUrl } from "@refinedev/core";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface RequestReviewProps {
  contractId: string;
  stakeholders: User[];
  onSuccess?: () => void;
}

export const RequestReview = ({
  contractId,
  onSuccess,
  stakeholders,
}: RequestReviewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reviewers, setReviewers] = useState<User[]>([]);
  const [fetchingReviewers, setFetchingReviewers] = useState(false);
  const apiUrl = useApiUrl();
  const { data: session } = useSession();

  const fetchReviewers = async (type: string) => {
    setReviewers(
      stakeholders.filter((stakeholder) => stakeholder.role == type)
    );
  };

  const handleTypeChange = (value: string) => {
    form.setFieldValue("reviewerId", undefined);
    fetchReviewers(value);
  };

  const handleSubmit = async (values: { type: string; reviewerId: string }) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/contracts/${contractId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to request review");
      }

      message.success("Review requested successfully");
      setIsModalOpen(false);
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error("Failed to request review");
      console.error("Error requesting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Request Review
      </Button>

      <Modal
        title="Request Review"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={loading}
        >
          <Form.Item
            name="type"
            label="Review Type"
            rules={[{ required: true, message: "Please select review type" }]}
          >
            <Select onChange={handleTypeChange}>
              <Select.Option value="LEGAL_TEAM">Legal Review</Select.Option>
              <Select.Option value="CATEGORY_SOURCING_MANAGER">
                Category Sourcing Review
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="reviewerId"
            label="Reviewer"
            rules={[{ required: true, message: "Please select reviewer" }]}
          >
            <Select
              showSearch
              placeholder="Select reviewer"
              optionFilterProp="children"
              loading={fetchingReviewers}
              disabled={fetchingReviewers}
            >
              {reviewers.map((reviewer) => (
                <Select.Option key={reviewer.id} value={reviewer.id}>
                  {reviewer.firstName} {reviewer.lastName} ({reviewer.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
