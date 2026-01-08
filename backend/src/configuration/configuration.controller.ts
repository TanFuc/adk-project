import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Configuration } from '@prisma/client';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto, UpdateConfigurationDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Configuration')
@Controller('configuration')
@SkipThrottle()
export class ConfigurationController {
  constructor(private readonly configurationService: ConfigurationService) {}

  // Public endpoint
  @Get('public')
  @ApiOperation({ summary: 'Get all configurations (Public)' })
  @ApiResponse({ status: 200, description: 'Configuration list' })
  async findPublic(): Promise<Record<string, unknown>> {
    return this.configurationService.findPublic();
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all configurations (Admin)' })
  async findAll(): Promise<Configuration[]> {
    return this.configurationService.findAll();
  }

  @Get('admin/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get configuration by key (Admin)' })
  async findByKey(@Param('key') key: string): Promise<Configuration> {
    return this.configurationService.findByKey(key);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new configuration (Admin)' })
  async create(@Body() dto: CreateConfigurationDto): Promise<Configuration> {
    return this.configurationService.create(dto);
  }

  @Patch('admin/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update configuration (Admin)' })
  async update(@Param('key') key: string, @Body() dto: UpdateConfigurationDto): Promise<Configuration> {
    return this.configurationService.update(key, dto);
  }

  @Delete('admin/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete configuration (Admin)' })
  async delete(@Param('key') key: string): Promise<void> {
    return this.configurationService.delete(key);
  }
}
