import {
  Controller,
  Post,
  Body,
  Response,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterUserDto,
  LoginDto,
  LoginResponseDto,
  SendInviteDto,
} from './dto/auth.dto';
import { Role } from 'src/enums/role.enum';
import { Roles } from '../../decorators/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard) // implementing the guards
  @Post('/register')
  @ApiBody({ description: 'Api Payload', type: RegisterUserDto })
  @ApiOkResponse({
    description: 'It returns token when signup',
    headers: {
      'x-auth': { description: 'User authentication token will be return' },
    },
    type: RegisterUserDto,
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @Response() res: Res,
  ): Promise<Res> {
    return this.authService.register(registerUserDto, res);
  }

  @Post('/login')
  @ApiBody({ description: 'Api Payload', type: LoginDto })
  @ApiNotFoundResponse({ description: 'User does not exist!' })
  @ApiOkResponse({
    description: 'It returns token when login',
    headers: {
      'x-auth': { description: 'User authentication token will be return' },
    },
    type: LoginResponseDto,
  })
  async login(@Body() loginDto: LoginDto, @Response() res: Res): Promise<Res> {
    return this.authService.login(loginDto, res);
  }

  // role base implementation

  @Roles(Role.ADMIN) // attaching metadata
  @UseGuards(AuthGuard, RoleGuard) // implementing the guards
  @Post('/send-invite')
  async sendInvite(@Body() sendInviteDto: SendInviteDto) {
    return this.authService.sendInvite(sendInviteDto);
  }
}
