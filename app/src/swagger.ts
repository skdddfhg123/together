import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function SwaggerDocument(app: INestApplication, modulesToExclude: any[]) {
    const swaggerOptions = new DocumentBuilder()
        .setTitle('Example API')
        .setDescription('The API description')
        .setVersion('1.0')
        .addTag('test')
        .addBearerAuth(
            {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                name: "JWT",
                description: "Enter JWT token",
                in: "header",
            },
            "JWT-auth"
        )
        .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    document.paths = Object.fromEntries(
        Object.entries(document.paths).filter(([path, pathObject]) => {
            const isExcluded = modulesToExclude.some(module =>
                Object.values(module).some((controller: string) => pathObject[controller])
            );
            return !isExcluded;
        }),
    );

    return document;
}

