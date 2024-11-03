import BusinessError from "../../../src/domain/errors/business-error";

export const SATISFACTION_SURVEY_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type SATISFACTION_SURVEY_STATUSES_TYPE =
  (typeof SATISFACTION_SURVEY_STATUSES)[keyof typeof SATISFACTION_SURVEY_STATUSES];

export default class CustomerSatisfactionSurveyStatus {
  private status: SATISFACTION_SURVEY_STATUSES_TYPE;

  constructor(status: string) {
    if (status !== "active" && status !== "inactive")
      throw new BusinessError("Invalid status");
    this.status = status;
  }

  get Value(): SATISFACTION_SURVEY_STATUSES_TYPE {
    return this.status;
  }
}
