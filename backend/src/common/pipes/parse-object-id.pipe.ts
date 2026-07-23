import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

/**
 * Validates `:id` route params before they reach a service, turning a
 * malformed id into a clean 400 instead of a Mongoose CastError (500).
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid identifier format');
    }
    return value;
  }
}
