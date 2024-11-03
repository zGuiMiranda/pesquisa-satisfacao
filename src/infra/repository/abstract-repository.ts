export default class AbstractRepository {
  private static instance: AbstractRepository | null = null;

  protected constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
}
