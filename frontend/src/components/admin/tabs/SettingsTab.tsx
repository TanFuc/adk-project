import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, RefreshCw, Save } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api";
import { ConfirmDialog } from "../ConfirmDialog";
import type { CauHinh } from "@/types";

export function SettingsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CauHinh | null>(null);
  const [deleteItem, setDeleteItem] = useState<CauHinh | null>(null);
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    moTa: "",
  });

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: () => adminApi.getAllSettings(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { key: string; value: unknown; moTa?: string }) =>
      adminApi.upsertSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
      queryClient.invalidateQueries({ queryKey: ["publicConfig"] }); // Invalidate public cache
      toast({ title: "Thành công", description: "Đã tạo cấu hình mới", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể tạo cấu hình", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, data }: { key: string; data: { value: unknown; moTa?: string } }) =>
      adminApi.updateSetting(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
      queryClient.invalidateQueries({ queryKey: ["publicConfig"] }); // Invalidate public cache
      toast({ title: "Thành công", description: "Đã cập nhật cấu hình", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật cấu hình", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) => adminApi.deleteSetting(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
      queryClient.invalidateQueries({ queryKey: ["publicConfig"] }); // Invalidate public cache
      toast({ title: "Thành công", description: "Đã xóa cấu hình", variant: "success" });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa cấu hình", variant: "destructive" });
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      key: "",
      value: "",
      moTa: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: CauHinh) => {
    setEditingItem(item);
    setFormData({
      key: item.key,
      value: JSON.stringify(item.value, null, 2),
      moTa: item.moTa || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!formData.key || !formData.value) {
      toast({ title: "Lỗi", description: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }

    let parsedValue;
    try {
      parsedValue = JSON.parse(formData.value);
    } catch {
      toast({ title: "Lỗi", description: "Giá trị phải là JSON hợp lệ", variant: "destructive" });
      return;
    }

    if (editingItem) {
      // Update existing setting
      updateMutation.mutate({
        key: formData.key,
        data: {
          value: parsedValue,
          moTa: formData.moTa || undefined,
        },
      });
    } else {
      // Create new setting
      createMutation.mutate({
        key: formData.key,
        value: parsedValue,
        moTa: formData.moTa || undefined,
      });
    }
  };

  const formatValue = (value: unknown): string => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Quản lý Cấu hình hệ thống</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminSettings"] })}
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Key</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Giá trị</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Mô tả</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : settings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Chưa có cấu hình nào
                </td>
              </tr>
            ) : (
              settings.map((setting) => (
                <tr key={setting.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{setting.key}</code>
                  </td>
                  <td className="px-4 py-3">
                    <pre className="text-xs bg-gray-50 p-2 rounded max-w-md overflow-auto max-h-24">
                      {formatValue(setting.value)}
                    </pre>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{setting.moTa || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(setting)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteItem(setting)}>
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
            <DialogTitle>{editingItem ? "Chỉnh sửa Cấu hình" : "Thêm Cấu hình mới"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                placeholder="VD: hero_stats, contact_hotline"
                disabled={!!editingItem}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Giá trị (JSON) *</Label>
              <Textarea
                id="value"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder='{"key": "value"}'
                rows={6}
                className="font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="moTa">Mô tả (tùy chọn)</Label>
              <Input
                id="moTa"
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                placeholder="Mô tả cấu hình này"
              />
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
              <Save className="w-4 h-4 mr-2" />
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
        description={`Bạn có chắc chắn muốn xóa cấu hình "${deleteItem?.key}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.key)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
