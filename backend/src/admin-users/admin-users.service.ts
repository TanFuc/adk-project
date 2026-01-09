import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { randomBytes, scryptSync } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminUserDto, UpdateAdminUserDto, ResetPasswordDto } from './dto';
import { AdminRole } from '@prisma/client';

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    return user;
  }

  async create(dto: CreateAdminUserDto) {
    const existing = await this.prisma.adminUser.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email is already in use.');
    }

    const hashedPassword = this.hashPassword(dto.password);

    const user = await this.prisma.adminUser.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role || AdminRole.ADMIN,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    this.logger.log(`Admin user created: ${user.email}`);

    return user;
  }

  async update(id: string, dto: UpdateAdminUserDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    // Check if email is being changed and if it's already in use
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.adminUser.findUnique({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException('Email is already in use.');
      }
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data: {
        email: dto.email,
        fullName: dto.fullName,
        role: dto.role,
        isActive: dto.isActive,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });

    this.logger.log(`Admin user updated: ${updated.email}`);

    return updated;
  }

  async resetPassword(id: string, dto: ResetPasswordDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    const hashedPassword = this.hashPassword(dto.newPassword);

    await this.prisma.adminUser.update({
      where: { id },
      data: { password: hashedPassword },
    });

    this.logger.log(`Password reset for admin user: ${user.email}`);

    return { message: 'Password reset successfully.' };
  }

  async delete(id: string, requesterId: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    // Prevent self-deletion
    if (id === requesterId) {
      throw new ForbiddenException('You cannot delete your own account.');
    }

    await this.prisma.adminUser.delete({
      where: { id },
    });

    this.logger.log(`Admin user deleted: ${user.email}`);

    return { message: 'Admin user deleted successfully.' };
  }

  async toggleActive(id: string, requesterId: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Admin user not found.');
    }

    // Prevent self-deactivation
    if (id === requesterId) {
      throw new ForbiddenException('You cannot deactivate your own account.');
    }

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    this.logger.log(
      `Admin user ${updated.isActive ? 'activated' : 'deactivated'}: ${updated.email}`,
    );

    return updated;
  }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }
}
