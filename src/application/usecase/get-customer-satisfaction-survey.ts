import CustomerSatisfactionSurvey from "../../../src/domain/entity/customer-satisfaction-survey";
import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../../../src/domain/errors/errors";
import { inject } from "../../../src/infra/di/di";
import { RepositoryInterface } from "../../../src/infra/repository/repository-interface";

export default class GetCustomerSatisfactionSurvey {
  @inject("customerSatisfactionSurveyRepository")
  private customerSatisfactionSurveyRepository: RepositoryInterface<CustomerSatisfactionSurvey>;
  async execute(input: Input): Promise<Output> {
    const response = await this.customerSatisfactionSurveyRepository.findById(
      input.id
    );

    if (!response)
      throw new BusinessError(
        BUSINESS_ERRORS.CUSTOMER_SATISFACTION_SURVEY_NOT_FOUND
      );

    return {
      id: response.CustomSatisfactionSurveyId,
    };
  }
}
type Input = { id: string };
type Output = {
  id: string;
};
