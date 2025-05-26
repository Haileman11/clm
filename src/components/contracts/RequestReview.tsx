import { Button, Modal, Form, Select, message } from "antd";
import { useState, useEffect } from "react";
import { useApiUrl } from "@refinedev/core";
import { useSession } from "next-auth/react";
import { useForm } from "@refinedev/antd";
import { WithPermission } from "@components/withPermission";

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
  const { form, formProps, saveButtonProps } = useForm({
    resource: `contracts/${contractId}/reviews`,
    action: "create",
    onMutationSuccess: () => {
      message.success("Review created successfully");
      setIsModalOpen(false);
      onSuccess?.();
    },
    onMutationError: (error) => {
      message.error("Failed to request review");
      console.error("Error creating review:", error);
    },
  });

  return (
    <>
      <WithPermission action="contract:request_review">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Request Review
        </Button>
      </WithPermission>

      <Modal
        title="Request Review"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} {...formProps} layout="vertical" disabled={loading}>
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
            <Button type="primary" {...saveButtonProps}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
