import { Injectable, BadRequestException } from '@nestjs/common';
import { Task } from '../../schemas/tasks.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getAllTasks(userId, status, offset, dataLimit) {
    try {
      //data filters
      const userIdFilter = userId ? { user: userId } : {};
      const statusFilter = status ? { status: status } : {};

      //pagination
      const pageNumber = parseInt(offset) || 0;
      const limit = parseInt(dataLimit) || 10;
      const skip = pageNumber * limit;

      const tasks = await this.taskModel
        .find({
          ...userIdFilter,
          ...statusFilter,
        })
        .populate('user')
        .skip(skip)
        .limit(limit)
        .lean();

      return tasks;
    } catch (error) {
      console.log(error);
    }
  }

  async createTask(body) {
    try {
      const { name, status, userId } = body;

      await this.taskModel.create({ name: name, status: status, user: userId });
      return { message: 'task created successfully' };
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(body) {
    try {
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteTask(id) {
    try {
      await this.taskModel.findByIdAndDelete({ _id: id });

      return { message: 'deleted successfully!' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }
  }
}
