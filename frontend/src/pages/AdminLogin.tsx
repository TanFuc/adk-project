import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  matKhau: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      matKhau: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(values);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("admin", JSON.stringify(response.admin));

      toast({
        title: "Đăng nhập thành công",
        description: `Xin chào, ${response.admin.hoTen}!`,
        variant: "success",
      });

      navigate("/admin");
    } catch (error) {
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };
      toast({
        title: "Đăng nhập thất bại",
        description: apiError.response?.data?.error?.message || "Email hoặc mật khẩu không đúng",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-adk-green/10 mb-4">
              <img
                src="/logo.png"
                alt="ADK Logo"
                className="w-12 h-12 object-contain rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Đăng nhập để quản lý hệ thống</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@adk.vn"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matKhau">Mật khẩu</Label>
              <Input
                id="matKhau"
                type="password"
                placeholder="••••••••"
                {...register("matKhau")}
                className={errors.matKhau ? "border-red-500" : ""}
              />
              {errors.matKhau && <p className="text-sm text-red-500">{errors.matKhau.message}</p>}
            </div>

            <Button type="submit" variant="adk" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          {/* Back to home link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-600 hover:text-adk-green transition-colors">
              Quay về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
