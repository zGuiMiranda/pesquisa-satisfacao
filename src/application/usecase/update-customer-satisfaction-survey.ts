import CustomerSatisfactionSurvey from "../../../src/domain/entity/customer-satisfaction-survey";
import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../../../src/domain/errors/errors";
import { inject } from "../../../src/infra/di/di";
import { RepositoryInterface } from "../../../src/infra/repository/repository-interface";
import { TargetAudienceRepositoryInterface } from "../../../src/infra/repository/target-audience-repository";
import TargetAudience from "../../../src/domain/entity/target-audience";

export default class UpdateCustomerSatisfactionSurvey {
  @inject("customerSatisfactionSurveyRepository")
  private customerSatisfactionSurveyRepository: RepositoryInterface<CustomerSatisfactionSurvey>;
  @inject("targetAudienceRepository")
  private targetAudienceRepository: TargetAudienceRepositoryInterface;
  async execute(input: Input): Promise<Output> {
    if (!input.id) throw new BusinessError(BUSINESS_ERRORS.INVALID_ID);

    const surveyFromDatabase =
      await this.customerSatisfactionSurveyRepository.findById(input.id);

    if (!surveyFromDatabase)
      throw new BusinessError(
        BUSINESS_ERRORS.CUSTOMER_SATISFACTION_SURVEY_NOT_FOUND
      );

    const survey = new CustomerSatisfactionSurvey(
      input.id,
      input.title,
      input.description,
      input.maxRating,
      new TargetAudience(input.targetAudienceId),
      input.status,
      input.contactEmail,
      null,
      new Date()
    );

    const getTargetAudience = await this.targetAudienceRepository.findById(
      input.targetAudienceId
    );

    if (!getTargetAudience)
      throw new BusinessError(BUSINESS_ERRORS.TARGET_AUDIENCE_NOT_FOUND);

    const response = await this.customerSatisfactionSurveyRepository.update(
      survey
    );

    return {
      id: response.CustomSatisfactionSurveyId,
      title: response.Title,
      description: response.Description,
      maxRating: response.MaxRating,
      contactEmail: response.ContactEmail,
      createdAt: response.CreatedAt,
      targetAudienceId: response.TargetAudience.Id,
      updatedAt: response.UpdatedAt,
    };
  }
}
type Input = {
  id: string;
  title: string;
  description: string;
  maxRating: number;
  targetAudienceId: string;
  contactEmail: string;
  status: string;
};

type Output = {
  id: string;
  title: string;
  description: string;
  maxRating: number;
  targetAudienceId: string;
  contactEmail: string;
  createdAt: Date;
  updatedAt: Date;
};
