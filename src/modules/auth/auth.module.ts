import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../../schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessContorlService } from '../../shared/access-control.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    // JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [AuthService, AccessContorlService],
  controllers: [AuthController],
})
export class AuthModule {}
