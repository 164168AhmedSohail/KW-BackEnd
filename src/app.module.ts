import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
//import { AuthMiddleware } from './middlewares/auth.middleware';
import { User, UserSchema } from './schemas/user.schema';
//import { UsersModule } from './modules/users/users.module';
import { AccessContorlService } from './shared/access-control.service';

import configs from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configs],
    }),

    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    //   UsersModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AccessContorlService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .exclude({ path: '/auth/login', method: RequestMethod.POST })
      .forRoutes({ path: '/*', method: RequestMethod.ALL });
  }
}
