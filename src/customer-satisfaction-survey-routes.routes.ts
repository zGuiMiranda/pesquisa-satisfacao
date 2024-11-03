import { FastifyInstance, FastifyRequest } from "fastify";
import CustomerSatisfactionSurveyController, {
  CreateSurveyData,
  UpdateSurveyData,
} from "./infra/controller/customer-satisfaction-survey-controller";

const customerSatisfactionSurveyController =
  new CustomerSatisfactionSurveyController();

export async function CustomerSatisfactionSurveyRoutes(
  fastify: FastifyInstance
) {
  fastify.post("/createSurvey", {
    schema: {
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            maxRating: { type: "number" },
            contactEmail: { type: "string" },
            targetAudienceId: { type: "string" },
            createdAt: { type: "string" },
          },
        },
      },
      body: {
        type: "object",
        required: [
          "title",
          "description",
          "maxRating",
          "contactEmail",
          "targetAudienceId",
        ],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          maxRating: { type: "number" },
          contactEmail: { type: "string" },
          targetAudienceId: { type: "string" },
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: CreateSurveyData }>,
      reply
    ) => {
      return customerSatisfactionSurveyController.createSurvey(
        request.body,
        reply
      );
    },
  });

  fastify.put("/updateSurvey", {
    schema: {
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            maxRating: { type: "number" },
            contactEmail: { type: "string" },
            targetAudienceId: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
      body: {
        type: "object",
        required: [
          "title",
          "description",
          "maxRating",
          "contactEmail",
          "targetAudienceId",
        ],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          maxRating: { type: "number" },
          contactEmail: { type: "string" },
          targetAudienceId: { type: "string" },
          status: { type: "string" },
        },
      },
    },
    handler: async (
      request: FastifyRequest<{ Body: UpdateSurveyData }>,
      reply
    ) => {
      return customerSatisfactionSurveyController.updateSurvey(
        request.body,
        reply
      );
    },
  });
}
