import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  Min,
  MaxLength,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePhotoCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Cửa Hàng',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'URL-friendly slug',
    example: 'cua-hang',
  })
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  @MaxLength(100, { message: 'Slug must not exceed 100 characters' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase with hyphens only (e.g., cua-hang)',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 0,
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

export class UpdatePhotoCategoryDto {
  @ApiPropertyOptional({
    description: 'Category name',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'URL-friendly slug',
  })
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  @MaxLength(100, { message: 'Slug must not exceed 100 characters' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase with hyphens only (e.g., cua-hang)',
  })
  slug?: string;

  @ApiPropertyOptional({
    description: 'Display order',
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

export class ReorderItemDto {
  @ApiProperty({ description: 'Category ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'New order' })
  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderDto {
  @ApiProperty({ type: [ReorderItemDto], description: 'List of categories to reorder' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
