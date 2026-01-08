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
import { Event } from '@prisma/client';
import { EventService } from './event.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Event')
@Controller('event')
@SkipThrottle()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Public endpoints
  @Get('public')
  @ApiOperation({ summary: 'Get all visible events (Public)' })
  @ApiResponse({ status: 200, description: 'Event list' })
  async findAllPublic(): Promise<Event[]> {
    return this.eventService.findAllPublic();
  }

  @Get('public/featured')
  @ApiOperation({ summary: 'Get featured events (Public)' })
  async findFeatured(): Promise<Event[]> {
    return this.eventService.findFeatured();
  }

  @Get('public/upcoming')
  @ApiOperation({ summary: 'Get upcoming events (Public)' })
  async findUpcoming(): Promise<Event[]> {
    return this.eventService.findUpcoming();
  }

  @Get('public/past')
  @ApiOperation({ summary: 'Get past events (Public)' })
  async findPast(): Promise<Event[]> {
    return this.eventService.findPast();
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get event details (Public)' })
  async findOnePublic(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    return this.eventService.findOnePublic(id);
  }

  // Admin endpoints
  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all events (Admin)' })
  async findAll(): Promise<Event[]> {
    return this.eventService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get event details (Admin)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    return this.eventService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new event (Admin)' })
  async create(@Body() dto: CreateEventDto): Promise<Event> {
    return this.eventService.create(dto);
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event (Admin)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(id, dto);
  }

  @Patch('admin/:id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle featured event (Admin)' })
  async toggleFeatured(@Param('id', ParseUUIDPipe) id: string): Promise<Event> {
    return this.eventService.toggleFeatured(id);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event (Admin)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.eventService.delete(id);
  }
}
