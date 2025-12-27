import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { publicApi } from '@/services/api';
import { PROVINCES, getDistrictsByProvince } from '@/data/locations';
import type { District } from '@/types';

const formSchema = z.object({
  hoTen: z
    .string()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được quá 100 ký tự'),
  soDienThoai: z
    .string()
    .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không đúng định dạng'),
  tinhThanh: z.string().min(1, 'Vui lòng chọn Tỉnh/Thành phố'),
  quanHuyen: z.string().min(1, 'Vui lòng chọn Quận/Huyện'),
  diaChi: z.string().max(500, 'Địa chỉ không được quá 500 ký tự').optional(),
  dongYDieuKhoan: z.boolean().refine((v) => v === true, {
    message: 'Vui lòng đồng ý với điều khoản để tiếp tục',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DangKyForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hoTen: '',
      soDienThoai: '',
      tinhThanh: '',
      quanHuyen: '',
      diaChi: '',
      dongYDieuKhoan: false,
    },
  });

  const selectedProvince = watch('tinhThanh');

  // Update districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const newDistricts = getDistrictsByProvince(selectedProvince);
      setDistricts(newDistricts);
      setValue('quanHuyen', ''); // Reset district selection
    } else {
      setDistricts([]);
    }
  }, [selectedProvince, setValue]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { dongYDieuKhoan, ...data } = values;
      const response = await publicApi.createDangKy(data);

      setIsSuccess(true);
      toast({
        title: 'Đăng ký thành công!',
        description: response.message,
        variant: 'success',
      });

      // Track analytics if available
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as Window & { gtag: (cmd: string, event: string, params: Record<string, string>) => void }).gtag('event', 'dang_ky_thanh_cong', {
          event_category: 'conversion',
        });
      }

      // Redirect after 2 seconds if URL provided
      if (response.redirectUrl) {
        setTimeout(() => {
          window.open(response.redirectUrl, '_blank');
        }, 2000);
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 3000);
    } catch (error) {
      const apiError = error as { response?: { data?: { error?: { message?: string } } } };
      toast({
        title: 'Đăng ký thất bại',
        description: apiError.response?.data?.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-adk-green mb-4" />
        </motion.div>
        <h3 className="text-2xl font-bold text-adk-green mb-2">
          Đăng ký thành công!
        </h3>
        <p className="text-gray-600">
          Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ sớm nhất.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      {/* Họ và Tên */}
      <div className="space-y-2">
        <Label htmlFor="hoTen">
          Họ và Tên <span className="text-red-500">*</span>
        </Label>
        <Input
          id="hoTen"
          placeholder="Nhập họ và tên của bạn"
          {...register('hoTen')}
          className={errors.hoTen ? 'border-red-500' : ''}
        />
        {errors.hoTen && (
          <p className="text-sm text-red-500">{errors.hoTen.message}</p>
        )}
      </div>

      {/* Số Điện Thoại */}
      <div className="space-y-2">
        <Label htmlFor="soDienThoai">
          Số Điện Thoại <span className="text-red-500">*</span>
        </Label>
        <Input
          id="soDienThoai"
          type="tel"
          placeholder="0901234567"
          {...register('soDienThoai')}
          className={errors.soDienThoai ? 'border-red-500' : ''}
        />
        {errors.soDienThoai && (
          <p className="text-sm text-red-500">{errors.soDienThoai.message}</p>
        )}
      </div>

      {/* Tỉnh/Thành phố */}
      <div className="space-y-2">
        <Label htmlFor="tinhThanh">
          Tỉnh/Thành phố <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue('tinhThanh', value)}
          value={watch('tinhThanh')}
        >
          <SelectTrigger className={errors.tinhThanh ? 'border-red-500' : ''}>
            <SelectValue placeholder="Chọn Tỉnh/Thành phố" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((province) => (
              <SelectItem key={province.value} value={province.value}>
                {province.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tinhThanh && (
          <p className="text-sm text-red-500">{errors.tinhThanh.message}</p>
        )}
      </div>

      {/* Quận/Huyện */}
      <div className="space-y-2">
        <Label htmlFor="quanHuyen">
          Quận/Huyện <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={(value) => setValue('quanHuyen', value)}
          value={watch('quanHuyen')}
          disabled={!selectedProvince}
        >
          <SelectTrigger className={errors.quanHuyen ? 'border-red-500' : ''}>
            <SelectValue placeholder={selectedProvince ? 'Chọn Quận/Huyện' : 'Vui lòng chọn Tỉnh/Thành phố trước'} />
          </SelectTrigger>
          <SelectContent>
            {districts.map((district) => (
              <SelectItem key={district.value} value={district.value}>
                {district.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.quanHuyen && (
          <p className="text-sm text-red-500">{errors.quanHuyen.message}</p>
        )}
      </div>

      {/* Địa chỉ chi tiết */}
      <div className="space-y-2">
        <Label htmlFor="diaChi">Địa chỉ chi tiết (không bắt buộc)</Label>
        <Input
          id="diaChi"
          placeholder="Số nhà, đường, phường/xã..."
          {...register('diaChi')}
          className={errors.diaChi ? 'border-red-500' : ''}
        />
        {errors.diaChi && (
          <p className="text-sm text-red-500">{errors.diaChi.message}</p>
        )}
      </div>

      {/* Điều khoản */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="dongYDieuKhoan"
          checked={watch('dongYDieuKhoan')}
          onCheckedChange={(checked) =>
            setValue('dongYDieuKhoan', checked === true)
          }
          className={errors.dongYDieuKhoan ? 'border-red-500' : ''}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="dongYDieuKhoan"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Tôi đồng ý với{' '}
            <a href="#" className="text-adk-green hover:underline">
              điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-adk-green hover:underline">
              chính sách bảo mật
            </a>
          </label>
          {errors.dongYDieuKhoan && (
            <p className="text-sm text-red-500">
              {errors.dongYDieuKhoan.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="adk"
        size="xl"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang gửi...
          </>
        ) : (
          'Đăng Ký Ngay'
        )}
      </Button>
    </motion.form>
  );
}
