import UUID from "../vo/uuid";

export default class TargetAudience {
  private targetAudienceId: UUID;

  constructor(targetAudienceId: string) {
    this.targetAudienceId = new UUID(targetAudienceId);
  }

  static create() {
    const targetAudienceId = UUID.create();
    return new TargetAudience(targetAudienceId.Id);
  }

  get Id(): string {
    return this.targetAudienceId.Id;
  }
}
