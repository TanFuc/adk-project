import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api";
import { ConfirmDialog } from "../ConfirmDialog";
import type { PartnershipFaq } from "@/types";

export function FAQTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PartnershipFaq | null>(null);
  const [deleteItem, setDeleteItem] = useState<PartnershipFaq | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    sortOrder: 0,
    isVisible: true,
  });

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["adminFAQs"],
    queryFn: () => adminApi.getAllFAQs(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<PartnershipFaq>) => adminApi.createFAQ(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFAQs"] });
      toast({ title: "Thành công", description: "Đã tạo câu hỏi mới", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể tạo câu hỏi", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartnershipFaq> }) =>
      adminApi.updateFAQ(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFAQs"] });
      toast({ title: "Thành công", description: "Đã cập nhật câu hỏi", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật câu hỏi", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFAQs"] });
      toast({ title: "Thành công", description: "Đã xóa câu hỏi", variant: "success" });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa câu hỏi", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleFAQ(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFAQs"] });
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái", variant: "success" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái", variant: "destructive" });
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      question: "",
      answer: "",
      sortOrder: faqs.length,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PartnershipFaq) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!formData.question || !formData.answer) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quản lý Hỏi đáp Hợp tác</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminFAQs"] })}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-12">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Câu hỏi</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trả lời</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : faqs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Chưa có câu hỏi nào
                </td>
              </tr>
            ) : (
              faqs.map((faq, index) => (
                <tr key={faq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <GripVertical className="w-4 h-4" />
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium max-w-xs">{faq.question}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500 truncate max-w-md">{faq.answer}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={faq.isVisible}
                        onCheckedChange={() => toggleMutation.mutate(faq.id)}
                      />
                      {faq.isVisible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(faq)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteItem(faq)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa Câu hỏi" : "Thêm Câu hỏi mới"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Câu hỏi *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="VD: Tôi cần bao nhiêu vốn để bắt đầu?"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="answer">Câu trả lời *</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Nội dung câu trả lời chi tiết..."
                rows={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sortOrder">Thứ tự</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
                <Label htmlFor="isVisible">Hiển thị</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa câu hỏi này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
