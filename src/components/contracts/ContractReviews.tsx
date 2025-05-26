import { List, Tag, Button, Modal, Form, Input, message, Select } from "antd";
import { useState } from "react";
import { useApiUrl } from "@refinedev/core";
import { useSession } from "next-auth/react";
import { useForm } from "@refinedev/antd";
import { WithPermission } from "@components/withPermission";

interface Review {
  id: string;
  type: "LEGAL_TEAM" | "CATEGORY_SOURCING_MANAGER";
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments?: string;
  reviewer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ContractReviewsProps {
  contractId: string;
  reviews: Review[];
  onReviewUpdate?: () => void;
}

export const ContractReviews = ({
  contractId,
  reviews,
  onReviewUpdate,
}: ContractReviewsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "warning";
    }
  };

  const { form, formProps, saveButtonProps } = useForm({
    resource: `contracts/${contractId}/reviews`,
    action: "edit",
    id: selectedReview?.id,
    onMutationSuccess: () => {
      message.success("Review updated successfully");
      setIsModalOpen(false);
      onReviewUpdate?.();
    },
    onMutationError: (error) => {
      message.error("Failed to update review");
      console.error("Error updating review:", error);
    },
  });

  const showReviewModal = (review: Review) => {
    setSelectedReview(review);
    form.setFieldsValue({
      status: review.status,
      comments: review.comments,
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={reviews}
        renderItem={(review) => (
          <List.Item
            actions={[
              review.status === "PENDING" && (
                <WithPermission action="contract:review">
                  <Button type="link" onClick={() => showReviewModal(review)}>
                    Review
                  </Button>
                </WithPermission>
              ),
            ]}
          >
            <List.Item.Meta
              title={
                <span>
                  {review.type === "LEGAL_TEAM"
                    ? "Legal Review"
                    : "Category Sourcing Review"}
                  <Tag
                    color={getStatusColor(review.status)}
                    style={{ marginLeft: 8 }}
                  >
                    {review.status}
                  </Tag>
                </span>
              }
              description={
                <>
                  <div>
                    Reviewer: {review.reviewer.firstName}{" "}
                    {review.reviewer.lastName}
                  </div>
                  <div>
                    Requested: {new Date(review.createdAt).toLocaleString()}
                  </div>
                  {review.comments && (
                    <div style={{ marginTop: 8 }}>{review.comments}</div>
                  )}
                </>
              }
            />
          </List.Item>
        )}
      />

      <Modal
        title="Review Contract"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="APPROVED">Approved</Select.Option>
              <Select.Option value="REJECTED">Rejected</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="comments"
            label="Comments"
            rules={[{ required: true, message: "Please enter comments" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" {...saveButtonProps}>
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
