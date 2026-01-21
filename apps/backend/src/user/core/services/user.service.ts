import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserRole } from "../schemas/user.schema";
import { CreateUserDto } from "src/user/http/rest/dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.phone) {
      await this.ensurePhoneIsUnique(createUserDto.phone);
    }
    if (createUserDto.email) {
      await this.ensureEmailIsUnique(createUserDto.email);
    }

    const user = new this.userModel({
      ...createUserDto,
      role: UserRole.USER,
    });

    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException("Email is already in use");
    }
  }

  async update(id: string, payload: CreateUserDto): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, payload, { new: true });
  }

  private async ensurePhoneIsUnique(phone: string): Promise<void> {
    const userExists = await this.findByPhone(phone);
    if (userExists) {
      throw new ConflictException("Phone is already in use");
    }
  }
}
