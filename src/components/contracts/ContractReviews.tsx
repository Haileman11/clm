import { List, Tag, Button, Modal, Form, Input, message } from "antd";
import { useState } from "react";
import { useApiUrl } from "@refinedev/core";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  type: "LEGAL" | "CATEGORY_SOURCING";
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
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const apiUrl = useApiUrl();
  const { data: session } = useSession();

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

  const handleReview = async (values: { status: string; comments: string }) => {
    if (!selectedReview) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/contracts/${contractId}/reviews/${selectedReview.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      message.success("Review updated successfully");
      setIsModalOpen(false);
      form.resetFields();
      onReviewUpdate?.();
    } catch (error) {
      message.error("Failed to update review");
      console.error("Error updating review:", error);
    } finally {
      setLoading(false);
    }
  };

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
                <Button
                  type="link"
                  onClick={() => showReviewModal(review)}
                >
                  Review
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              title={
                <span>
                  {review.type === "LEGAL" ? "Legal Review" : "Category Sourcing Review"}
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
                    Reviewer: {review.reviewer.firstName} {review.reviewer.lastName}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReview}
          disabled={loading}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="comments"
            label="Comments"
            rules={[{ required: true, message: "Please enter comments" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 