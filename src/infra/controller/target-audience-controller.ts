import GetTargetAudience from "../../../src/application/usecase/get-target-audience";
import AbstractController from "./abstract-controller";

export default class TargetAudienceController extends AbstractController {
  private getTargetAudienceUseCase: GetTargetAudience = new GetTargetAudience();

  getTargetAudiences = async (res) => {
    try {
      const response = await this.getTargetAudienceUseCase.execute();
      this.sendResponse(response, res);
    } catch (error: unknown) {
      this.handleError(error, res);
    }
  };
}
