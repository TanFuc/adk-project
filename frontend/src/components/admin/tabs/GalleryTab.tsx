import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, Image } from "lucide-react";
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
import type { Photo, PhotoCategory } from "@/types";

export function GalleryTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Photo | null>(null);
  const [deleteItem, setDeleteItem] = useState<Photo | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    categoryId: "",
    sortOrder: 0,
    isVisible: true,
  });

  const { data: photos = [], isLoading } = useQuery({
    queryKey: ["adminPhotos"],
    queryFn: () => adminApi.getAllPhotos(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["adminPhotoCategories"],
    queryFn: () => adminApi.getAllPhotoCategories(),
  });

  const filteredPhotos = filterCategory === "all"
    ? photos
    : photos.filter((photo) => photo.categoryId === filterCategory);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Photo>) => adminApi.createPhoto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["adminPhotoCategories"] });
      toast({ title: "Thanh cong", description: "Da them hinh anh moi", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Loi", description: "Khong the them hinh anh", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Photo> }) =>
      adminApi.updatePhoto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast({ title: "Thanh cong", description: "Da cap nhat hinh anh", variant: "success" });
      closeModal();
    },
    onError: () => {
      toast({ title: "Loi", description: "Khong the cap nhat hinh anh", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deletePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      queryClient.invalidateQueries({ queryKey: ["adminPhotoCategories"] });
      toast({ title: "Thanh cong", description: "Da xoa hinh anh", variant: "success" });
      setDeleteItem(null);
    },
    onError: () => {
      toast({ title: "Loi", description: "Khong the xoa hinh anh", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => adminApi.togglePhoto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPhotos"] });
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      toast({ title: "Thanh cong", description: "Da cap nhat trang thai", variant: "success" });
    },
    onError: () => {
      toast({ title: "Loi", description: "Khong the cap nhat trang thai", variant: "destructive" });
    },
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      categoryId: categories[0]?.id || "",
      sortOrder: photos.length,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Photo) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
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
    if (!formData.title || !formData.imageUrl || !formData.categoryId) {
      toast({ title: "Loi", description: "Vui long dien day du thong tin bat buoc", variant: "destructive" });
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
          <Image className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Quan ly Thu vien Anh</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Loc theo danh muc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tat ca danh muc</SelectItem>
              {categories.map((cat: PhotoCategory) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["adminPhotos"] })}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={openCreateModal} disabled={categories.length === 0}>
            <Plus className="w-4 h-4 mr-2" />
            Them moi
          </Button>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <p className="text-yellow-800 text-sm">
            Vui long tao it nhat mot danh muc truoc khi them hinh anh.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Hinh anh</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tieu de</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Danh muc</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thu tu</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trang thai</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thao tac</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Dang tai...
                </td>
              </tr>
            ) : filteredPhotos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Chua co hinh anh nao
                </td>
              </tr>
            ) : (
              filteredPhotos.map((photo) => (
                <tr key={photo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-20 h-14 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{photo.title}</p>
                      {photo.description && (
                        <p className="text-sm text-gray-500 truncate max-w-[200px]">
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {photo.category?.name || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{photo.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={photo.isVisible}
                        onCheckedChange={() => toggleMutation.mutate(photo.id)}
                      />
                      {photo.isVisible ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(photo)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteItem(photo)}>
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
            <DialogTitle>{editingItem ? "Chinh sua Hinh anh" : "Them Hinh anh moi"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tieu de *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Cua hang ADK Quan 1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mo ta</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mo ta ngan ve hinh anh..."
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL Hinh anh *</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded mt-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Danh muc *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chon danh muc" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: PhotoCategory) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sortOrder">Thu tu hien thi</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isVisible"
                  checked={formData.isVisible}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                />
                <Label htmlFor="isVisible">Hien thi</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Huy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Dang luu..." : "Luu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Xac nhan xoa"
        description="Ban co chac chan muon xoa hinh anh nay? Hanh dong nay khong the hoan tac."
        confirmText="Xoa"
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
