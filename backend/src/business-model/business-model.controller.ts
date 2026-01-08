import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { BusinessModel } from '@prisma/client';
import { BusinessModelService } from './business-model.service';
import { CreateBusinessModelDto, UpdateBusinessModelDto, ReorderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Business Model')
@Controller('business-model')
@SkipThrottle()
export class BusinessModelController {
  constructor(private readonly businessModelService: BusinessModelService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Get all visible business models (Public)' })
  @ApiResponse({ status: 200, description: 'Business model list' })
  async findAllPublic(): Promise<BusinessModel[]> {
    return this.businessModelService.findAllPublic();
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get business model details (Public)' })
  async findOnePublic(@Param('id', ParseUUIDPipe) id: string): Promise<BusinessModel> {
    return this.businessModelService.findOnePublic(id);
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all business models (Admin)' })
  async findAll(): Promise<BusinessModel[]> {
    return this.businessModelService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get business model details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<BusinessModel> {
    return this.businessModelService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new business model (Admin)' })
  async create(@Body() dto: CreateBusinessModelDto): Promise<BusinessModel> {
    return this.businessModelService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update business model (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBusinessModelDto,
  ): Promise<BusinessModel> {
    return this.businessModelService.update(id, dto);
  }

  @Patch('admin/:id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle business model visibility (Admin)' })
  async toggleVisibility(@Param('id', ParseUUIDPipe) id: string): Promise<BusinessModel> {
    return this.businessModelService.toggleVisibility(id);
  }

  @Patch('admin/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder business models (Admin)' })
  async reorder(@Body() dto: ReorderDto): Promise<void> {
    return this.businessModelService.reorder(dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete business model (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.businessModelService.delete(id);
  }
}
