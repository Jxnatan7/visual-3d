import { Injectable } from "@nestjs/common";
import { compareSync } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/core/services/user.service";
import { User } from "src/user/core/schemas/user.schema";
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    phone: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userService.findByPhone(phone);

    if (!user) return undefined;

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) return undefined;

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return {
      ...user,
      token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    };
  }
}
