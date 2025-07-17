import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationError } from 'class-validator';
import { AllExceptionsFilter } from '@shared/infrastructure/ AllExceptionsFilter';

function buildErrorMessages(errors: ValidationError[]): any[] {
  return errors.map((error) => {
    if (error.children && error.children.length > 0) {
      return {
        property: error.property,
        children: buildErrorMessages(error.children),
      };
    }

    return {
      property: error.property,
      message: error.constraints
        ? Object.values(error.constraints)
        : [],
    };
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalFilters(new AllExceptionsFilter());


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const formattedErrors = buildErrorMessages(errors);
        return new BadRequestException({ message: formattedErrors });
      },
    }),
  );

  const config = app.get<ConfigService>(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
  })


  const port = config.get<number>('PORT') ?? 3000;
  await app.listen(port, () => {
    console.log(`🚀 Server started [CourseServer] on port ${port}`, {
      context: 'Bootstrap',
      timestamp: new Date().toISOString()
    });
  });
}

bootstrap();
