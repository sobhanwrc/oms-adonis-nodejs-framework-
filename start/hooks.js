const {hooks} = require('@adonisjs/ignitor')
const Notification = use('App/Models/Notification');

hooks.before.providersBooted( () => {
    const View = use('View')
    const _ = use('lodash')

    Notification.find().sort({_id : -1}).then(function(result) {
        View.global('notifications', function () {
            return result;
        })
    })

    
}) 