import crypto from "crypto";
import { BUSINESS_ERRORS } from "../errors/errors";

export default class UUID {
  private value: string;

  constructor(value: string) {
    if (!this.isValidUUID(value)) throw new Error(BUSINESS_ERRORS.INVALID_UUID);
    this.value = value;
  }

  static create() {
    const uuid = crypto.randomUUID();
    return new UUID(uuid);
  }

  get Id() {
    return this.value;
  }

  private isValidUUID(uuid: string): boolean {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
  }
}
