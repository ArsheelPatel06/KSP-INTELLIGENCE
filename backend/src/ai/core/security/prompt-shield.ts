export class PromptShield {
  private static JAILBREAK_PATTERNS = [
    /ignore (?:all )?previous instructions/i,
    /system prompt/i,
    /you are now/i,
    /bypassing/i,
    /forget everything/i,
    /do not follow/i,
    /override/i,
    /jailbreak/i,
    /developer mode/i
  ];

  private static AADHAR_REGEX = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
  private static PAN_REGEX = /\b[A-Z]{5}\d{4}[A-Z]{1}\b/g;
  private static PHONE_REGEX = /\b(?:\+91|91|0)?[6-9]\d{9}\b/g;
  private static EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  /**
   * Evaluates if a prompt contains potential jailbreak or injection attacks.
   */
  public static detectInjection(prompt: string): { isSafe: boolean; reason?: string } {
    if (prompt.length > 5000) {
      return { isSafe: false, reason: 'Prompt exceeds maximum allowed length of 5000 characters.' };
    }

    for (const pattern of this.JAILBREAK_PATTERNS) {
      if (pattern.test(prompt)) {
        return { isSafe: false, reason: 'Potential prompt injection or jailbreak attempt detected.' };
      }
    }

    return { isSafe: true };
  }

  /**
   * Irreversibly masks sensitive information in the provided text.
   */
  public static maskPII(text: string): string {
    let maskedText = text;
    maskedText = maskedText.replace(this.AADHAR_REGEX, '[AADHAR_MASKED]');
    maskedText = maskedText.replace(this.PAN_REGEX, '[PAN_MASKED]');
    maskedText = maskedText.replace(this.PHONE_REGEX, '[PHONE_MASKED]');
    maskedText = maskedText.replace(this.EMAIL_REGEX, '[EMAIL_MASKED]');
    return maskedText;
  }
}
