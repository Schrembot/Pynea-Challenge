import { ApiProperty } from '@nestjs/swagger';
import { GetUserDto } from './get-user.dto';

export class ResponseUserDtoItem {
  @ApiProperty()
  data: GetUserDto;
  @ApiProperty()
  error: string;
}

export class ResponseUserDtoList {
  @ApiProperty({ type: [GetUserDto] })
  data: GetUserDto;
  @ApiProperty()
  error: string;
}

export class ResponseUserDtoNull {
  @ApiProperty({ nullable: true })
  data: GetUserDto | null; // Can't just specify null here or it freaks out.  Null isn't a defined type in OpenAPI.

  @ApiProperty()
  error: string;
}
