import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { MeshyStatus } from "../interfaces/meshy-types";

export type TaskDocument = Task & Document;

@Schema({ _id: false })
class ModelUrls {
  @Prop() glb?: string;
  @Prop() fbx?: string;
  @Prop() obj?: string;
  @Prop() usdz?: string;
}

@Schema({ timestamps: true, collection: "ai_tasks" })
export class Task extends Document {
  @Prop({ required: true, index: true })
  externalId: string;

  @Prop({ type: String, required: true, default: "PENDING" })
  status: MeshyStatus;

  @Prop({ required: true })
  imageUrl: string;

  @Prop()
  thumbnailUrl?: string;

  @Prop({ type: ModelUrls })
  modelUrls?: ModelUrls;

  @Prop({ type: Types.ObjectId, ref: "User", required: false })
  userId?: Types.ObjectId;

  @Prop({ type: Object })
  rawMetadata?: any;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
