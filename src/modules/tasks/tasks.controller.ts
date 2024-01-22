import {
  Body,
  Controller,
  Patch,
  Post,
  Delete,
  Get,
  Response,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Response as Res } from 'express';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { Role } from 'src/enums/role.enum';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { CreateTaskDto, UpdateTaskDto } from './dto/index.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'token for authorization',
  })
  @Get('')
  async getAllTasks(
    @Query('userId') userId?: string,
    @Query('status') status?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tasksService.getAllTasks(userId, status, offset, limit);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  @ApiHeader({
    name: 'x-auth',
    description: 'token for authorization',
  })
  @ApiBody({ description: 'Api Payload', type: CreateTaskDto })
  @ApiOkResponse({
    description: 'It returns success message if task created',
  })
  async createTask(@Body() body: CreateTaskDto) {
    return this.tasksService.createTask(body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @Patch()
  @ApiBody({ description: 'Api Payload', type: UpdateTaskDto })
  @ApiOkResponse({
    description: 'It returns success message',
  })
  async updateTask(@Body() body: UpdateTaskDto) {
    return this.tasksService.updateTask(body);
  }

  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard, RoleGuard)
  @ApiHeader({
    name: 'x-auth',
    description: 'token for authorization',
  })
  @Delete()
  @ApiOkResponse({
    description: 'deleted.',
  })
  async deleteAgency(@Query('id') id: string) {
    this.tasksService.deleteTask(id);
  }
}
