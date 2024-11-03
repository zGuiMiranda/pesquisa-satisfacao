import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../../../src/domain/errors/errors";
import { inject } from "../../../src/infra/di/di";
import { CustomerSatisfactionSurveyAnswerRepositoryInterface } from "../../../src/infra/repository/customer-satisfaction-survey-answer-repository";
import { TargetAudienceRepositoryInterface } from "../../../src/infra/repository/target-audience-repository";

export default class GetCustomerSatisfactionSurveyAnswers {
  @inject("customerSatisfactionSurveyAnswerRepository")
  private customerSatisfactionSurveyAnswerRepository: CustomerSatisfactionSurveyAnswerRepositoryInterface;
  @inject("targetAudienceRepository")
  private targetAudienceRepository: TargetAudienceRepositoryInterface;
  async execute(input: Input): Promise<Output> {
    const getTargetAudience = await this.targetAudienceRepository.findById(
      input.targetAudienceId
    );

    if (!getTargetAudience)
      throw new BusinessError(BUSINESS_ERRORS.TARGET_AUDIENCE_NOT_FOUND);

    const response =
      await this.customerSatisfactionSurveyAnswerRepository.findByTargetAudience(
        input.targetAudienceId,
        input.order
      );

    return response.map((answer) => ({
      id: answer.CustomSatisfactionSurveyAnswerId,
      customerSatisfactioNSurvey: answer.CustomSatisfactionSurveyId,
      feedback: answer.Feedback,
      rating: answer.Rating,
      createdAt: answer.CreatedAt,
    }));
  }
}
type Input = { targetAudienceId: string; order?: "asc" | "desc" };
type Output = {
  id: string;
  customerSatisfactioNSurvey: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}[];
