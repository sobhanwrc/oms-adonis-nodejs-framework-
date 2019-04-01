'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Notification = use('App/Models/Notification');
const moment = use('moment');
const _ = use('lodash');

class NotificationsCounter {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ view }, next) {
    const result = await Notification.find().sort({ _id: -1 })
    var notificationArray = [];
    
    _.forEach(result, data => {
      var data_come = moment(data.created_at).fromNow();
      notificationArray.push({
        description : data.description,
        time : data_come
      })
    })

    view.share({
      notifications: notificationArray
    })

    await next()
  }
}

module.exports = NotificationsCounter
