import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Create3DGenerationDto } from "../dto/create-generation.dto";
import { GeneratorService } from "src/3d-processing/core/services/3d-generator.service";

@Controller("api/v1/3d-generation")
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  async generate(@Body() dto: Create3DGenerationDto) {
    return this.generatorService.startGeneration(dto);
  }

  @Get(":id")
  async getStatus(@Param("id") id: string) {
    return this.generatorService.getInternalTaskStatus(id);
  }
}
