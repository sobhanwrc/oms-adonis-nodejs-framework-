'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Notification = use('App/Models/Notification');

class NotificationsCounter {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ view }, next) {
    const result = await Notification.find().sort({ _id: -1 })
    view.share({
      notifications: result
    })

    await next()
  }
}

module.exports = NotificationsCounter
