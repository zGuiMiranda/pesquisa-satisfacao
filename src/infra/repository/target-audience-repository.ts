import TargetAudience from "../../../src/domain/entity/target-audience";
import DatabaseConnection from "../database/database-connection";
import { inject } from "../di/di";
import AbstractRepository from "./abstract-repository";

export interface TargetAudienceRepositoryInterface {
  findById(id: string): Promise<TargetAudience>;
  findAll(): Promise<TargetAudience[]>;
}

export default class TargetAudienceRepository
  extends AbstractRepository
  implements TargetAudienceRepositoryInterface
{
  @inject("connection") private connection: DatabaseConnection;

  async findAll(): Promise<TargetAudience[]> {
    const targetAudience = await this.connection?.query(
      `select * from  ${process.env.POSTGRES_SCHEMA}.target_audience`
    );
    return targetAudience.map(
      (ta: { target_audience_id: string; name: string }) =>
        new TargetAudience(ta.target_audience_id, ta.name)
    );
  }

  async findById(id: string): Promise<TargetAudience> {
    const [targetAudience] = await this.connection?.query(
      `select * from  ${process.env.POSTGRES_SCHEMA}.target_audience where target_audience_id = $1`,
      [id]
    );

    if (!targetAudience) return null;

    const { target_audience_id, name } =
      (targetAudience as {
        target_audience_id: string;
        name: string;
      }) || {};

    return new TargetAudience(target_audience_id, name);
  }
}
