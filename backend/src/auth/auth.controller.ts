import { Controller, Post, Body, UseGuards, Get, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { SkipThrottle, Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto, CreateAdminDto } from "./dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
    vaiTro: string;
  };
}

@ApiTags("Xác Thực")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 attempts per minute
  @ApiOperation({ summary: "Đăng nhập admin" })
  @ApiResponse({
    status: 200,
    description: "Đăng nhập thành công",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: "Email hoặc mật khẩu không đúng" })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Post("register")
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Tạo tài khoản admin mới (Super Admin only)" })
  @ApiResponse({ status: 201, description: "Tạo tài khoản thành công" })
  async createAdmin(@Body() dto: CreateAdminDto): Promise<{ id: string; email: string }> {
    return this.authService.createAdmin(dto);
  }

  @Get("me")
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Lấy thông tin tài khoản hiện tại" })
  async getMe(@Request() req: AuthenticatedRequest): Promise<{ email: string; vaiTro: string }> {
    return {
      email: req.user.email,
      vaiTro: req.user.vaiTro,
    };
  }
}
