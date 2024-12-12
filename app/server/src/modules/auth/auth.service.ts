import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';
import { formatUser } from 'src/common/helpers/formatUser';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(email: string, pass: string) {
    const userRow = await this.usersService.findOne({
      email,
    });

    if (!userRow) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: hashedPassword } = userRow;

    const isPasswordValid = await bcrypt.compare(pass, hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      access_token: await this.jwtService.signAsync({
        sub: userRow.id,
        email,
      }),
      user: formatUser(userRow),
    };
  }

  async signUp(signUpDto: Prisma.UserCreateInput) {
    const user = await this.usersService.createUser({
      email: signUpDto.email,
      password: await bcrypt.hash(signUpDto.password, 10),
      f_name: signUpDto.f_name,
      l_name: signUpDto.l_name,
    });
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: formatUser(user),
    };
  }
}
