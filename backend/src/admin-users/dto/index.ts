import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';

export class CreateAdminUserDto {
  @ApiProperty({
    description: 'Login email',
    example: 'admin@adk.vn',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Admin ADK',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiPropertyOptional({
    description: 'Admin role',
    enum: AdminRole,
    default: AdminRole.ADMIN,
  })
  @IsEnum(AdminRole, { message: 'Invalid role' })
  @IsOptional()
  role?: AdminRole;
}

export class UpdateAdminUserDto {
  @ApiPropertyOptional({
    description: 'Full name',
    example: 'Admin ADK Updated',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Login email',
    example: 'newemail@adk.vn',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Admin role',
    enum: AdminRole,
  })
  @IsEnum(AdminRole, { message: 'Invalid role' })
  @IsOptional()
  role?: AdminRole;

  @ApiPropertyOptional({
    description: 'Account active status',
  })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'newPassword123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;
}
