import { IsBase64, IsEnum, IsOptional } from "class-validator";

export class Create3DGenerationDto {
  @IsBase64()
  imageBase64: string;

  @IsOptional()
  @IsEnum(["standard", "lowpoly"])
  modelType?: "standard" | "lowpoly";
}
