import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackClickDto {
  @ApiProperty({ example: 'register_partnership', description: 'Tên button được click' })
  @IsString()
  buttonName: string;

  @ApiPropertyOptional({ example: 'https://example.com/page', description: 'URL trang hiện tại' })
  @IsOptional()
  @IsString()
  pageUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/register',
    description: 'URL đích mà button chuyển hướng tới',
  })
  @IsOptional()
  @IsString()
  redirectUrl?: string;

  @ApiPropertyOptional({ description: 'Referrer URL (nguồn)' })
  @IsOptional()
  @IsString()
  referrer?: string;
}
