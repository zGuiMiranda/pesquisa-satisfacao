import "reflect-metadata";
import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { Registry } from "./src/infra/di/di";
import { PgPromiseAdapter } from "./src/infra/database/database-connection";
import CustomerSatisfactionSurveyAnswerRepository from "./src/infra/repository/customer-satisfaction-survey-answer-repository";
import CustomerSatisfactionSurveyRepository from "./src/infra/repository/customer-satisfaction-survey-repository";
import TargetAudienceRepository from "./src/infra/repository/target-audience-repository";

import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { CustomerSatisfactionSurveyRoutes } from "./src/customer-satisfaction-survey-routes.routes";
import { TargetAudienceRoutes } from "./src/target-audience.routes";
import { CustomerSatisfactionSurveyRoutesAnswer } from "./src/customer-satisfaction-survey-routes-answer.routes";

class App {
  public server: FastifyInstance;

  constructor() {
    this.inject();
    this.server = Fastify({ logger: false });
    this.middleware();
    this.setSwagger();
    this.routes();
  }

  setSwagger() {
    this.server.register(swagger, {
      openapi: {
        info: {
          title: "Documentação Pesquisa de Satisfação",
          description: "Documentação da API para Pesquisa de satisfação",
          version: "1.0.0",
        },
      },
    });
    this.server.register(swaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject;
      },
      transformSpecificationClone: true,
    });
  }
  routes() {
    this.server.register(CustomerSatisfactionSurveyRoutes, {
      prefix: "/customerSurveySatisfaction",
    });
    this.server.register(TargetAudienceRoutes, {
      prefix: "/targetAudience",
    });
    this.server.register(CustomerSatisfactionSurveyRoutesAnswer, {
      prefix: "/customerSurveyAnswers",
    });
  }

  middleware() {
    this.server.register(cors);
    this.server.addHook("onRequest", async (request, reply) => {
      request.headers["content-type"] = "application/json";
    });
  }

  inject() {
    Registry.getInstance().provide(
      "connection",
      PgPromiseAdapter.getInstance()
    );
    Registry.getInstance().provide(
      "customerSatisfactionSurveyRepository",
      CustomerSatisfactionSurveyRepository.getInstance()
    );
    Registry.getInstance().provide(
      "targetAudienceRepository",
      TargetAudienceRepository.getInstance()
    );
    Registry.getInstance().provide(
      "customerSatisfactionSurveyAnswerRepository",
      CustomerSatisfactionSurveyAnswerRepository.getInstance()
    );
  }
}

export default new App();
