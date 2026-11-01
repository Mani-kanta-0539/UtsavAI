/**
 * @file UtsavAI AI Security Firewall & Guardrail Engine
 * Protects chatbot and server routes from prompt injection,
 * jailbreaking, XSS payload injection, and out-of-domain abuse.
 */

export interface FirewallScanResult {
  isSafe: boolean;
  sanitizedText: string;
  action: 'ALLOW' | 'BLOCK';
  reason?: string;
  securityNotice?: string;
}

// Known jailbreak and prompt injection triggers
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior)\s+(instructions|rules)/i,
  /you\s+are\s+now\s+(in\s+)?(developer|dan|unfiltered|jailbroken)\s+mode/i,
  /(reveal|leak|show|print|output)\s+(your\s+)?(system\s+prompt|instructions|initial\s+prompt|api_?key)/i,
  /bypass\s+(all\s+)?(safety|security|content)\s+(filters|guardrails|protocols)/i,
  /(sudo|admin|system)\s+override/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /(\bselect\b.*\bfrom\b|\bdrop\b\s+\btable\b|\bunion\b\s+\bselect\b)/i,
];

// Event & celebration context tokens for domain boundary checking
const DOMAIN_CONTEXT_TOKENS: string[] = [
  'wedding', 'birthday', 'anniversary', 'party', 'event', 'guest', 'venue',
  'cater', 'food', 'decor', 'photo', 'music', 'budget', 'timeline', 'cost',
  'plate', 'buffet', 'invitation', 'dj', 'mandap', 'haldi', 'sangeet',
  'celebration', 'festival', 'vendor', 'discount', 'schedule', 'planning',
  'kid', 'senior', 'elder', 'wheelchair', 'menu', 'rupee', 'saving', 'trade'
];

/**
 * Sanitizes raw user input and screens for prompt injection or malicious payloads.
 * @param input Raw text message from client
 * @returns FirewallScanResult with sanitized text and safety verdict
 */
export function inspectAndSanitizePrompt(input: string): FirewallScanResult {
  if (!input || typeof input !== 'string') {
    return {
      isSafe: false,
      sanitizedText: '',
      action: 'BLOCK',
      reason: 'Empty or invalid payload input',
      securityNotice: 'Security Firewall: Input must be a valid non-empty string.',
    };
  }

  // 1. Strip HTML tags and control chars
  let cleaned = input
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  // 2. Scan for Prompt Injection & Jailbreak attempts
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input) || pattern.test(cleaned)) {
      return {
        isSafe: false,
        sanitizedText: cleaned,
        action: 'BLOCK',
        reason: 'Adversarial Prompt Injection / Jailbreak pattern detected',
        securityNotice:
          '🛡️ [UtsavAI Security Firewall]: Query intercepted. Adversarial prompt injection or security bypass attempt detected. UtsavAI operates strictly within celebration planning guidelines.',
      };
    }
  }

  // 3. Length Guardrail
  if (cleaned.length > 1000) {
    cleaned = cleaned.slice(0, 1000);
  }

  // 4. Out-of-Domain Detection for obvious non-event malicious inquiries
  const lower = cleaned.toLowerCase();
  const hasDomainRelevance = DOMAIN_CONTEXT_TOKENS.some((token) => lower.includes(token));
  const isGenericGreeting = /^(hi|hello|hey|namaste|greetings|help|how are you|who are you)/i.test(lower);

  if (!hasDomainRelevance && !isGenericGreeting && cleaned.length > 50) {
    // Check if query is completely off-topic (e.g. asking to hack, write generic malware, etc.)
    const suspiciousTopics = /(hack|malware|exploit|password|crypto|bitcoin|bypass|leak|crack)/i;
    if (suspiciousTopics.test(lower)) {
      return {
        isSafe: false,
        sanitizedText: cleaned,
        action: 'BLOCK',
        reason: 'Off-domain security violation',
        securityNotice:
          '🛡️ [UtsavAI Security Firewall]: Query flagged as out-of-domain. UtsavAI is exclusively dedicated to event budgets, timelines, catering trade-offs, and celebration architecture.',
      };
    }
  }

  return {
    isSafe: true,
    sanitizedText: cleaned,
    action: 'ALLOW',
  };
}

/**
 * Sanitizes AI-generated output before delivering to client to prevent
 * accidental API key reflection or script injection.
 * @param output Raw AI response
 * @returns Clean, safe string
 */
export function sanitizeAiOutput(output: string): string {
  if (!output) return '';
  return output
    .replace(/AIza[0-9A-Za-z-_]{20,}/g, '[REDACTED_API_KEY]')
    .replace(/AQ\.[0-9A-Za-z-_]{30,}/g, '[REDACTED_CREDENTIAL]')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}
