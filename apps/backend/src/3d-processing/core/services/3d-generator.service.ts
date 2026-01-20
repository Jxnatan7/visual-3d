import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { Create3DGenerationDto } from "src/3d-processing/http/rest/dto/create-generation.dto";
import { IAIProvider } from "src/integration/core/interfaces/ai-provider.interface";
import { TaskRepository } from "src/integration/core/repositories/task.repository";

@Injectable()
export class GeneratorService {
  constructor(
    @Inject("AI_PROVIDER") private readonly aiProvider: IAIProvider,
    private readonly taskRepository: TaskRepository,
  ) {}

  async startGeneration(dto: Create3DGenerationDto, userId?: string) {
    const { result: externalId } = await this.aiProvider.createImageTo3D({
      image_url: `data:image/png;base64,${dto.imageBase64}`,
      model_type: dto.modelType ?? "standard",
      target_polycount: 3000,
      should_texture: true,
      should_remesh: true,
    });

    return this.taskRepository.create({
      externalId,
      imageUrl: dto.imageBase64,
      userId: userId ? new Types.ObjectId(userId) : undefined,
      status: "PENDING",
    });
  }

  async getInternalTaskStatus(taskId: string) {
    const task = await this.taskRepository.findByExternalId(taskId);
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }
}
