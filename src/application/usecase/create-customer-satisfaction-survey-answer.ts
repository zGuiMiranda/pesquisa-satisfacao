import CustomerSatisfactionSurvey from "../../../src/domain/entity/customer-satisfaction-survey";
import CustomerSatisfactionSurveyAnswer from "../../../src/domain/entity/customer-satisfaction-survey-answer";
import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../../../src/domain/errors/errors";
import { inject } from "../../../src/infra/di/di";
import { CustomerSatisfactionSurveyAnswerRepositoryInterface } from "../../../src/infra/repository/customer-satisfaction-survey-answer-repository";
import { RepositoryInterface } from "../../../src/infra/repository/repository-interface";

export default class CreateCustomerSatisfactionSurveyAnswer {
  @inject("customerSatisfactionSurveyRepository")
  private customerSatisfactionSurveyRepository: RepositoryInterface<CustomerSatisfactionSurvey>;
  @inject("customerSatisfactionSurveyAnswerRepository")
  private customerSatisfactionSurveyAnswerRepository: CustomerSatisfactionSurveyAnswerRepositoryInterface;
  async execute(input: Input): Promise<Output> {
    const surveyFromDatabase =
      await this.customerSatisfactionSurveyRepository.findById(
        input.customerSatisfactionSurveyId
      );

    if (!surveyFromDatabase)
      throw new BusinessError(
        BUSINESS_ERRORS.CUSTOMER_SATISFACTION_SURVEY_NOT_FOUND
      );

    if (surveyFromDatabase.MaxRating < input.rating) {
      throw new BusinessError(BUSINESS_ERRORS.RATING_GREATER_THAN_ALLOWED);
    }

    const answer = CustomerSatisfactionSurveyAnswer.create(
      input.customerSatisfactionSurveyId,
      input.rating,
      input.feedback
    );

    const answerResponse =
      await this.customerSatisfactionSurveyAnswerRepository.create(answer);

    return {
      customerSatisfactionSurveyAnswerId:
        answerResponse.CustomSatisfactionSurveyAnswerId,
      customerSatisfactionSurveyId: answerResponse.CustomSatisfactionSurveyId,
      feedback: answerResponse.Feedback,
      rating: answerResponse.Rating,
      createdAt: answerResponse.CreatedAt,
    };
  }
}
type Input = {
  customerSatisfactionSurveyId: string;
  feedback: string;
  rating: number;
};

export type Output = {
  customerSatisfactionSurveyAnswerId: string;
  customerSatisfactionSurveyId: string;
  feedback: string;
  rating: number;
  createdAt: Date;
};
