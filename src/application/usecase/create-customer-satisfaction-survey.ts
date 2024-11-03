import TargetAudience from "../../../src/domain/entity/target-audience";
import CustomerSatisfactionSurvey from "../../../src/domain/entity/customer-satisfaction-survey";
import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../../../src/domain/errors/errors";
import { inject } from "../../../src/infra/di/di";
import { RepositoryInterface } from "../../../src/infra/repository/repository-interface";
import { TargetAudienceRepositoryInterface } from "../../../src/infra/repository/target-audience-repository";

export default class CreateCustomerSatisfactionSurvey {
  @inject("customerSatisfactionSurveyRepository")
  private customerSatisfactionSurveyRepository: RepositoryInterface<CustomerSatisfactionSurvey>;
  @inject("targetAudienceRepository")
  private targetAudienceRepository: TargetAudienceRepositoryInterface;
  async execute(input: Input): Promise<Output> {
    const survey = CustomerSatisfactionSurvey.create(
      input.title,
      input.description,
      input.maxRating,
      new TargetAudience(input.targetAudienceId),
      input.contactEmail
    );

    const getTargetAudience = await this.targetAudienceRepository.findById(
      input.targetAudienceId
    );

    if (!getTargetAudience)
      throw new BusinessError(BUSINESS_ERRORS.TARGET_AUDIENCE_NOT_FOUND);

    const response = await this.customerSatisfactionSurveyRepository.create(
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
      status: response.Status,
    };
  }
}
type Input = {
  title: string;
  description: string;
  maxRating: number;
  targetAudienceId: string;
  contactEmail: string;
};

export type Output = {
  id: string;
  title: string;
  description: string;
  maxRating: number;
  targetAudienceId: string;
  contactEmail: string;
  createdAt: Date;
  status: string;
};
