import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: "*", credentials: true }
  });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true
    })
  );
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>("env") || "development";

  if (["development", "local", "test"].includes(nodeEnv)) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("客服管理平台 API")
      .setDescription("后端服务接口文档")
      .setVersion("1.0.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          in: "header",
          name: "Authorization",
          description: "填入以 Bearer 开头的访问令牌"
        },
        "access-token"
      )
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document, {
      swaggerOptions: { persistAuthorization: true }
    });
  }

  await app.listen(configService.get<number>("port") || process.env.PORT || 3000);
}

bootstrap();

