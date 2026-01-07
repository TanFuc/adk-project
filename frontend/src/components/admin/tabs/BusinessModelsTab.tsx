import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import type { MoHinhKinhDoanh } from "@/types";

export function BusinessModelsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MoHinhKinhDoanh | null>(null);
  const [deleteItem, setDeleteItem] = useState<MoHinhKinhDoanh | null>(null);
  const [formData, setFormData] = useState({
    ten: "",
    moTa: "",
    anhIcon: "",
    tiemNangLoiNhuan: "",
    thuTu: 0,
    hienThi: true,
  });

  const { data: models = [], isLoading } = useQuery({
    queryKey: ["adminBusinessModels"],
    queryFn: () => adminApi.getAllBusinessModels(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<MoHinhKinhDoanh>) => adminApi.createBusinessModel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBusinessModels"] });
      toast({ title: "Thành công", description: "Đã tạo mô hình kinh doanh mới", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể tạo mô hình kinh doanh", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MoHinhKinhDoanh> }) =>
      adminApi.updateBusinessModel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBusinessModels"] });
      toast({ title: "Thành công", description: "Đã cập nhật mô hình kinh doanh", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật mô hình kinh doanh", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBusinessModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBusinessModels"] });
      toast({ title: "Thành công", description: "Đã xóa mô hình kinh doanh", variant: "success" });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa mô hình kinh doanh", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleBusinessModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBusinessModels"] });
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái", variant: "success" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái", variant: "destructive" });
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      ten: "",
      moTa: "",
      anhIcon: "",
      tiemNangLoiNhuan: "",
      thuTu: models.length,
      hienThi: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MoHinhKinhDoanh) => {
    setEditingItem(item);
    setFormData({
      ten: item.ten,
      moTa: item.moTa,
      anhIcon: item.anhIcon || "",
      tiemNangLoiNhuan: item.tiemNangLoiNhuan || "",
      thuTu: item.thuTu,
      hienThi: item.hienThi,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!formData.ten || !formData.moTa) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ thông tin bắt buộc", variant: "destructive" });
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
        <h2 className="text-lg font-semibold">Quản lý Mô hình Kinh doanh</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminBusinessModels"] })}
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tên</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Mô tả</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tiềm năng</th>
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
            ) : models.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Chưa có mô hình nào
                </td>
              </tr>
            ) : (
              models.map((model, index) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <GripVertical className="w-4 h-4" />
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {model.anhIcon && (
                        <img
                          src={model.anhIcon}
                          alt={model.ten}
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <span className="font-medium">{model.ten}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500 truncate max-w-xs">{model.moTa}</div>
                  </td>
                  <td className="px-4 py-3">
                    {model.tiemNangLoiNhuan && (
                      <Badge variant="info">{model.tiemNangLoiNhuan}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={model.hienThi}
                        onCheckedChange={() => toggleMutation.mutate(model.id)}
                      />
                      {model.hienThi ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(model)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteItem(model)}>
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
            <DialogTitle>
              {editingItem ? "Chỉnh sửa Mô hình" : "Thêm Mô hình mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ten">Tên mô hình *</Label>
              <Input
                id="ten"
                value={formData.ten}
                onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                placeholder="VD: Đa Dạng Nguồn Thu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="moTa">Mô tả *</Label>
              <Textarea
                id="moTa"
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                placeholder="Mô tả chi tiết về mô hình"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="anhIcon">URL Icon (tùy chọn)</Label>
              <Input
                id="anhIcon"
                value={formData.anhIcon}
                onChange={(e) => setFormData({ ...formData, anhIcon: e.target.value })}
                placeholder="https://example.com/icon.svg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tiemNangLoiNhuan">Tiềm năng lợi nhuận (tùy chọn)</Label>
              <Input
                id="tiemNangLoiNhuan"
                value={formData.tiemNangLoiNhuan}
                onChange={(e) => setFormData({ ...formData, tiemNangLoiNhuan: e.target.value })}
                placeholder="VD: 25-40% biên lợi nhuận"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="thuTu">Thứ tự</Label>
                <Input
                  id="thuTu"
                  type="number"
                  value={formData.thuTu}
                  onChange={(e) =>
                    setFormData({ ...formData, thuTu: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Switch
                  id="hienThi"
                  checked={formData.hienThi}
                  onCheckedChange={(checked) => setFormData({ ...formData, hienThi: checked })}
                />
                <Label htmlFor="hienThi">Hiển thị</Label>
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
        description={`Bạn có chắc chắn muốn xóa mô hình "${deleteItem?.ten}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
