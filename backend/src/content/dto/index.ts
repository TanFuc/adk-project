import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
  IsObject,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentType } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({
    enum: ContentType,
    description: 'Content type',
    example: 'HERO',
  })
  @IsEnum(ContentType, { message: 'Invalid content type' })
  type: ContentType;

  @ApiProperty({
    description: 'Content title',
    example: 'Welcome to ADK Pharmacy',
    maxLength: 500,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title: string;

  @ApiPropertyOptional({
    description: 'Short description',
    example: 'Leading trusted pharmacy in Vietnam',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Detailed content (flexible JSON)',
    example: { image: '/hero.jpg', buttonText: 'Register Now' },
  })
  @IsObject({ message: 'Content must be a JSON object' })
  content: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Sort order must be an integer' })
  @Min(0, { message: 'Sort order cannot be negative' })
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Show or hide',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Visibility must be true/false' })
  isVisible?: boolean;
}

export class UpdateContentDto {
  @ApiPropertyOptional({
    description: 'Content title',
    example: 'Welcome to ADK Pharmacy',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Short description',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Detailed content (flexible JSON)',
  })
  @IsOptional()
  @IsObject({ message: 'Content must be a JSON object' })
  content?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Display order',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Sort order must be an integer' })
  @Min(0, { message: 'Sort order cannot be negative' })
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Show or hide',
  })
  @IsOptional()
  @IsBoolean({ message: 'Visibility must be true/false' })
  isVisible?: boolean;
}
