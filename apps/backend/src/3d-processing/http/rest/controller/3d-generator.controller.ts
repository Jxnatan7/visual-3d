import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Create3DGenerationDto } from "../dto/create-generation.dto";
import { GeneratorService } from "src/3d-processing/core/services/3d-generator.service";
import { Model3D } from "src/integration/core/schemas/model-3d.schema";
import { FilterRequest } from "src/@core/services/mongo-query.service";

@Controller("api/v1/3d-generation")
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  async generate(@Body() dto: Create3DGenerationDto): Promise<Model3D> {
    return this.generatorService.startGeneration(dto);
  }

  @Get(":id")
  async getModel3D(@Param("id") id: string) {
    return this.generatorService.getInternalModel3DTaskStatus(id);
  }

  @Post("/search")
  async search(@Body() filterRequest: FilterRequest) {
    return this.generatorService.search(filterRequest);
  }
}
