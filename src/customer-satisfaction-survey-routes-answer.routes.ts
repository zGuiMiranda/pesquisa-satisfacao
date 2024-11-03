import { FastifyInstance, FastifyRequest } from "fastify";
import CustomerSatisfactionSurveyAnswerController, {
  AnswerSurveyData,
  GetSurveyAnswersByTargetAudienceData,
} from "./infra/controller/customer-satisfaction-survey-answer-controller";

const customerSatisfactionSurveyAnswerController =
  new CustomerSatisfactionSurveyAnswerController();

export async function CustomerSatisfactionSurveyRoutesAnswer(
  fastify: FastifyInstance
) {
  fastify.post("/answerSurvey", {
    schema: {
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            customerSatisfactionSurveyId: { type: "string" },
            feedback: { type: "string" },
            rating: { type: "number" },
          },
        },
      },
      body: {
        type: "object",
        required: ["customerSatisfactionSurveyId", "rating"],
        properties: {
          customerSatisfactionSurveyId: { type: "string" },
          feedback: { type: "string" },
          rating: { type: "number" },
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: AnswerSurveyData }>,
      reply
    ) => {
      return customerSatisfactionSurveyAnswerController.answerSurvey(
        request.body,
        reply
      );
    },
  });

  fastify.get("/getSurveyAnswers", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          targetAudienceId: { type: "string" },
          order: { type: "string", enum: ["asc", "desc"] },
        },
        required: ["targetAudienceId"],
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              customerSatisfactionSurveyId: { type: "string" },
              feedback: { type: "string" },
              rating: { type: "number" },
              createdAt: { type: "string" },
            },
          },
        },
      },
    },
    handler: async (
      request: FastifyRequest<{
        Querystring: GetSurveyAnswersByTargetAudienceData;
      }>,
      reply
    ) => {
      const { targetAudienceId, order } = request.query;

      return customerSatisfactionSurveyAnswerController.getSurveyAnswersByTargetAudience(
        { targetAudienceId, order },
        reply
      );
    },
  });

  fastify.get("/exportSurveyAnswers", {
    schema: {
      querystring: {
        type: "object",
        properties: {
          targetAudienceId: { type: "string" },
          order: { type: "string", enum: ["asc", "desc"] },
        },
        required: ["targetAudienceId"],
      },
      response: {
        200: {
          description: "Exportar respostas",
          content: {
            csv: {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    customerSatisfactionSurveyId: { type: "string" },
                    feedback: { type: "string" },
                    rating: { type: "number" },
                    createdAt: { type: "string" },
                  },
                },
                format: "binary",
              },
            },
          },
        },
      },
    },
    handler: async (
      request: FastifyRequest<{
        Querystring: GetSurveyAnswersByTargetAudienceData;
      }>,
      reply
    ) => {
      const { targetAudienceId, order } = request.query;

      return customerSatisfactionSurveyAnswerController.exportSurveyAnswersByTargetAudience(
        { targetAudienceId, order },
        reply
      );
    },
  });
}
