import CustomerSatisfactionSurvey from "../../../src/domain/entity/customer-satisfaction-survey";
import CustomerSatisfactionSurveyAnswer from "../../../src/domain/entity/customer-satisfaction-survey-answer";
import DatabaseConnection from "../database/database-connection";
import { inject } from "../di/di";
import AbstractRepository from "./abstract-repository";
import TargetAudience from "../../../src/domain/entity/target-audience";

export interface CustomerSatisfactionSurveyAnswerRepositoryInterface {
  findById(id: string): Promise<CustomerSatisfactionSurveyAnswer>;
  findByTargetAudience(
    targetAudienceId: string,
    orderByRating?: "asc" | "desc"
  ): Promise<CustomerSatisfactionSurveyAnswer[]>;
  create(
    customerSatisfactionSurveyAnswer: CustomerSatisfactionSurveyAnswer
  ): Promise<CustomerSatisfactionSurveyAnswer>;
}

export default class CustomerSatisfactionSurveyAnswerRepository
  extends AbstractRepository
  implements CustomerSatisfactionSurveyAnswerRepositoryInterface
{
  @inject("connection") private connection: DatabaseConnection;
  private schemaTableStatement = ` ${process.env.POSTGRES_SCHEMA}.customer_satisfaction_survey_answer`;

  async create(
    customerSatisfactionSurveyAnswer: CustomerSatisfactionSurveyAnswer
  ): Promise<CustomerSatisfactionSurveyAnswer> {
    const [{ customer_satisfaction_survey_answer_id }] =
      await this.connection?.query(
        `insert into ${this.schemaTableStatement} (customer_satisfaction_survey_answer_id, customer_satisfaction_survey_id, feedback, rating) values ($1, $2, $3, $4) RETURNING customer_satisfaction_survey_answer_id`,
        [
          customerSatisfactionSurveyAnswer.CustomSatisfactionSurveyAnswerId,
          customerSatisfactionSurveyAnswer.CustomerSatisfactionSurvey
            .CustomSatisfactionSurveyId,
          customerSatisfactionSurveyAnswer.Feedback,
          customerSatisfactionSurveyAnswer.Rating,
        ]
      );
    return this.findById(customer_satisfaction_survey_answer_id);
  }

  async findById(id: string): Promise<CustomerSatisfactionSurveyAnswer> {
    const [answer] = await this.connection?.query(
      `select css.customer_satisfaction_survey_id, cssa.customer_satisfaction_survey_answer_id,
       css.title, css.description, css.max_rating, css.target_audience_id,
       css.status, css.contact_email, ta.name as target_audience_name,
       cssa.rating, cssa.feedback, cssa.created_at 
       from  ${this.schemaTableStatement} cssa
       inner join ${process.env.POSTGRES_SCHEMA}.customer_satisfaction_survey css
       on css.customer_satisfaction_survey_id = cssa.customer_satisfaction_survey_id
       inner join ${process.env.POSTGRES_SCHEMA}.target_audience ta on css.target_audience_id = ta.target_audience_id
       where customer_satisfaction_survey_answer_id = $1`,
      [id]
    );

    if (!answer) return null;

    const {
      customer_satisfaction_survey_answer_id,
      customer_satisfaction_survey_id,
      feedback,
      rating,
      created_at,
      title,
      description,
      max_rating,
      target_audience_id,
      contact_email,
      status,
      target_audience_name,
    } =
      (answer as {
        customer_satisfaction_survey_answer_id: string;
        customer_satisfaction_survey_id: string;
        rating: number;
        feedback: string;
        created_at: Date;
        title: string;
        description: string;
        max_rating: number;
        target_audience_id: string;
        contact_email: string;
        status: string;
        target_audience_name: string;
      }) || {};

    return new CustomerSatisfactionSurveyAnswer(
      customer_satisfaction_survey_answer_id,
      rating,
      feedback,
      new CustomerSatisfactionSurvey(
        customer_satisfaction_survey_id,
        title,
        description,
        max_rating,
        new TargetAudience(target_audience_id, target_audience_name),
        status,
        contact_email
      ),
      created_at
    );
  }
  async findByTargetAudience(
    targetAudience: string,
    orderByRating: "asc" | "desc" = "desc"
  ): Promise<CustomerSatisfactionSurveyAnswer[]> {
    const answers = await this.connection?.query(
      `select css.customer_satisfaction_survey_id, cssa.customer_satisfaction_survey_answer_id,
       css.title, css.description, css.max_rating, css.target_audience_id,
       ta.name as target_audience_name, css.status, css.contact_email,
       cssa.rating, cssa.feedback, cssa.created_at  from  ${this.schemaTableStatement} cssa inner join ${process.env.POSTGRES_SCHEMA}.customer_satisfaction_survey css
      on css.customer_satisfaction_survey_id = cssa.customer_satisfaction_survey_id 
      inner join ${process.env.POSTGRES_SCHEMA}.target_audience ta on css.target_audience_id = ta.target_audience_id
       where css.target_audience_id = $1 order by rating ${orderByRating}`,
      [targetAudience]
    );
    if (!answers.length) return [];

    return answers.map(
      (answer: {
        customer_satisfaction_survey_answer_id: string;
        customer_satisfaction_survey_id: string;
        rating: number;
        feedback: string;
        created_at: Date;
        title: string;
        description: string;
        max_rating: number;
        target_audience_id: string;
        contact_email: string;
        status: string;
        target_audience_name;
      }) =>
        new CustomerSatisfactionSurveyAnswer(
          answer.customer_satisfaction_survey_answer_id,
          answer.rating,
          answer.feedback,
          new CustomerSatisfactionSurvey(
            answer.customer_satisfaction_survey_id,
            answer.title,
            answer.description,
            answer.max_rating,
            new TargetAudience(
              answer.target_audience_id,
              answer.target_audience_name
            ),
            answer.status,
            answer.contact_email
          ),
          answer.created_at
        )
    );
  }
}
