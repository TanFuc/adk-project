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

export class CreatePartnershipFaqDto {
  @ApiProperty({
    description: 'Question',
    example: 'How much capital do I need to start?',
  })
  @IsString({ message: 'Question must be a string' })
  @IsNotEmpty({ message: 'Question is required' })
  @MaxLength(500, { message: 'Question must not exceed 500 characters' })
  question: string;

  @ApiProperty({
    description: 'Answer',
    example: 'Flexible investment from 500 million...',
  })
  @IsString({ message: 'Answer must be a string' })
  @IsNotEmpty({ message: 'Answer is required' })
  answer: string;

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

export class UpdatePartnershipFaqDto {
  @ApiPropertyOptional({
    description: 'Question',
  })
  @IsOptional()
  @IsString({ message: 'Question must be a string' })
  @MaxLength(500, { message: 'Question must not exceed 500 characters' })
  question?: string;

  @ApiPropertyOptional({
    description: 'Answer',
  })
  @IsOptional()
  @IsString({ message: 'Answer must be a string' })
  answer?: string;

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
