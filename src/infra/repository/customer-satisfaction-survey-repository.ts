import TargetAudience from "../../../src/domain/entity/target-audience";
import CustomerSatisfactionSurvey from "../../../src/domain/entity/customer-satisfaction-survey";
import { SATISFACTION_SURVEY_STATUSES_TYPE } from "../../../src/domain/vo/customer-satisfaction-survey-status";
import DatabaseConnection from "../database/database-connection";
import { inject } from "../di/di";
import AbstractRepository from "./abstract-repository";
import { RepositoryInterface } from "./repository-interface";

export default class CustomerSatisfactionSurveyRepository
  extends AbstractRepository
  implements RepositoryInterface<CustomerSatisfactionSurvey>
{
  @inject("connection") private connection: DatabaseConnection;

  private schemaTableStatement = ` ${process.env.POSTGRES_SCHEMA}.customer_satisfaction_survey `;
  async create(
    customerSatisfactionSurvey: CustomerSatisfactionSurvey
  ): Promise<CustomerSatisfactionSurvey> {
    const [{ customer_satisfaction_survey_id }] = await this.connection?.query(
      `insert into ${this.schemaTableStatement} (customer_satisfaction_survey_id, target_audience_id, title, description, max_rating, contact_email, status) values ($1, $2, $3, $4, $5, $6, $7) RETURNING customer_satisfaction_survey_id`,
      [
        customerSatisfactionSurvey.CustomSatisfactionSurveyId,
        customerSatisfactionSurvey.TargetAudience.Id,
        customerSatisfactionSurvey.Title,
        customerSatisfactionSurvey.Description,
        customerSatisfactionSurvey.MaxRating,
        customerSatisfactionSurvey.ContactEmail,
        customerSatisfactionSurvey.Status,
      ]
    );
    return this.findById(customer_satisfaction_survey_id);
  }

  async update(
    customerSatisfactionSurvey: CustomerSatisfactionSurvey
  ): Promise<CustomerSatisfactionSurvey> {
    await this.connection.query(
      `update ${this.schemaTableStatement} set title = $1, description = $2, contact_email = $3, max_rating = $4,
       updated_at = $5, target_audience_id = $6 where customer_satisfaction_survey_id = $7`,
      [
        customerSatisfactionSurvey.Title,
        customerSatisfactionSurvey.Description,
        customerSatisfactionSurvey.ContactEmail,
        customerSatisfactionSurvey.MaxRating,
        customerSatisfactionSurvey.UpdatedAt,
        customerSatisfactionSurvey.CustomSatisfactionSurveyId,
        customerSatisfactionSurvey.TargetAudience.Id,
      ]
    );
    return this.findById(customerSatisfactionSurvey.CustomSatisfactionSurveyId);
  }

  async findById(id: string): Promise<CustomerSatisfactionSurvey> {
    const [survey] = await this.connection?.query(
      `select css.customer_satisfaction_survey_id,
       css.title, css.description, css.max_rating, css.target_audience_id,
       ta.name as target_audience_name, css.status, css.contact_email,css.created_at, css.updated_at       
        from  ${this.schemaTableStatement} css
      inner join ${process.env.POSTGRES_SCHEMA}.target_audience ta on css.target_audience_id = ta.target_audience_id
      where customer_satisfaction_survey_id = $1`,
      [id]
    );

    if (!survey) return null;

    const {
      customer_satisfaction_survey_id,
      title,
      description,
      max_rating,
      target_audience_id,
      status,
      contact_email,
      updated_at,
      created_at,
      name,
    } =
      (survey as {
        customer_satisfaction_survey_id: string;
        title: string;
        description: string;
        max_rating: number;
        target_audience: string;
        status: SATISFACTION_SURVEY_STATUSES_TYPE;
        contact_email: string;
        updated_at: Date;
        created_at: Date;
        target_audience_id: string;
        name: string;
      }) || {};

    return new CustomerSatisfactionSurvey(
      customer_satisfaction_survey_id,
      title,
      description,
      max_rating,
      new TargetAudience(target_audience_id, name),
      status,
      contact_email,
      created_at,
      updated_at
    );
  }
}
