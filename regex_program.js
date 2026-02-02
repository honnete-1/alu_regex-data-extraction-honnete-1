const fs = require("fs");

// Read input file
const Text = fs.readFileSync("sample.txt", "utf8");

// Regex patterns 

const patterns = {
    // Email pattern explanations: the pattern requires at least one character before 
    // and after '@' and prevents emails starting or ending with dots or hyphens
    // it forces a valid top-level domain (e.g: .com, .org,etc)
    // is strict to avoid matching broken inputs like user@.com   
 
    emails: /\b[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}\b/g,

    // URL pattern explanations:The pattern Only matches URLs 
    // with http or https protocol and
    // Avoids matching malformed URLs like https:/example.com

    urls: /https?:\/\/(?:www\.)?[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g,

    // Phone number pattern explanations: It supports 
    // optional international prefix (e.g. +1) 
    // and accepts formats like (123) 456-7890 or 123-456-7890

    phoneNumbers: /(?:\+\d{1,3}[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}\b/g,

    // Credit card pattern explanations: 
    // It matches standard 16-digit cards with spaces or hyphens and 
    // also supports alternative grouping

    creditCards: /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b\d{4}[-\s]?\d{6}[-\s]?\d{5}\b/g,

    // Time pattern explanations: 
    // It supports 24-hour format (e.g. 14:30), supports 12-hour format 
    // with AM/PM (e.g. 02:45 PM) and some invalid combinations are 
    // filtered later in validation logic

    time: /\b(?:[01]?\d|2[0-3]):[0-5]\d(?:\s?(?:AM|PM|am|pm))?\b/g,

    // HTML tag pattern explanations:
    // It matches opening and self-closing HTML tags, supports attributes 
    // with quoted or unquoted values, and is used only for 
    // extraction, not for parsing or sanitizing HTML

    htmlTags: /<[a-zA-Z][a-zA-Z0-9]*(?:\s+[a-zA-Z][a-zA-Z0-9-]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*\/?>/gi,

    // Hashtag pattern: Must start with a letter and allows 
    // numbers and underscores after, and prevents matching broken hashtags like ##    
    hashtags: /#[a-zA-Z][a-zA-Z0-9_]*\b/g,

    // Currency pattern: Matches dollar amounts with optional comma separators, 
    // Requires two decimal places 
    // when cents are present, and Intentionally rejects malformed values like $12,34.56
    
    currency: /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b/g
};

// Mask email (hide username)
function hideEmail(email) {
  const parts = email.split("@");
  return "*****@" + parts[1];
}

// Mask credit card (show only last 4 digits)
function hideCreditCard(card) {
  const digitsOnly = card.replace(/\D/g, "");
  const last4 = digitsOnly.slice(-4);
  return "**** **** **** " + last4;
}

// Extract matches
const results = {
  emails: (Text.match(patterns.emails) || []).map(hideEmail),
  urls: Text.match(patterns.urls) || [],
  phoneNumbers: Text.match(patterns.phoneNumbers) || [],
  creditCards: (Text.match(patterns.creditCards) || []).map(hideCreditCard),
  time: Text.match(patterns.time) || [],
  htmlTags: Text.match(patterns.htmlTags) || [],
  hashtags: Text.match(patterns.hashtags) || [],
  currency: Text.match(patterns.currency) || []
};

// Write to JSON file
fs.writeFileSync(
  "extracted_data.json",
  JSON.stringify(results, null, 2),
  "utf8"
);

console.log("Data extracted successfully to extracted_data.json");
