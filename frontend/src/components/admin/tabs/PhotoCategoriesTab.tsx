import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { PhotoCategory } from "@/types";

export function PhotoCategoriesTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PhotoCategory | null>(null);
  const [deleteItem, setDeleteItem] = useState<PhotoCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sortOrder: 0,
    isVisible: true,
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["adminPhotoCategories"],
    queryFn: () => adminApi.getAllPhotoCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<PhotoCategory>) => adminApi.createPhotoCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotoCategories"] });
      queryClient.invalidateQueries({ queryKey: ["photoCategories"] });
      toast({ title: "Thành công", description: "Đã tạo danh mục mới", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể tạo danh mục", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PhotoCategory> }) =>
      adminApi.updatePhotoCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotoCategories"] });
      queryClient.invalidateQueries({ queryKey: ["photoCategories"] });
      toast({ title: "Thành công", description: "Đã cập nhật danh mục", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật danh mục", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePhotoCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotoCategories"] });
      queryClient.invalidateQueries({ queryKey: ["photoCategories"] });
      queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
      toast({ title: "Thành công", description: "Đã xóa danh mục", variant: "success" });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa danh mục", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.togglePhotoCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotoCategories"] });
      queryClient.invalidateQueries({ queryKey: ["photoCategories"] });
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái", variant: "success" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái", variant: "destructive" });
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      slug: "",
      sortOrder: categories.length,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PhotoCategory) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      slug: item.slug,
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingItem ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.slug) {
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
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Quản lý Danh mục Ảnh</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminPhotoCategories"] })}
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tên</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Số ảnh</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thứ tự</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Chưa có danh mục nào
                </td>
              </tr>
            ) : (
              categories.map((category: PhotoCategory & { _count?: { photos: number } }) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{category.name}</td>
                  <td className="px-4 py-3 text-gray-500">{category.slug}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      {category._count?.photos ?? category.photoCount ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">{category.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={category.isVisible}
                        onCheckedChange={() => toggleMutation.mutate(category.id)}
                      />
                      {category.isVisible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(category)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteItem(category)}>
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Cửa Hàng"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="VD: cua-hang"
              />
              <p className="text-xs text-gray-500">Chỉ sử dụng chữ thường, số và dấu gạch ngang</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isVisible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
              />
              <Label htmlFor="isVisible">Hiển thị</Label>
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
        description="Bạn có chắc chắn muốn xóa danh mục này? Tất cả hình ảnh trong danh mục sẽ bị xóa theo."
        confirmText="Xóa"
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
