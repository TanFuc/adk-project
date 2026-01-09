import { BadRequestException } from '@nestjs/common';

export class ValidationError extends BadRequestException {
  constructor(public validationErrors: string[]) {
    super({
      message: 'Dữ liệu không hợp lệ',
      errors: validationErrors,
    });
  }
}
