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
import { PartnershipFaq } from '@prisma/client';
import { PartnershipFaqService } from './partnership-faq.service';
import { CreatePartnershipFaqDto, UpdatePartnershipFaqDto, ReorderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Partnership FAQ')
@Controller('partnership-faq')
@SkipThrottle()
export class PartnershipFaqController {
  constructor(private readonly partnershipFaqService: PartnershipFaqService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Get all visible FAQs (Public)' })
  @ApiResponse({ status: 200, description: 'FAQ list' })
  async findAllPublic(): Promise<PartnershipFaq[]> {
    return this.partnershipFaqService.findAllPublic();
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all FAQs (Admin)' })
  async findAll(): Promise<PartnershipFaq[]> {
    return this.partnershipFaqService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get FAQ details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PartnershipFaq> {
    return this.partnershipFaqService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new FAQ (Admin)' })
  async create(@Body() dto: CreatePartnershipFaqDto): Promise<PartnershipFaq> {
    return this.partnershipFaqService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FAQ (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePartnershipFaqDto,
  ): Promise<PartnershipFaq> {
    return this.partnershipFaqService.update(id, dto);
  }

  @Patch('admin/:id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle FAQ visibility (Admin)' })
  async toggleVisibility(@Param('id', ParseUUIDPipe) id: string): Promise<PartnershipFaq> {
    return this.partnershipFaqService.toggleVisibility(id);
  }

  @Patch('admin/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder FAQs (Admin)' })
  async reorder(@Body() dto: ReorderDto): Promise<void> {
    return this.partnershipFaqService.reorder(dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete FAQ (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.partnershipFaqService.delete(id);
  }
}
