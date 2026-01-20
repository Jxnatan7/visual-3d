import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Task, TaskDocument } from "../schemas/task.schema";

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(data: Partial<Task>): Promise<Task> {
    const newTask = new this.taskModel(data);
    return newTask.save();
  }

  async findByExternalId(externalId: string): Promise<TaskDocument | null> {
    return this.taskModel.findOne({ externalId }).exec();
  }

  async updateByExternalId(
    externalId: string,
    updateData: Partial<Task>,
  ): Promise<Task> {
    const updated = await this.taskModel
      .findOneAndUpdate({ externalId }, { $set: updateData }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(
        `Task with externalId ${externalId} not found`,
      );
    }
    return updated;
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    return this.taskModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }
}
