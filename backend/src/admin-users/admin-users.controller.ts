import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto, UpdateAdminUserDto, ResetPasswordDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@ApiTags('Admin Users Management')
@Controller('admin-users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@SkipThrottle()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all admin users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin users list' })
  async findAll() {
    return this.adminUsersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin user details' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  async findOne(@Param('id') id: string) {
    return this.adminUsersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new admin user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin user created' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async create(@Body() dto: CreateAdminUserDto) {
    return this.adminUsersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update admin user (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin user updated' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async update(@Param('id') id: string, @Body() dto: UpdateAdminUserDto) {
    return this.adminUsersService.update(id, dto);
  }

  @Patch(':id/reset-password')
  @ApiOperation({ summary: 'Reset admin user password (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  async resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.adminUsersService.resetPassword(id, dto);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Toggle admin user active status (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Status toggled' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  @ApiResponse({ status: 403, description: 'Cannot deactivate own account' })
  async toggleActive(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminUsersService.toggleActive(id, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete admin user (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin user deleted' })
  @ApiResponse({ status: 404, description: 'Admin user not found' })
  @ApiResponse({ status: 403, description: 'Cannot delete own account' })
  async delete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.adminUsersService.delete(id, req.user.sub);
  }
}
