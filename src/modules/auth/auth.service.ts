import {
  Injectable,
  BadRequestException,
  ConflictException,
  Response,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../schemas/user.schema';
import { LoginDto, RegisterUserDto } from './dto/auth.dto';
import { SALT_ROUNDS } from '../../constants/index';

import config from '../../config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,

    private readonly jwtService: JwtService,
  ) {}

  async register(
    { name, email, password }: RegisterUserDto,
    res: Res,
  ): Promise<Res> {
    try {
      const userExist = await this.userModel.findOne({ email });

      if (userExist) {
        throw new ConflictException({
          message: 'Email already exists!',
        });
      }
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const authToken = this.jwtService.sign({ id: user._id });

      return res
        .set({
          'x-auth': authToken,
        })
        .json({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
    } catch (error: any) {
      if (error.status === 409) {
        throw new ConflictException(error.response);
      }

      throw new BadRequestException(error.message);
    }
  }

  async login({ email, password }: LoginDto, @Response() res: Res) {
    try {
      const user = await this.userModel
        .findOne({
          email,
        })
        .lean();

      if (!user) {
        throw new NotFoundException({
          message: 'User not found!',
        });
      }

      const checkPassword = await bcrypt.compare(password, user.password);

      if (!checkPassword) {
        throw new UnauthorizedException({
          message: 'Email or Password is incorrect!',
        });
      }

      const authToken = this.jwtService.sign({ id: user._id });

      return res
        .set({
          'x-auth': authToken,
        })
        .json({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException(error.response);
      }

      if (error.status === 401) {
        throw new UnauthorizedException(error.response);
      }

      throw new BadRequestException(error.message);
    }
  }

  async sendInvite(body) {
    try {
      const { email } = body;
      const authToken = this.jwtService.sign({ email: email });

      console.log(authToken, email);

      return {
        email: email,
        token: authToken,
      };
    } catch (error: any) {
      if (error.status === 409) {
        throw new ConflictException(error.response);
      }

      throw new BadRequestException(error.message);
    }
  }
}
