import { BUSINESS_ERRORS } from "../errors/errors";
import CustomerSatisfactionSurveyDescription from "../vo/customer-satisfaction-survey-description";
import CustomerSatisfactionSurveyStatus, {
  SATISFACTION_SURVEY_STATUSES,
} from "../vo/customer-satisfaction-survey-status";
import CustomerSatisfactionSurveyTitle from "../vo/customer-satisfaction-survey-title";
import Email from "../vo/email";
import Rating from "../vo/rating";
import UUID from "../vo/uuid";
import TargetAudience from "./target-audience";

export default class CustomerSatisfactionSurvey {
  private customerSatisfactionSurveyId: UUID;
  private title: CustomerSatisfactionSurveyTitle;
  private description: CustomerSatisfactionSurveyDescription;
  private maxRating: Rating;
  private createdAt?: Date;
  private updatedAt?: Date;
  private status: CustomerSatisfactionSurveyStatus;
  private contactEmail: Email;
  private targetAudience: TargetAudience;

  constructor(
    customerSatisfactionSurveyId: string,
    title: string,
    description: string,
    maxRating: number,
    targetAudience: string,
    status: string,
    contactEmail: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.customerSatisfactionSurveyId = new UUID(customerSatisfactionSurveyId);
    this.title = new CustomerSatisfactionSurveyTitle(title);
    this.description = new CustomerSatisfactionSurveyDescription(description);
    this.maxRating = new Rating(maxRating);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.status = new CustomerSatisfactionSurveyStatus(status);
    this.targetAudience = new TargetAudience(targetAudience);
    this.contactEmail = new Email(contactEmail);
  }

  static create(
    title: string,
    description: string,
    maxRating: number,
    targetAudience: string,
    contactEmail: string,
    updatedAt?: Date,
    feedback?: string
  ) {
    const surveyId = UUID.create();
    if (!targetAudience) {
      throw new Error(BUSINESS_ERRORS.NOT_NULL_TARGET_AUDIENCE);
    }
    return new CustomerSatisfactionSurvey(
      surveyId.Id,
      title,
      description,
      maxRating,
      targetAudience,
      SATISFACTION_SURVEY_STATUSES.ACTIVE,
      contactEmail,
      null,
      updatedAt
    );
  }

  get Title(): string {
    return this.title.Value;
  }
  get Description(): string {
    return this.description.Value;
  }

  get MaxRating(): number {
    return this.maxRating.Rating;
  }
  get TargetAudience(): string {
    return this.targetAudience.Id;
  }
  get Status(): string {
    return this.status.Value;
  }
  get CustomSatisfactionSurveyId(): string {
    return this.customerSatisfactionSurveyId.Id;
  }
  get CreatedAt(): Date | undefined {
    return this.createdAt;
  }
  get UpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  get ContactEmail(): string {
    return this.contactEmail.Value;
  }
}
