import UUID from "../vo/uuid";

export default class TargetAudience {
  private targetAudienceId: UUID;
  private name: string;

  constructor(targetAudienceId: string, name?: string) {
    this.targetAudienceId = new UUID(targetAudienceId);
    this.name = name;
  }

  static create(name: string) {
    const targetAudienceId = UUID.create();
    return new TargetAudience(targetAudienceId.Id, name);
  }

  get Id(): string {
    return this.targetAudienceId.Id;
  }

  get Name(): string {
    return this.name;
  }
}
