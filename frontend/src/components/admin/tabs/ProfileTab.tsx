import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, Lock, Mail, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { authApi } from "@/services/api";

export function ProfileTab() {
  const { toast } = useToast();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Get admin info from localStorage
  const adminStr = localStorage.getItem("admin");
  const admin = adminStr ? JSON.parse(adminStr) : null;

  const [profileData, setProfileData] = useState({
    fullName: admin?.fullName || "",
    email: admin?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { fullName?: string; email?: string }) =>
      authApi.updateProfile(data),
    onSuccess: (updatedData) => {
      // Update localStorage
      const currentAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
      const newAdmin = { ...currentAdmin, ...updatedData };
      localStorage.setItem("admin", JSON.stringify(newAdmin));

      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin tài khoản",
        variant: "success",
      });
      setIsProfileModalOpen(false);
      
      // Reload page to update UI
      setTimeout(() => window.location.reload(), 500);
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.changePassword(data),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã đổi mật khẩu thành công",
        variant: "success",
      });
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể đổi mật khẩu",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProfile = () => {
    if (!profileData.fullName || !profileData.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    const changes: { fullName?: string; email?: string } = {};
    if (profileData.fullName !== admin?.fullName) {
      changes.fullName = profileData.fullName;
    }
    if (profileData.email !== admin?.email) {
      changes.email = profileData.email;
    }

    if (Object.keys(changes).length === 0) {
      toast({
        title: "Thông báo",
        description: "Không có thay đổi nào",
        variant: "default",
      });
      return;
    }

    updateProfileMutation.mutate(changes);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới phải có ít nhất 6 ký tự",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const openProfileModal = () => {
    setProfileData({
      fullName: admin?.fullName || "",
      email: admin?.email || "",
    });
    setIsProfileModalOpen(true);
  };

  const openPasswordModal = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Profile Information Card */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold">Thông tin Tài khoản</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Họ và tên</p>
              <p className="font-medium">{admin?.fullName || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email đăng nhập</p>
              <p className="font-medium">{admin?.email || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <UserCircle className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Vai trò</p>
              <p className="font-medium">
                {admin?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
              </p>
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button onClick={openProfileModal} className="flex-1">
              <User className="w-4 h-4 mr-2" />
              Cập nhật Thông tin
            </Button>
            <Button onClick={openPasswordModal} variant="outline" className="flex-1">
              <Lock className="w-4 h-4 mr-2" />
              Đổi Mật khẩu
            </Button>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cập nhật Thông tin Tài khoản</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Họ và tên *</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                placeholder="Nhập họ và tên"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email đăng nhập *</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                placeholder="admin@adk.vn"
              />
              <p className="text-xs text-gray-500">
                Lưu ý: Thay đổi email sẽ yêu cầu đăng nhập lại với email mới
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleUpdateProfile}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Đổi Mật khẩu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Mật khẩu mới *</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Mật khẩu mới phải có ít nhất 6 ký tự và khác với mật khẩu hiện tại.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending ? "Đang đổi..." : "Đổi Mật khẩu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
