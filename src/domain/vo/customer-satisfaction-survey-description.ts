import { AbstractSatisfactionSurveyInformation } from "../../../src/domain/entity/abstract-satisfaction-survey-information";
import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../errors/errors";

export default class CustomerSatisfactionSurveyDescription extends AbstractSatisfactionSurveyInformation {
  private description: string;
  constructor(description: string, minWords: number = 5) {
    super(minWords);
    if (!description || !this.validateWordsCount(description))
      throw new BusinessError(BUSINESS_ERRORS.INVALID_DESCRIPTION);
    this.description = description;
  }

  get Value(): string {
    return this.description;
  }
}
