import { IsEnum, IsOptional, IsUrl } from "class-validator";

export class Create3DGenerationDto {
  @IsUrl()
  imageUrl: string;

  @IsOptional()
  @IsEnum(["standard", "lowpoly"])
  modelType?: "standard" | "lowpoly";
}
