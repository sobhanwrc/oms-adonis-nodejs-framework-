'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'LoginController.index')
Route.group( () => {
    Route.post('/login', 'LoginController.login')
}).middleware(['guest'])


//api routes
Route.post('/registration', 'ApiController.registration')
Route.post('/submitLogin', 'ApiController.submitLogin')
Route.group(() => { 
    Route.get('/userDetails', 'ApiController.userDetails')
    Route.post('/uploadProfileImage', 'ApiController.uploadProfileImage')
    Route.post('/changePassword', 'ApiController.changePassword')
}).middleware(['auth:jwt'])

Route.get('/logout', 'ApiController.userLogout').middleware(['auth']);

// Route.get('/fetchUser', 'ApiController.fetchUser')
