import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, type JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type User } from '@prisma/client';
import {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} from '../common/constants';
import { type LoginUserDto } from './dto/login-user.dto';
import {
  type JwtObject,
  type JwtPayload,
  type JwtTokens,
} from './interface/jwt.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async issueJwtTokens(loginUserDto: LoginUserDto): Promise<JwtTokens> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginUserDto.email,
      },
    });
    if (!(await this.isValidUser(user, loginUserDto.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return await this.createJwtTokens(user.id, user.email, user.nickname);
  }

  async isValidUser(user: User, password: string) {
    if (!user || user.password !== password) {
      return false;
    }
    return true;
  }

  async updateJwtTokens(refreshToken: string): Promise<JwtTokens> {
    const { userId, email, nickname } = await this.verifyJwtToken(refreshToken);
    return await this.createJwtTokens(userId, email, nickname);
  }

  async verifyJwtToken(
    token: string,
    options: JwtVerifyOptions = {},
  ): Promise<JwtObject> {
    const jwtVerifyOptions = {
      secret: this.config.get('JWT_SECRET'),
      ...options,
    };
    try {
      return await this.jwtService.verifyAsync(token, jwtVerifyOptions);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async createJwtTokens(
    userId: number,
    email: string,
    nickname: string,
  ): Promise<JwtTokens> {
    const payload: JwtPayload = { userId, email, nickname };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_TOKEN_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }
}
