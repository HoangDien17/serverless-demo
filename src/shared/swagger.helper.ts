import * as apiSpecConverter from 'api-spec-converter';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as fs from 'fs';

export async function initializeSwagger(app: INestApplication) {
  const server = app.getHttpAdapter();
  const serviceName = process.env.SERVICE_NAME;
  const serviceDescription = process.env.SERVICE_DESCRIPTION;
  const apiVersion = process.env.SERVICE_API_VERSION;

  const options = new DocumentBuilder()
    .setTitle(`${serviceName} API spec`)
    .setDescription(
      `${serviceDescription} | [swagger.json](swagger.json) | [swagger-2.0.json](swagger-2.0.json)`,
    )
    .setVersion(apiVersion)
    .addServer(
      `${process.env.SWAGGER_SCHEMA}://${process.env.HOST_NAME}`,
    )
    .addApiKey(null, 'access-token')
    .build();

  const [swagger2, oas3] = await generateSwaggerSpecs(app, options);
  writeSwaggerJson(`${process.cwd()}`, swagger2, oas3);

  server.get(
    `${process.env.DOCS_BASE_URL}/swagger.json`,
    (req, res) => {
      res.json(oas3);
    },
  );
  server.get(
    `${process.env.DOCS_BASE_URL}/swagger-2.0.json`,
    (req, res) => {
      res.json(swagger2);
    },
  );

  SwaggerModule.setup(process.env.DOCS_BASE_URL, app, oas3, {
    swaggerOptions: {
      displayOperationId: true,
    },
  });
}

async function generateSwaggerSpecs(
  app: INestApplication,
  config: Omit<OpenAPIObject, 'paths'>,
): Promise<[any, OpenAPIObject]> {
  const oas3: OpenAPIObject = SwaggerModule.createDocument(app, config);
  const swagger2 = await apiSpecConverter
    .convert({
      from: 'openapi_3',
      to: 'swagger_2',
      source: oas3,
    })
    .then((converted) => {
      return converted.spec;
    });
  return [swagger2, oas3];
}

function writeSwaggerJson(path: string, swagger2: any, oas3: OpenAPIObject) {
  const swaggerFile = `${path}/swagger.json`;
  const swaggerFile2 = `${path}/swagger-2.0.json`;
  fs.writeFileSync(swaggerFile, JSON.stringify(oas3, null, 2), {
    encoding: 'utf8',
  });
  fs.writeFileSync(swaggerFile2, JSON.stringify(swagger2, null, 2), {
    encoding: 'utf8',
  });
}
