import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff, RefreshCw } from "lucide-react";
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
import type { BannerPopup } from "@/types";

export function BannersTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BannerPopup | null>(null);
  const [deleteItem, setDeleteItem] = useState<BannerPopup | null>(null);
  const [formData, setFormData] = useState({
    hinhAnh: "",
    duongDan: "",
    hoatDong: true,
    doTreHienThi: 3000,
    thuTuUuTien: 0,
  });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["adminBanners"],
    queryFn: () => adminApi.getAllBanners(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<BannerPopup>) => adminApi.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast({ title: "Thành công", description: "Đã tạo banner mới", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể tạo banner", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BannerPopup> }) =>
      adminApi.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast({ title: "Thành công", description: "Đã cập nhật banner", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật banner", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast({ title: "Thành công", description: "Đã xóa banner", variant: "success" });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa banner", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
      toast({ title: "Thành công", description: "Đã cập nhật trạng thái", variant: "success" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể cập nhật trạng thái", variant: "destructive" });
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      hinhAnh: "",
      duongDan: "",
      hoatDong: true,
      doTreHienThi: 3000,
      thuTuUuTien: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: BannerPopup) => {
    setEditingItem(item);
    setFormData({
      hinhAnh: item.hinhAnh,
      duongDan: item.duongDan,
      hoatDong: item.hoatDong,
      doTreHienThi: item.doTreHienThi,
      thuTuUuTien: item.thuTuUuTien,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = () => {
    if (!formData.hinhAnh || !formData.duongDan) {
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
        <h2 className="text-lg font-semibold">Quản lý Banner Popup</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminBanners"] })}
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Hình ảnh</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Đường dẫn</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Độ trễ (ms)</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ưu tiên</th>
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
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Chưa có banner nào
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={banner.hinhAnh}
                      alt="Banner"
                      className="w-20 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={banner.duongDan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {banner.duongDan.slice(0, 30)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="px-4 py-3">{banner.doTreHienThi}</td>
                  <td className="px-4 py-3">{banner.thuTuUuTien}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={banner.hoatDong}
                        onCheckedChange={() => toggleMutation.mutate(banner.id)}
                      />
                      {banner.hoatDong ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(banner)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteItem(banner)}>
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
            <DialogTitle>{editingItem ? "Chỉnh sửa Banner" : "Thêm Banner mới"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hinhAnh">URL Hình ảnh *</Label>
              <Input
                id="hinhAnh"
                value={formData.hinhAnh}
                onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duongDan">Đường dẫn khi click *</Label>
              <Input
                id="duongDan"
                value={formData.duongDan}
                onChange={(e) => setFormData({ ...formData, duongDan: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="doTreHienThi">Độ trễ hiển thị (ms)</Label>
                <Input
                  id="doTreHienThi"
                  type="number"
                  value={formData.doTreHienThi}
                  onChange={(e) =>
                    setFormData({ ...formData, doTreHienThi: parseInt(e.target.value) || 3000 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thuTuUuTien">Thứ tự ưu tiên</Label>
                <Input
                  id="thuTuUuTien"
                  type="number"
                  value={formData.thuTuUuTien}
                  onChange={(e) =>
                    setFormData({ ...formData, thuTuUuTien: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="hoatDong"
                checked={formData.hoatDong}
                onCheckedChange={(checked) => setFormData({ ...formData, hoatDong: checked })}
              />
              <Label htmlFor="hoatDong">Hoạt động</Label>
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
        description="Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
