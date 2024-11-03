import { FastifyInstance } from "fastify/types/instance";
import TargetAudienceController from "./infra/controller/target-audience-controller";

const targetAudienceController = new TargetAudienceController();

export async function TargetAudienceRoutes(fastify: FastifyInstance) {
  fastify.get("/getTargetAudiences", {
    schema: {
      response: {
        200: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      return targetAudienceController.getTargetAudiences(reply);
    },
  });
}
