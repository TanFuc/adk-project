import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";

interface Configuration {
  id: string;
  key: string;
  value: any;
  description?: string;
}

export default function ConfigurationAdminPage() {
  const [registerUrl, setRegisterUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const queryClient = useQueryClient();

  // Fetch all configurations
  const { data: configs, isLoading } = useQuery<Configuration[]>({
    queryKey: ["admin-configurations"],
    queryFn: async () => {
      // You need to implement admin login first to get token
      const token = localStorage.getItem("admin_token");
      const response = await api.get("/configuration/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Find primary_register_url config
  const primaryRegisterConfig = configs?.find((c) => c.key === "primary_register_url");

  // Set initial value when loaded
  useState(() => {
    if (primaryRegisterConfig) {
      setRegisterUrl(primaryRegisterConfig.value.url || "");
    }
  });

  // Update configuration mutation
  const updateConfig = useMutation({
    mutationFn: async (newUrl: string) => {
      const token = localStorage.getItem("admin_token");
      const response = await api.patch(
        "/configuration/admin/primary_register_url",
        {
          value: { url: newUrl },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setSaveMessage({ type: "success", text: "URL đã được cập nhật thành công!" });
      queryClient.invalidateQueries({ queryKey: ["admin-configurations"] });
      queryClient.invalidateQueries({ queryKey: ["configuration"] });
      setTimeout(() => setSaveMessage(null), 5000);
    },
    onError: (error: any) => {
      setSaveMessage({
        type: "error",
        text: error.response?.data?.message || "Lỗi khi cập nhật URL",
      });
      setTimeout(() => setSaveMessage(null), 5000);
    },
  });

  const handleSave = async () => {
    if (!registerUrl.trim()) {
      setSaveMessage({ type: "error", text: "URL không được để trống" });
      return;
    }

    try {
      new URL(registerUrl);
    } catch {
      setSaveMessage({ type: "error", text: "URL không hợp lệ. Vui lòng nhập URL đầy đủ (bắt đầu bằng http:// hoặc https://)" });
      return;
    }

    setIsSaving(true);
    await updateConfig.mutateAsync(registerUrl);
    setIsSaving(false);
  };

  const handleTestUrl = () => {
    if (registerUrl) {
      window.open(registerUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-adk-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cấu hình hệ thống</h1>
          <p className="text-gray-600 mt-2">
            Quản lý các thiết lập toàn cục của website
          </p>
        </div>

        <Tabs defaultValue="register-url" className="space-y-6">
          <TabsList>
            <TabsTrigger value="register-url">URL Đăng Ký Hợp Tác</TabsTrigger>
            <TabsTrigger value="all-configs">Tất cả cấu hình</TabsTrigger>
          </TabsList>

          <TabsContent value="register-url" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>URL Đăng Ký Hợp Tác</CardTitle>
                <CardDescription>
                  URL này sẽ được sử dụng cho TẤT CẢ các nút "Đăng Ký Hợp Tác" trên toàn bộ website.
                  Thay đổi ở đây sẽ tự động áp dụng cho mọi nơi.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {saveMessage && (
                  <Alert variant={saveMessage.type === "success" ? "default" : "destructive"}>
                    {saveMessage.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>{saveMessage.text}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="register-url">URL chuyển hướng</Label>
                  <div className="flex gap-2">
                    <Input
                      id="register-url"
                      type="url"
                      placeholder="https://bizmall.vn"
                      value={registerUrl}
                      onChange={(e) => setRegisterUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleTestUrl}
                      disabled={!registerUrl}
                      title="Kiểm tra URL"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    URL phải bắt đầu bằng http:// hoặc https://
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    📍 Các vị trí sử dụng URL này:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Navbar - Nút đăng ký (Desktop & Mobile)</li>
                    <li>Hero Section - Nút CTA chính</li>
                    <li>Landing Page - Hero banner</li>
                    <li>Footer - Nút đăng ký hợp tác</li>
                    <li>Events Page - Nút đăng ký</li>
                    <li>Concept Page - Nút tìm hiểu thêm & đăng ký</li>
                    <li>Popup Banner - Chuyển hướng</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !registerUrl}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (primaryRegisterConfig) {
                        setRegisterUrl(primaryRegisterConfig.value.url || "");
                        setSaveMessage(null);
                      }
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Khôi phục
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-configs" className="space-y-4">
            {configs?.map((config) => (
              <Card key={config.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{config.key}</CardTitle>
                  {config.description && (
                    <CardDescription>{config.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(config.value, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
