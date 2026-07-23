import { ApiProperty } from '@nestjs/swagger';

/** Standard body for endpoints that only need to confirm an action. */
export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message!: string;

  constructor(message: string) {
    this.message = message;
  }
}
