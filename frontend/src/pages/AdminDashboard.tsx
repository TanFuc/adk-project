import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  FileText,
  Settings,
  LogOut,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Image,
  Calendar,
  Briefcase,
  HelpCircle,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api";
import type { DangKyDetail, DangKyStats, TrangThai } from "@/types";
import { getProvinceLabel, getDistrictLabel } from "@/data/locations";
import {
  SectionsTab,
  BannersTab,
  EventsTab,
  BusinessModelsTab,
  FAQTab,
  SettingsTab,
} from "@/components/admin/tabs";

const STATUS_LABELS: Record<TrangThai, { label: string; color: string }> = {
  CHO_XU_LY: { label: "Cho xu ly", color: "bg-yellow-100 text-yellow-800" },
  DA_LIEN_HE: { label: "Da lien he", color: "bg-blue-100 text-blue-800" },
  THANH_CONG: { label: "Thanh cong", color: "bg-green-100 text-green-800" },
  TU_CHOI: { label: "Tu choi", color: "bg-red-100 text-red-800" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<TrangThai | "all">("all");

  // Get admin info from localStorage
  const adminInfo = JSON.parse(localStorage.getItem("admin") || "{}");

  // Fetch stats
  const { data: stats } = useQuery<DangKyStats>({
    queryKey: ["registrationStats"],
    queryFn: () => adminApi.getRegistrationStats(),
  });

  // Fetch registrations
  const { data: registrationsData, isLoading } = useQuery({
    queryKey: ["registrations", statusFilter],
    queryFn: () =>
      adminApi.getRegistrations(1, 100, statusFilter === "all" ? undefined : statusFilter),
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, trangThai }: { id: string; trangThai: TrangThai }) =>
      adminApi.updateRegistrationStatus(id, trangThai),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["registrationStats"] });
      toast({
        title: "Cap nhat thanh cong",
        description: "Trang thai dang ky da duoc cap nhat.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Cap nhat that bai",
        description: "Da xay ra loi. Vui long thu lai.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-full py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-adk-green/10 flex items-center justify-center">
              <img src="/logo.png" alt="ADK Logo" className="w-8 h-8 object-contain rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Nha Thuoc ADK</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Xin chao, <strong>{adminInfo.hoTen}</strong>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Dang xuat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-full py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tong dang ky</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cho xu ly</p>
                <p className="text-2xl font-bold">{stats?.choXuLy || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Thanh cong</p>
                <p className="text-2xl font-bold">{stats?.thanhCong || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tu choi</p>
                <p className="text-2xl font-bold">{stats?.tuChoi || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="registrations" className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Dang ky
            </TabsTrigger>
            <TabsTrigger value="sections" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Phan muc
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Banner
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Su kien
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Mo hinh KD
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Hoi dap
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Cau hinh
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <div className="bg-white rounded-xl shadow-sm border">
              {/* Filter Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sach dang ky</h2>
                <div className="flex items-center gap-4">
                  <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as TrangThai | "all")}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Loc trang thai" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tat ca</SelectItem>
                      <SelectItem value="CHO_XU_LY">Cho xu ly</SelectItem>
                      <SelectItem value="DA_LIEN_HE">Da lien he</SelectItem>
                      <SelectItem value="THANH_CONG">Thanh cong</SelectItem>
                      <SelectItem value="TU_CHOI">Tu choi</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["registrations"],
                      })
                    }
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Ho ten
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">SDT</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Dia chi
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Ngay dang ky
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Trang thai
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Thao tac
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {isLoading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Dang tai...
                        </td>
                      </tr>
                    ) : registrationsData?.data.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                          Khong co du lieu
                        </td>
                      </tr>
                    ) : (
                      registrationsData?.data.map((reg: DangKyDetail) => (
                        <tr key={reg.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{reg.hoTen}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              {reg.soDienThoai}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {getDistrictLabel(reg.tinhThanh, reg.quanHuyen)},{" "}
                            {getProvinceLabel(reg.tinhThanh)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {formatDate(reg.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                STATUS_LABELS[reg.trangThai].color
                              }`}
                            >
                              {STATUS_LABELS[reg.trangThai].label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Select
                              value={reg.trangThai}
                              onValueChange={(value) =>
                                updateStatusMutation.mutate({
                                  id: reg.id,
                                  trangThai: value as TrangThai,
                                })
                              }
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CHO_XU_LY">Cho xu ly</SelectItem>
                                <SelectItem value="DA_LIEN_HE">Da lien he</SelectItem>
                                <SelectItem value="THANH_CONG">Thanh cong</SelectItem>
                                <SelectItem value="TU_CHOI">Tu choi</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections">
            <SectionsTab />
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners">
            <BannersTab />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <EventsTab />
          </TabsContent>

          {/* Business Models Tab */}
          <TabsContent value="business">
            <BusinessModelsTab />
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <FAQTab />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
