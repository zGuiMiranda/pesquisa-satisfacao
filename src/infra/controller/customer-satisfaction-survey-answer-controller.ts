import GetCustomerSatisfactionSurveyAnswers from "../../../src/application/usecase/get-customer-satisfaction-survey-answers";
import CreateCustomerSatisfactionSurveyAnswer from "../../../src/application/usecase/create-customer-satisfaction-survey-answer";
import AbstractController from "./abstract-controller";
import ExportCustomerSatisfactionSurveyAnswers from "../../../src/application/usecase/export-customer-satisfaction-survey-answers";

export type AnswerSurveyData = {
  customerSatisfactionSurveyId: string;
  feedback: string;
  rating: number;
};

export type UpdateSurveyData = {
  customerSatisfactionSurveyAnswerId: string;
  customerSatisfactionSurveyId: string;
  feedback: string;
  rating: number;
  createdAt: Date;
};

export type GetSurveyAnswersByTargetAudienceData = {
  targetAudienceId: string;
  order: "asc" | "desc";
};

export default class CustomerSatisfactionSurveyAnswerController extends AbstractController {
  private createCustomerSatisfactionSurveyAnswer: CreateCustomerSatisfactionSurveyAnswer =
    new CreateCustomerSatisfactionSurveyAnswer();

  private getSurveyAnswers: GetCustomerSatisfactionSurveyAnswers =
    new GetCustomerSatisfactionSurveyAnswers();

  private exportCustomerSatisfactionSurveyAnswers: ExportCustomerSatisfactionSurveyAnswers =
    new ExportCustomerSatisfactionSurveyAnswers();

  async answerSurvey(data: AnswerSurveyData, res) {
    try {
      const response =
        await this.createCustomerSatisfactionSurveyAnswer.execute(data);
      this.sendResponse(response, res, this.STATUSES.SUCCESS_POST);
    } catch (error: unknown) {
      this.handleError(error, res);
    }
  }

  async getSurveyAnswersByTargetAudience(
    data: GetSurveyAnswersByTargetAudienceData,
    res
  ) {
    try {
      const response = await this.getSurveyAnswers.execute(data);
      this.sendResponse(response, res, this.STATUSES.SUCCESS);
    } catch (error: unknown) {
      this.handleError(error, res);
    }
  }

  async exportSurveyAnswersByTargetAudience(
    data: GetSurveyAnswersByTargetAudienceData,
    res
  ) {
    try {
      const response =
        await this.exportCustomerSatisfactionSurveyAnswers.execute(data);

      this.sendResponseCSV(
        response,
        res,
        this.STATUSES.SUCCESS,
        "survey_answers"
      );
    } catch (error: unknown) {
      this.handleError(error, res);
    }
  }
}
