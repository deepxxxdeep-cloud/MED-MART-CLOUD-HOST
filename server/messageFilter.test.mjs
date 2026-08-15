// Run: node messageFilter.test.mjs
import { inspectMessage } from "./src/utils/messageFilter.js";

let pass = 0;
let fail = 0;

function shouldBlock(text, why) {
  const r = inspectMessage(text);
  if (r.allowed) {
    fail++;
    console.log(`  MISS  ${why}\n        "${text}"`);
  } else {
    pass++;
  }
}

function shouldAllow(text, why) {
  const r = inspectMessage(text);
  if (!r.allowed) {
    fail++;
    console.log(
      `  FALSE POSITIVE  ${why}\n        "${text}"\n        matched: ${JSON.stringify(r.violations)}`
    );
  } else {
    pass++;
  }
}

console.log("\nShould be blocked\n");

// Plain phone numbers
shouldBlock("Call me on 9876543210", "plain 10-digit mobile");
shouldBlock("My number is +91 98765 43210", "country code + spaces");
shouldBlock("reach me 098765 43210", "leading zero");
shouldBlock("9876-543-210 is my cell", "dashes");
shouldBlock("98.765.43210", "dots");
shouldBlock("Ph: 91-9876543210", "91 prefix with dash");

// Evasion
shouldBlock("9 8 7 6 5 4 3 2 1 0", "digits spaced out");
shouldBlock("98-76*54-32-10", "special characters inserted");
shouldBlock("nine eight seven six five four three two one zero", "spelled out in words");
shouldBlock("nau aath saat chhe paanch char teen do ek shunya", "spelled out in Hinglish");
shouldBlock("98,765,43210", "comma separated");
shouldBlock("9876543210", "bare number with no context");

// Email
shouldBlock("Mail me at rahul@example.com", "plain email");
shouldBlock("rahul (at) example (dot) com", "obfuscated email");
shouldBlock("sales.team@precisionsurgico.in", "email with dots in local part");

// Links
shouldBlock("Visit https://mystore.com/catalogue", "https link");
shouldBlock("check www.mysite.in", "www link");
shouldBlock("find us at mystore.com", "bare domain");
shouldBlock("wa.me/919876543210", "whatsapp short link");

// Keywords
shouldBlock("Ping me on WhatsApp", "whatsapp keyword");
shouldBlock("Let's do a direct deal outside platform", "bypass intent");
shouldBlock("Call us for a better rate", "call me keyword");
shouldBlock("mera number save kar lo", "hinglish number keyword");

console.log("\nShould be allowed — ordinary B2B messages\n");

shouldAllow("We need 40 kits, please quote your best bulk price.", "quantity");
shouldAllow("Price is ₹2,50,000 per unit including GST.", "formatted price");
shouldAllow("Our GSTIN is 07AABCP1234M1Z5 for the invoice.", "GSTIN");
shouldAllow("Delivery to Okhla Phase II, New Delhi 110020.", "pincode");
shouldAllow("Order MM-2026-004821 was dispatched yesterday.", "order id");
shouldAllow("MOQ is 50 units, lead time 15 days.", "moq and lead time");
shouldAllow("Blade size 5.5 cm, pack of 100.", "decimal measurement");
shouldAllow("We supply 500 boxes, 250 sets and 100 kits monthly.", "several quantities in a list");
shouldAllow("Certified to ISO 13485 and CE marking standards.", "certification numbers");
shouldAllow("Can you share the quotation through Med-Mart?", "mentions the platform");
shouldAllow("Warranty is 24 months from the date of delivery.", "duration");
shouldAllow("Discount of 12% applies above 200 units.", "percentage");
shouldAllow("Model PS-KIT-20, batch 2026-A17.", "model and batch codes");
shouldAllow("Payment terms 30 days net after delivery.", "payment terms");

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
