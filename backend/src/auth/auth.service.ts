import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, LoginResponseDto, CreateAdminDto } from './dto';
import { VaiTro } from '@prisma/client';

interface JwtPayload {
  sub: string;
  email: string;
  vaiTro: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.jwtSecret = this.config.get<string>('JWT_SECRET') || 'adk-secret-key-2024';
    this.jwtExpiresIn = this.config.get<number>('JWT_EXPIRES_IN') || 86400; // 24 hours
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const admin = await this.prisma.quanTriVien.findUnique({
      where: { email: dto.email },
    });

    if (!admin) {
      this.logger.warn(`Login failed - email not found: ${dto.email}`);
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    if (!admin.hoatDong) {
      this.logger.warn(`Login failed - account disabled: ${dto.email}`);
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa.');
    }

    const isValid = this.verifyPassword(dto.matKhau, admin.matKhau);
    if (!isValid) {
      this.logger.warn(`Login failed - wrong password: ${dto.email}`);
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng.');
    }

    const token = this.generateToken({
      sub: admin.id,
      email: admin.email,
      vaiTro: admin.vaiTro,
    });

    this.logger.log(`Login successful: ${admin.email}`);

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: this.jwtExpiresIn,
      admin: {
        id: admin.id,
        email: admin.email,
        hoTen: admin.hoTen,
        vaiTro: admin.vaiTro,
      },
    };
  }

  async createAdmin(dto: CreateAdminDto): Promise<{ id: string; email: string }> {
    const existing = await this.prisma.quanTriVien.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email đã được sử dụng.');
    }

    const hashedPassword = this.hashPassword(dto.matKhau);

    const admin = await this.prisma.quanTriVien.create({
      data: {
        email: dto.email,
        matKhau: hashedPassword,
        hoTen: dto.hoTen,
        vaiTro: VaiTro.ADMIN,
      },
      select: { id: true, email: true },
    });

    this.logger.log(`Admin created: ${admin.email}`);

    return admin;
  }

  async validateToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = this.verifyToken(token);

      // Check if admin still exists and is active
      const admin = await this.prisma.quanTriVien.findUnique({
        where: { id: payload.sub },
        select: { id: true, hoatDong: true },
      });

      if (!admin || !admin.hoatDong) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    const hashBuffer = Buffer.from(hash, 'hex');
    const suppliedBuffer = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuffer, suppliedBuffer);
  }

  private generateToken(payload: { sub: string; email: string; vaiTro: string }): string {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'HS256', typ: 'JWT' };

    const tokenPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: now + this.jwtExpiresIn,
    };

    const headerBase64 = this.base64UrlEncode(JSON.stringify(header));
    const payloadBase64 = this.base64UrlEncode(JSON.stringify(tokenPayload));
    const signature = this.sign(`${headerBase64}.${payloadBase64}`);

    return `${headerBase64}.${payloadBase64}.${signature}`;
  }

  private verifyToken(token: string): JwtPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [headerBase64, payloadBase64, signature] = parts;
    const expectedSignature = this.sign(`${headerBase64}.${payloadBase64}`);

    if (signature !== expectedSignature) {
      throw new Error('Invalid token signature');
    }

    const payload = JSON.parse(this.base64UrlDecode(payloadBase64)) as JwtPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  }

  private sign(data: string): string {
    const hmac = createHash('sha256');
    hmac.update(data + this.jwtSecret);
    return this.base64UrlEncode(hmac.digest());
  }

  private base64UrlEncode(data: string | Buffer): string {
    const str = typeof data === 'string' ? Buffer.from(data) : data;
    return str.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private base64UrlDecode(data: string): string {
    const padded = data + '='.repeat((4 - data.length % 4) % 4);
    return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
  }
}
