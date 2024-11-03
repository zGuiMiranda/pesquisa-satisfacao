import UpdateCustomerSatisfactionSurvey from "../../../src/application/usecase/update-customer-satisfaction-survey";
import CreateCustomerSatisfactionSurvey from "../../../src/application/usecase/create-customer-satisfaction-survey";
import AbstractController from "./AbstractController";

export type CreateSurveyData = {
  title: string;
  description: string;
  maxRating: number;
  targetAudienceId: string;
  contactEmail: string;
};

export type UpdateSurveyData = {
  id: string;
  title: string;
  description: string;
  maxRating: number;
  targetAudienceId: string;
  contactEmail: string;
  status: string;
};

export default class CustomerSatisfactionSurveyController extends AbstractController {
  private createCostumerSurvey: CreateCustomerSatisfactionSurvey =
    new CreateCustomerSatisfactionSurvey();

  private updateCostumerSurvey: UpdateCustomerSatisfactionSurvey =
    new UpdateCustomerSatisfactionSurvey();

  async createSurvey(data: CreateSurveyData, res) {
    try {
      const response = await this.createCostumerSurvey.execute(data);
      this.sendResponse(response, res, this.STATUSES.SUCCESS_POST);
    } catch (error: unknown) {
      this.handleError(error, res);
    }
  }

  async updateSurvey(data: UpdateSurveyData, res) {
    try {
      const response = await this.updateCostumerSurvey.execute(data);
      this.sendResponse(response, res, this.STATUSES.SUCCESS_POST);
    } catch (error: unknown) {
      this.handleError(error, res);
    }
  }
}
