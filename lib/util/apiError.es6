/**
 * Represents a API error.
 * @class
 */
class ApiError extends Error {

  /**
   * @constructor
   * @param {string} reqId The Unique Identifier for every request
   * @param {Number} statusCode the Http status code for JavaScript error.
   * @param {string} errorType The type of the error. Currently either "ValidationError" or "Error".
   * @param {string} messages belongs to error.
   * @param {Error} innerError The original native JavaScript error.
   */
  constructor(reqId, statusCode, errorType, messages, innerError) {

    super();

    this.reqId = reqId;

    this.statusCode = statusCode;

    /** @member {string} errorType The type of the error. Currently either "ValidationError" or "Error". */
    this.errorType = errorType;

    this.name = "ApiError";

    /** @member {string} messages Collection of error messages. */
    this.messages = messages;

    /** @member {Error} innerError The original native JavaScript error. */
    this.innerError = innerError;
  }
}

module.exports = ApiError;
