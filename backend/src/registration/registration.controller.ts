import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { RegistrationStatus } from '@prisma/client';
import { RegistrationService } from './registration.service';
import {
  CreateRegistrationDto,
  RegistrationResponseDto,
  RegistrationDetailDto,
  UpdateStatusDto,
  RegistrationStatsDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Registration')
@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute for registration
  @ApiOperation({ summary: 'Create new registration from landing page' })
  @ApiResponse({
    status: 201,
    description: 'Registration successful',
    type: RegistrationResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Already registered in last 24h' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async create(@Body() dto: CreateRegistrationDto): Promise<RegistrationResponseDto> {
    return this.registrationService.create(dto);
  }

  // Admin endpoints
  @Get('admin')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get registration list (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: RegistrationStatus })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: RegistrationStatus,
  ): Promise<{ data: RegistrationDetailDto[]; total: number; pages: number }> {
    return this.registrationService.findAll(page, limit, status);
  }

  @Get('admin/stats')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registration statistics (Admin)' })
  async getStats(): Promise<RegistrationStatsDto> {
    return this.registrationService.getStats();
  }

  @Get('admin/:id')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get registration details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RegistrationDetailDto> {
    return this.registrationService.findOne(id);
  }

  @Patch('admin/:id/status')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update registration status (Admin)' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ): Promise<RegistrationDetailDto> {
    return this.registrationService.updateStatus(id, dto.status);
  }

  @Delete('admin/:id')
  @SkipThrottle()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete registration (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.registrationService.delete(id);
  }
}
