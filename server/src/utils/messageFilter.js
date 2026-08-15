/**
 * Detects attempts to move a conversation off-platform.
 *
 * The hard part isn't matching a phone number — it's matching one that has
 * been deliberately disguised, without also flagging the prices, quantities
 * and GST numbers that fill legitimate B2B messages. So the text is first
 * normalised (number words to digits, separators between digits removed),
 * then patterns run against both the raw and normalised forms.
 *
 * Anything changed here should be run against messageFilter.test.mjs, which
 * covers both the evasion tricks and the false positives worth protecting.
 */

const NUMBER_WORDS = {
  zero: "0", oh: "0", o: "0", nought: "0",
  one: "1", two: "2", three: "3", four: "4", five: "5",
  six: "6", seven: "7", eight: "8", nine: "9",
  // Hindi/Hinglish digits show up constantly on an Indian marketplace
  ek: "1", do: "2", teen: "3", char: "4", paanch: "5",
  chhe: "6", saat: "7", aath: "8", nau: "9", shunya: "0",
};

const CONTACT_KEYWORDS = [
  "whatsapp", "whats app", "wtsp", "watsapp", "wa.me",
  "telegram", "signal app", "imo app",
  "call me", "call us", "ring me", "phone me", "text me", "sms me",
  "reach me at", "contact me at", "contact me on", "reach out on",
  "my number", "mera number", "number hai", "number de",
  "direct deal", "outside platform", "off platform",
];

// Standard-ish email, plus obfuscations like "name (at) domain (dot) com".
const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const EMAIL_OBFUSCATED_RE =
  /[a-z0-9._%+-]+\s*(?:\(|\[)?\s*(?:at|@)\s*(?:\)|\])?\s*[a-z0-9.-]+\s*(?:\(|\[)?\s*(?:dot|\.)\s*(?:\)|\])?\s*[a-z]{2,}/i;

const URL_RE = /\b(?:https?:\/\/|www\.)\S+/i;
// Bare domains — restricted to real-looking TLDs so "5.5 cm" or "v2.0" pass.
const DOMAIN_RE =
  /\b[a-z0-9][a-z0-9-]{1,}\s*(?:\.|\(dot\)|\[dot\]|\sdot\s)\s*(?:com|in|net|org|co|io|me|shop|store|biz|info)\b/i;

/**
 * Collapse number words and strip separators sitting between digits, so
 * "nine eight 7-6*5 4 3 2 1 0" becomes "9876543210".
 */
function normalise(text) {
  let out = text.toLowerCase();

  // Number words → digits, only as whole words.
  out = out.replace(/\b([a-z]+)\b/g, (word) => NUMBER_WORDS[word] ?? word);

  // Repeatedly join digits separated by one or two "noise" characters.
  // Comma is included because "98,765,43210" is a common dodge; the phone
  // pattern below is strict enough that prices like 2,50,000 stay safe.
  const SEPARATOR = /(\d)[\s.\-*_+()#,|/\\]{1,2}(\d)/g;
  let previous;
  do {
    previous = out;
    out = out.replace(SEPARATOR, "$1$2");
  } while (out !== previous);

  return out;
}

/**
 * An Indian mobile is 10 digits starting 6-9, optionally with a 91/+91
 * country code. Requiring that shape — rather than "10 digits anywhere" —
 * is what keeps order IDs and amounts from tripping the filter.
 */
function findPhone(normalised) {
  const candidates = normalised.match(/\d{10,}/g) || [];
  for (const run of candidates) {
    if (/^[6-9]\d{9}$/.test(run)) return run;
    if (/^(?:0|91)([6-9]\d{9})$/.test(run)) return run;
    // A longer run still hides a mobile if it starts with a country code.
    const m = run.match(/^(?:0{0,2}91)([6-9]\d{9})$/);
    if (m) return run;
  }
  return null;
}

const RULES = [
  {
    code: "phone",
    label: "a phone number",
    test: (raw, norm) => findPhone(norm),
  },
  {
    code: "email",
    label: "an email address",
    test: (raw) => {
      const m = raw.match(EMAIL_RE) || raw.match(EMAIL_OBFUSCATED_RE);
      return m ? m[0] : null;
    },
  },
  {
    code: "link",
    label: "an external link",
    test: (raw) => {
      const m = raw.match(URL_RE) || raw.match(DOMAIN_RE);
      return m ? m[0] : null;
    },
  },
  {
    code: "contact_keyword",
    label: "contact details",
    test: (raw) => {
      const lower = raw.toLowerCase();
      return CONTACT_KEYWORDS.find((k) => lower.includes(k)) || null;
    },
  },
];

export const POLICY_MESSAGE =
  "For your safety, sharing contact details or external links isn't allowed. " +
  "Keeping communication and payment on Med-Mart is what protects your order, " +
  "your warranty and your money if anything goes wrong.";

/**
 * @returns {{ allowed: boolean, violations: Array<{code,label,match}>, reason?: string }}
 */
export function inspectMessage(content) {
  const raw = String(content ?? "");
  const norm = normalise(raw);

  const violations = [];
  for (const rule of RULES) {
    const match = rule.test(raw, norm);
    if (match) violations.push({ code: rule.code, label: rule.label, match: String(match) });
  }

  if (violations.length === 0) return { allowed: true, violations: [] };

  const labels = [...new Set(violations.map((v) => v.label))];
  return {
    allowed: false,
    violations,
    reason: `This message looks like it contains ${labels.join(" and ")}.`,
  };
}

/**
 * Alternative to blocking: keep the message but redact the offending spans.
 *
 * We default to blocking because redaction quietly teaches people which
 * disguises slip through — a partly-delivered message still gets the intent
 * across, and the sender learns to try again. Blocking is unambiguous.
 * Exposed here so the policy can be switched without rewriting detection.
 */
export function redactMessage(content) {
  const { violations } = inspectMessage(content);
  let out = String(content ?? "");
  for (const v of violations) {
    if (v.match) out = out.split(v.match).join("[removed]");
  }
  return out;
}
