import { inject } from "../../../src/infra/di/di";
import { TargetAudienceRepositoryInterface } from "../../../src/infra/repository/target-audience-repository";

export default class GetTargetAudience {
  @inject("targetAudienceRepository")
  private targetAudienceRepository: TargetAudienceRepositoryInterface;
  async execute(): Promise<Output> {
    const response = await this.targetAudienceRepository.findAll();

    return {
      ids: response.map((targetAudience) => targetAudience.Id),
    };
  }
}

type Output = {
  ids: string[];
};
