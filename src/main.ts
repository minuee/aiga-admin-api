import { ValidationPipe } from '@nestjs/common';
import { NestFactory, } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { AppModule } from './app.module';

//swagger 추가 by noh.sn
import { setupSwagger } from './utils/index';
import * as expressBasicAuth from 'express-basic-auth';
//bodyParser upload load 제한해제 100mb 추가 by noh.sn
var bodyParser = require('body-parser');

async function bootstrap() {
  const app: NestExpressApplication =
  await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());

  // 업로드 폴더
  // - 선수 프로파일 이미지
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  //bodyParser upload load 제한해제 999mb 추가 by noh.sn
  app.use(bodyParser.json({limit: '999mb'})); 
  app.use(bodyParser.urlencoded({limit: '999mb', extended: true}));

  app.setGlobalPrefix(process.env.NODE_ENV === 'production' ? '' : 'adminapi');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
    }),
  );
  console.log("process.env",process.env.PORT , process.env.SWAGGER_USER, process.env.SWAGGER_PWD)
  //swagger by nohsn 2025.03
  const options = {
    //customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Korea Medicare Crawler API",
  };
  app.use(
    ['v1/docs'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER] : process.env.SWAGGER_PWD },
    })
  );
  setupSwagger(app);


  const port = process.env.PORT || 9999;
  await app.listen(port);
}
bootstrap();