async function validateUserEmailUsingArcjet(req, email) {
    const arcjet = await import("@arcjet/node");
    const { validateEmail } = arcjet;
  
    const aj = arcjet({
        // Get your site key from https://app.arcjet.com and set it as an environment
        // variable rather than hard coding.
        key: process.env.ARCJET_KEY,
        rules: [
          validateEmail({
            mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
            // block disposable, invalid, and email addresses with no MX records
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
          }),
        ],
      });
  
    const decision = await aj.protect(req, { email });
  
    if (decision.isDenied()) {
      return false;
    }
  
    return true;
  }

  module.exports = validateUserEmailUsingArcjet;