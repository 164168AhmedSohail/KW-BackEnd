import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { TASK_STATUS } from 'src/constants';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: String })
  name: string;

  @Prop({
    enum: {
      values: [TASK_STATUS.COMPLETED, TASK_STATUS.PENDING],
      message: 'Invalid  status',
    },
  })
  status: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
