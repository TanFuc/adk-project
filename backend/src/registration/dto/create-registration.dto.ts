import { IsString, IsNotEmpty, Matches, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistrationDto {
  @ApiProperty({
    description: 'Customer full name',
    example: 'Nguyen Van A',
    minLength: 2,
    maxLength: 100,
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  fullName: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '0901234567',
  })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: 'Invalid phone format (e.g., 0901234567 or +84901234567)',
  })
  phone: string;

  @ApiProperty({
    description: 'Province/City',
    example: 'Ho Chi Minh City',
  })
  @IsString({ message: 'Province must be a string' })
  @IsNotEmpty({ message: 'Province is required' })
  @MaxLength(100, { message: 'Province must not exceed 100 characters' })
  province: string;

  @ApiProperty({
    description: 'District',
    example: 'District 1',
  })
  @IsString({ message: 'District must be a string' })
  @IsNotEmpty({ message: 'District is required' })
  @MaxLength(100, { message: 'District must not exceed 100 characters' })
  district: string;

  @ApiPropertyOptional({
    description: 'Detailed address (house number, street, ward)',
    example: '123 Nguyen Hue, Ben Nghe Ward',
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(500, { message: 'Address must not exceed 500 characters' })
  address?: string;
}
