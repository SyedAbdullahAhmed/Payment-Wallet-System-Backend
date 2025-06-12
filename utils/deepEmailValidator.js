const validate = require('deep-email-validator');

/**
 * Validates an email address using deep-email-validator.
 * @param {string} email - The email address to validate.
 * @returns {Promise<boolean>} - Returns true if the email is valid, false otherwise.
 */
async function validateEmail(email) {
  try {
    // Check if email is provided and is a string
    if (!email || typeof email !== 'string') {
      return false;
    }

    // Perform email validation with all checks enabled
    const result = await validate({
      email,
      validateRegex: true,
      validateMx: true,
      validateTypo: true,
      validateDisposable: true,
      validateSMTP: true,
    });

    // Return true only if all validators pass (valid is true)
    return result.valid === true;
  } catch (error) {
    // Log error for debugging (in production, use a proper logging service)
    console.error(`Email validation error for ${email}:`, error.message);
    return false; // Return false on any error to be safe
  }
}

module.exports = validateEmail;