import BusinessError from "../../domain/errors/business-error";

type HTTPSTATUSES = 200 | 201 | 400 | 500;

export default class AbstractController {
  protected STATUSES: { [key: string]: HTTPSTATUSES } = {
    INTERNAL_ERROR: 500,
    BUSINESS_ERROR: 400,
    SUCCESS_GET: 200,
    SUCCESS_POST: 201,
  };

  sendResponse(
    response,
    reply,
    status: HTTPSTATUSES = this.STATUSES.SUCCESS_GET
  ) {
    reply.status(status).send(response);
  }

  sendResponseCSV(
    response,
    reply,
    status: HTTPSTATUSES = this.STATUSES.SUCCESS_GET,
    fileName: string
  ) {
    reply.header("Content-Type", "text/csv");
    reply.header(
      "Content-Disposition",
      `attachment; filename="${fileName}.csv"`
    );
    reply.status(status).send(response);
  }

  handleError(error, reply) {
    console.error(error);
    if (error instanceof BusinessError)
      return reply
        .status(this.STATUSES.BUSINESS_ERROR)
        .send({ message: error.message, error });

    return reply
      .status(this.STATUSES.INTERNAL_ERROR)
      .send({ message: error.message, error });
  }
}
