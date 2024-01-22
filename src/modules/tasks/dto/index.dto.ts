import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  userId: string;
}

class UpdatedData {
  @ApiProperty()
  status: string;

  @ApiProperty()
  userId: string;
}

export class UpdateTaskDto {
  @ApiProperty()
  taskId: string;

  @ApiProperty()
  updatedData: UpdatedData;
}
