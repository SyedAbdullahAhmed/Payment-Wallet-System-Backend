async function validateUserEmailUsingArcjet(req, email) {
  // Import the Arcjet SDK properly
  const Arcjet = await import("@arcjet/node");
  
  // Create the Arcjet client - the main export is the default constructor
  const aj = new Arcjet.default({
    // Get your site key from https://app.arcjet.com and set it as an environment
    // variable rather than hard coding.
    key: process.env.ARCJET_KEY,
    rules: [
      Arcjet.validateEmail({
        mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
        // block disposable, invalid, and email addresses with no MX records
        deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      }),
    ],
  });

  // Use the client to protect the request
  const decision = await aj.protect(req, { email });

  if (decision.isDenied()) {
    return false;
  }

  return true;
}

module.exports = validateUserEmailUsingArcjet;