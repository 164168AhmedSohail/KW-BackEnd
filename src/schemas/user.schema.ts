import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EMAIL_REGEX } from '../constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({
    validators: {
      validate: function (v: string) {
        return EMAIL_REGEX.test(v);
      },
      message: (props: any) => `${props.value} is not a valid email!`,
    },
    unique: [true, 'User already exists!'],
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
