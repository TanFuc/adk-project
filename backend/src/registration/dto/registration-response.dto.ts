import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RegistrationStatus } from '@prisma/client';

export class RegistrationResponseDto {
  @ApiProperty({ description: 'Registration ID' })
  id: string;

  @ApiProperty({ description: 'Result message' })
  message: string;

  @ApiPropertyOptional({ description: 'Redirect URL after registration' })
  redirectUrl?: string;
}

export class RegistrationDetailDto {
  @ApiProperty({ description: 'Registration ID' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiProperty({ description: 'Phone number (masked for display)' })
  phone: string;

  @ApiProperty({ description: 'Province/City' })
  province: string;

  @ApiProperty({ description: 'District' })
  district: string;

  @ApiPropertyOptional({ description: 'Detailed address' })
  address?: string;

  @ApiProperty({ enum: RegistrationStatus, description: 'Registration status' })
  status: RegistrationStatus;

  @ApiProperty({ description: 'Registration source' })
  source: string;

  @ApiProperty({ description: 'Created date' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated date' })
  updatedAt: Date;
}

export class UpdateStatusDto {
  @ApiProperty({
    enum: RegistrationStatus,
    description: 'New status',
    example: 'CONTACTED',
  })
  status: RegistrationStatus;
}

export class RegistrationStatsDto {
  @ApiProperty({ description: 'Total registrations' })
  total: number;

  @ApiProperty({ description: 'Pending count' })
  pending: number;

  @ApiProperty({ description: 'Contacted count' })
  contacted: number;

  @ApiProperty({ description: 'Success count' })
  success: number;

  @ApiProperty({ description: 'Rejected count' })
  rejected: number;
}
