'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response }) {
    console.log(error)
    // return false
    // JWT Token expired
    if (error.code === 'E_JWT_TOKEN_EXPIRED') {
      response.json({
        status : false,
        code : 266,
        message : "Token expired. Please login or refresh."
      });
    }else if (error.code == 'E_INVALID_JWT_TOKEN') {
      response.json({
        status : false,
        code : 266,
        message : "Invalid token. Please sent correct token."
      });
    }else if (error.code = 11000) {
      response.json({
        status : false,
        code : 266,
        message : "Duplicate entry."
      });
    }else{
      response.json({
        status : false,
        code : 266,
        message : "Need token"
      });
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
