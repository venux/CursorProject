"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        transform: true
    }));
    const configService = app.get(config_1.ConfigService);
    const nodeEnv = configService.get("env") || "development";
    if (["development", "local", "test"].includes(nodeEnv)) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle("客服管理平台 API")
            .setDescription("后端服务接口文档")
            .setVersion("1.0.0")
            .addBearerAuth({
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            in: "header",
            name: "Authorization",
            description: "填入以 Bearer 开头的访问令牌"
        }, "access-token")
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup("api/docs", app, document, {
            swaggerOptions: { persistAuthorization: true }
        });
    }
    await app.listen(configService.get("port") || process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map