import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsUrl,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBannerPopupDto {
  @ApiProperty({
    description: 'Banner image URL',
    example: '/images/popup-event.jpg',
  })
  @IsString({ message: 'Image URL must be a string' })
  @IsNotEmpty({ message: 'Image URL is required' })
  imageUrl: string;

  @ApiProperty({
    description: 'Redirect URL on click',
    example: 'https://bizmall.vn',
  })
  @IsUrl({}, { message: 'Redirect URL must be a valid URL' })
  @IsNotEmpty({ message: 'Redirect URL is required' })
  redirectUrl: string;

  @ApiPropertyOptional({
    description: 'Active status',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Active status must be true/false' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Display delay in milliseconds',
    example: 3000,
    minimum: 0,
    maximum: 30000,
  })
  @IsOptional()
  @IsInt({ message: 'Display delay must be an integer' })
  @Min(0, { message: 'Display delay cannot be negative' })
  @Max(30000, { message: 'Display delay cannot exceed 30 seconds' })
  displayDelay?: number;

  @ApiPropertyOptional({
    description: 'Priority order (lower = higher priority)',
    example: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Priority must be an integer' })
  @Min(0, { message: 'Priority cannot be negative' })
  priority?: number;
}

export class UpdateBannerPopupDto {
  @ApiPropertyOptional({
    description: 'Banner image URL',
  })
  @IsOptional()
  @IsString({ message: 'Image URL must be a string' })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Redirect URL on click',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Redirect URL must be a valid URL' })
  redirectUrl?: string;

  @ApiPropertyOptional({
    description: 'Active status',
  })
  @IsOptional()
  @IsBoolean({ message: 'Active status must be true/false' })
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Display delay in milliseconds',
  })
  @IsOptional()
  @IsInt({ message: 'Display delay must be an integer' })
  @Min(0, { message: 'Display delay cannot be negative' })
  @Max(30000, { message: 'Display delay cannot exceed 30 seconds' })
  displayDelay?: number;

  @ApiPropertyOptional({
    description: 'Priority order',
  })
  @IsOptional()
  @IsInt({ message: 'Priority must be an integer' })
  @Min(0, { message: 'Priority cannot be negative' })
  priority?: number;
}
