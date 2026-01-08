import { IsString, IsNotEmpty, IsOptional, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConfigurationDto {
  @ApiProperty({
    description: 'Configuration key (unique)',
    example: 'site_name',
    maxLength: 100,
  })
  @IsString({ message: 'Key must be a string' })
  @IsNotEmpty({ message: 'Key is required' })
  @MaxLength(100, { message: 'Key must not exceed 100 characters' })
  key: string;

  @ApiProperty({
    description: 'Configuration value (JSON)',
    example: { en: 'ADK Pharmacy', vi: 'Nhà Thuốc ADK' },
  })
  @IsObject({ message: 'Value must be a JSON object' })
  value: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Configuration description',
    example: 'Website display name',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}

export class UpdateConfigurationDto {
  @ApiPropertyOptional({
    description: 'Configuration value (JSON)',
  })
  @IsOptional()
  @IsObject({ message: 'Value must be a JSON object' })
  value?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Configuration description',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}
