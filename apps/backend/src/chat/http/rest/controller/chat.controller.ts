import { Controller } from "@nestjs/common";
import { ChatService } from "src/chat/core/services/chat.service";

@Controller("api/v1/chats")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
}
