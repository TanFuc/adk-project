import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBusinessModelDto {
  @ApiProperty({
    description: 'Business model name',
    example: 'Diverse Revenue Streams',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(200, { message: 'Name must not exceed 200 characters' })
  name: string;

  @ApiProperty({
    description: 'Detailed description',
    example: 'Optimize profits from GPP pharmacy and health food...',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiPropertyOptional({
    description: 'Icon URL',
    example: '/icons/business-model-1.svg',
  })
  @IsOptional()
  @IsString({ message: 'Icon URL must be a string' })
  iconUrl?: string;

  @ApiPropertyOptional({
    description: 'Profit potential description',
    example: '25-40% profit margin',
  })
  @IsOptional()
  @IsString({ message: 'Profit potential must be a string' })
  profitPotential?: string;

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

export class UpdateBusinessModelDto {
  @ApiPropertyOptional({
    description: 'Business model name',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(200, { message: 'Name must not exceed 200 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Detailed description',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Icon URL',
  })
  @IsOptional()
  @IsString({ message: 'Icon URL must be a string' })
  iconUrl?: string | null;

  @ApiPropertyOptional({
    description: 'Profit potential description',
  })
  @IsOptional()
  @IsString({ message: 'Profit potential must be a string' })
  profitPotential?: string | null;

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
  @ApiProperty({ description: 'Item ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'New order' })
  @IsInt()
  @Min(0)
  sortOrder: number;
}

export class ReorderDto {
  @ApiProperty({ type: [ReorderItemDto], description: 'List of items to reorder' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
