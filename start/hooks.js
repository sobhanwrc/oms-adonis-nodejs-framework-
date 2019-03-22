const {hooks} = require('@adonisjs/ignitor')
const Notification = use('App/Models/Notification');

hooks.before.providersBooted(async () => {
    const View = use('View')
    const _ = use('lodash')

    var fetch_all_details = await  Notification.find().sort({_id : -1});

    View.global('notifications', function () {
        return fetch_all_details;
    })
}) 