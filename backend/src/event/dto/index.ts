import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event title',
    example: 'ADK Flagship Pharmacy Supermarket Grand Opening',
    maxLength: 500,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Free health check, nutrition expert consultation.',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Start date',
    example: '2025-01-15T09:00:00Z',
  })
  @IsDateString({}, { message: 'Start date must be ISO date format' })
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date',
    example: '2025-01-20T18:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be ISO date format' })
  endDate?: string;

  @ApiProperty({
    description: 'Cover image URL',
    example: '/images/events/grand-opening.jpg',
  })
  @IsString({ message: 'Cover image must be a string' })
  @IsNotEmpty({ message: 'Cover image is required' })
  coverImage: string;

  @ApiPropertyOptional({
    description: 'Gallery images array',
    example: ['/images/events/gallery-1.jpg', '/images/events/gallery-2.jpg'],
  })
  @IsOptional()
  @IsArray({ message: 'Gallery must be an array' })
  @IsString({ each: true, message: 'Each image URL must be a string' })
  gallery?: string[];

  @ApiPropertyOptional({
    description: 'Additional content (JSON)',
    example: { highlights: ['Free check-up', 'Nutrition consulting'] },
  })
  @IsOptional()
  @IsObject({ message: 'Content must be a JSON object' })
  content?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Redirect URL when clicking view details button',
    example: 'https://bizmall.vn',
  })
  @IsOptional()
  @IsString({ message: 'Redirect URL phải là chuỗi văn bản hợp lệ' })
  redirectUrl?: string;

  @ApiPropertyOptional({
    description: 'Featured event',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Featured status must be true/false' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Show or hide',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'Visibility must be true/false' })
  isVisible?: boolean;
}

export class UpdateEventDto {
  @ApiPropertyOptional({
    description: 'Event title',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @MaxLength(500, { message: 'Title must not exceed 500 characters' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Event description',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Start date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be ISO date format' })
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be ISO date format' })
  endDate?: string | null;

  @ApiPropertyOptional({
    description: 'Cover image URL',
  })
  @IsOptional()
  @IsString({ message: 'Cover image must be a string' })
  coverImage?: string;

  @ApiPropertyOptional({
    description: 'Gallery images array',
  })
  @IsOptional()
  @IsArray({ message: 'Gallery must be an array' })
  @IsString({ each: true, message: 'Each image URL must be a string' })
  gallery?: string[];

  @ApiPropertyOptional({
    description: 'Additional content (JSON)',
  })
  @IsOptional()
  @IsObject({ message: 'Content must be a JSON object' })
  content?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Redirect URL when clicking view details button',
    example: 'https://bizmall.vn',
  })
  @IsOptional()
  @IsString({ message: 'Redirect URL phải là chuỗi văn bản hợp lệ' })
  redirectUrl?: string;

  @ApiPropertyOptional({
    description: 'Featured event',
  })
  @IsOptional()
  @IsBoolean({ message: 'Featured status must be true/false' })
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Show or hide',
  })
  @IsOptional()
  @IsBoolean({ message: 'Visibility must be true/false' })
  isVisible?: boolean;
}
