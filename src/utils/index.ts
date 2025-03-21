import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('AIGA Admin API Docs')
    .setDescription('AIGA Admin API description by Noh.sn 2025.03')
    .setVersion('1.0.0')
    .addTag('swagger')
  	.addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      in: 'header',
    },
    'token'
    )
    .build();;

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/docs', app, document,{
  	swaggerOptions: {
      persistAuthorization: true, 
    }
  });
}