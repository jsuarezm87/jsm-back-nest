import { ArgumentMetadata, BadRequestException, Injectable, ValidationPipe, ValidationError } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      // forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = errors.reduce((acc, error) => {
          const constraints = error.constraints || {};
          acc[error.property] = {
            value: error.value || '',
            msg: Object.values(constraints)[0] || 'Validation error',
          };
          return acc;
        }, {} as Record<string, { value: string; msg: string }>);
        return new BadRequestException({
          errors: formattedErrors,
          error: 'Bad Request',
          statusCode: 400,
        });
      },
    });
  }
}
