import BusinessError from "../../../src/domain/errors/business-error";
import { BUSINESS_ERRORS } from "../errors/errors";
import { AbstractSatisfactionSurveyInformation } from "../../../src/domain/entity/abstract-satisfaction-survey-information";

export default class CustomerSatisfactionSurveyTitle extends AbstractSatisfactionSurveyInformation {
  private title: string;
  constructor(title: string, minWords: number = 3) {
    super(minWords);
    if (!title || !this.validateWordsCount(title))
      throw new BusinessError(BUSINESS_ERRORS.INVALID_TITLE);
    this.title = title;
  }

  get Value(): string {
    return this.title;
  }
}
