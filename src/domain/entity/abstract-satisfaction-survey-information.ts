export abstract class AbstractSatisfactionSurveyInformation {
  private minWords: number;

  constructor(minWords: number) {
    this.minWords = minWords;
  }
  protected validateWordsCount(text: string): boolean {
    const words = text.trim().split(/\s+/);
    if (words.length < this.minWords) return false;
    return true;
  }
}
