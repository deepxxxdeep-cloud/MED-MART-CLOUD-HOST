/**
 * Client-side mirror of server/src/utils/messageFilter.js.
 *
 * This exists purely so the composer can warn before someone hits send — the
 * server runs the same checks and is the actual enforcement. Keep the two in
 * step; if they drift, the server wins and the user sees a surprise.
 */

const NUMBER_WORDS = {
  zero: "0", oh: "0", o: "0",
  one: "1", two: "2", three: "3", four: "4", five: "5",
  six: "6", seven: "7", eight: "8", nine: "9",
  ek: "1", do: "2", teen: "3", char: "4", paanch: "5",
  chhe: "6", saat: "7", aath: "8", nau: "9", shunya: "0",
};

const CONTACT_KEYWORDS = [
  "whatsapp", "whats app", "wtsp", "watsapp", "wa.me", "telegram",
  "call me", "call us", "text me", "sms me", "reach me at",
  "contact me at", "contact me on", "my number", "mera number",
  "direct deal", "outside platform", "off platform",
];

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const EMAIL_OBFUSCATED_RE =
  /[a-z0-9._%+-]+\s*(?:\(|\[)?\s*(?:at|@)\s*(?:\)|\])?\s*[a-z0-9.-]+\s*(?:\(|\[)?\s*(?:dot|\.)\s*(?:\)|\])?\s*[a-z]{2,}/i;
const URL_RE = /\b(?:https?:\/\/|www\.)\S+/i;
const DOMAIN_RE =
  /\b[a-z0-9][a-z0-9-]{1,}\s*(?:\.|\(dot\)|\[dot\]|\sdot\s)\s*(?:com|in|net|org|co|io|me|shop|store|biz|info)\b/i;

function normalise(text) {
  let out = String(text ?? "").toLowerCase();
  out = out.replace(/\b([a-z]+)\b/g, (w) => NUMBER_WORDS[w] ?? w);
  const SEP = /(\d)[\s.\-*_+()#,|/\\]{1,2}(\d)/g;
  let prev;
  do {
    prev = out;
    out = out.replace(SEP, "$1$2");
  } while (out !== prev);
  return out;
}

function hasPhone(norm) {
  for (const run of norm.match(/\d{10,}/g) || []) {
    if (/^[6-9]\d{9}$/.test(run)) return true;
    if (/^0{0,2}91[6-9]\d{9}$/.test(run)) return true;
    if (/^0[6-9]\d{9}$/.test(run)) return true;
  }
  return false;
}

export const POLICY_MESSAGE =
  "For your safety, sharing contact details or external links isn't allowed. " +
  "Keeping communication and payment on Med-Mart is what protects your order, " +
  "your warranty and your money if anything goes wrong.";

export function checkMessage(content) {
  const raw = String(content ?? "");
  const norm = normalise(raw);
  const codes = [];

  if (hasPhone(norm)) codes.push("phone");
  if (EMAIL_RE.test(raw) || EMAIL_OBFUSCATED_RE.test(raw)) codes.push("email");
  if (URL_RE.test(raw) || DOMAIN_RE.test(raw)) codes.push("link");
  if (CONTACT_KEYWORDS.some((k) => raw.toLowerCase().includes(k))) codes.push("contact_keyword");

  const LABEL = {
    phone: "a phone number",
    email: "an email address",
    link: "an external link",
    contact_keyword: "contact details",
  };

  return {
    allowed: codes.length === 0,
    codes,
    reason: codes.length
      ? `This looks like it contains ${[...new Set(codes.map((c) => LABEL[c]))].join(" and ")}.`
      : null,
  };
}
