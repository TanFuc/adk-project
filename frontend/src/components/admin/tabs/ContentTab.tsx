import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, Image as ImageIcon, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api";
import { ConfirmDialog } from "../ConfirmDialog";
import type { Content, ContentType } from "@/types";

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: "HERO", label: "Hero Banner" },
  { value: "FEATURE", label: "Features" },
  { value: "STATISTIC", label: "Statistics" },
  { value: "FAQ", label: "FAQs" },
  { value: "PARTNER", label: "Partners" },
  { value: "TESTIMONIAL", label: "Testimonials" },
];

export function ContentTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Content | null>(null);
  const [deleteItem, setDeleteItem] = useState<Content | null>(null);
  const [filterType, setFilterType] = useState<ContentType | "ALL">("ALL");
  
  const [formData, setFormData] = useState({
    type: "FEATURE" as ContentType,
    title: "",
    description: "",
    imageUrl: "",
    additionalData: "{}",
  });

  const { data: allContent = [], isLoading } = useQuery({
    queryKey: ["adminContent"],
    queryFn: () => adminApi.getAllContent(),
  });

  const filteredContent = filterType === "ALL" 
    ? allContent 
    : allContent.filter(item => item.type === filterType);

  const createMutation = useMutation({
    mutationFn: (data: {
      type: ContentType;
      title: string;
      description?: string;
      content: Record<string, unknown>;
      isVisible?: boolean;
    }) => adminApi.createContent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContent"] });
      queryClient.invalidateQueries({ queryKey: ["publicContent"] });
      toast({ title: "Thành công", description: "Đã tạo content mới", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể tạo content", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Content> }) =>
      adminApi.updateContent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContent"] });
      queryClient.invalidateQueries({ queryKey: ["publicContent"] });
      toast({ title: "Thành công", description: "Đã cập nhật content", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật content", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContent"] });
      queryClient.invalidateQueries({ queryKey: ["publicContent"] });
      toast({ title: "Thành công", description: "Đã xóa content", variant: "success" });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa content", variant: "destructive" });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      adminApi.updateContent(id, { isVisible }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminContent"] });
      queryClient.invalidateQueries({ queryKey: ["publicContent"] });
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái hiển thị", variant: "success" });
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      type: "FEATURE",
      title: "",
      description: "",
      imageUrl: "",
      additionalData: "{}",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Content) => {
    setEditingItem(item);
    const content = item.content as Record<string, unknown>;
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description || "",
      imageUrl: (content.imageUrl as string) || "",
      additionalData: JSON.stringify(content, null, 2),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!formData.title) {
      toast({ title: "Lỗi", description: "Vui lòng nhập tiêu đề", variant: "destructive" });
      return;
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(formData.additionalData);
      if (formData.imageUrl) {
        parsedContent.imageUrl = formData.imageUrl;
      }
    } catch {
      toast({ title: "Lỗi", description: "Dữ liệu bổ sung phải là JSON hợp lệ", variant: "destructive" });
      return;
    }

    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        data: {
          title: formData.title,
          description: formData.description || undefined,
          content: parsedContent,
        },
      });
    } else {
      createMutation.mutate({
        type: formData.type,
        title: formData.title,
        description: formData.description || undefined,
        content: parsedContent,
      });
    }
  };

  const getImageFromContent = (content: unknown): string | null => {
    if (typeof content === "object" && content !== null) {
      const obj = content as Record<string, unknown>;
      if (obj.imageUrl && typeof obj.imageUrl === "string") {
        return obj.imageUrl;
      }
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quản lý Nội dung</h2>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Content
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Label>Lọc theo loại:</Label>
          <Select value={filterType} onValueChange={(value) => setFilterType(value as ContentType | "ALL")}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              {CONTENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Chưa có content nào
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContent.map((item) => {
              const imageUrl = getImageFromContent(item.content);
              const typeLabel = CONTENT_TYPES.find(t => t.value === item.type)?.label || item.type;
              
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border hover:border-adk-green transition-colors"
                >
                  <div className="cursor-move text-gray-400">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <span className="px-2 py-0.5 bg-adk-green/10 text-adk-green text-xs rounded-full">
                        {typeLabel}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Tạo: {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibilityMutation.mutate({
                        id: item.id,
                        isVisible: !item.isVisible,
                      })}
                    >
                      {item.isVisible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteItem(item)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa Content" : "Thêm Content mới"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {!editingItem && (
              <div>
                <Label>Loại Content</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as ContentType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Tiêu đề *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề"
              />
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả"
                rows={3}
              />
            </div>

            <div>
              <Label>URL Hình ảnh</Label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="/images/concept/store-interior.jpg hoặc https://..."
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="max-w-xs rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = "";
                      e.currentTarget.alt = "Invalid image URL";
                      e.currentTarget.className = "hidden";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Dữ liệu bổ sung (JSON)</Label>
              <Textarea
                value={formData.additionalData}
                onChange={(e) => setFormData({ ...formData, additionalData: e.target.value })}
                placeholder='{"key": "value"}'
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nhập dữ liệu dạng JSON hợp lệ. URL hình ảnh sẽ tự động được thêm vào.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {editingItem ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        title="Xác nhận xóa"
        description={`Bạn có chắc muốn xóa content "${deleteItem?.title}"? Hành động này không thể hoàn tác.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
