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
Route.post('/forgotPassword', 'ApiController.forgotPassword')
Route.post('/addJobIndustrty', 'ApiController.addJobIndustrty')
Route.post('/addJobCategory', 'ApiController.addJobCategory')
Route.get('/fetchJobCategoryAndIndustry', 'ApiController.fetchJobCategoryAndIndustry')
Route.group(() => { 
    Route.get('/userDetails', 'ApiController.userDetails')
    Route.post('/profileEdit', 'ApiController.profileEdit')
    Route.post('/uploadProfileImage', 'ApiController.uploadProfileImage')
    Route.post('/changePassword', 'ApiController.changePassword')
    Route.post('/addJob', 'ApiController.addJob')
    Route.get('/jobList', 'ApiController.jobList')
    Route.post('/jobDetails', 'ApiController.jobDetails')
    Route.post('/editJob', 'ApiController.editJob')
}).middleware(['auth:jwt'])

Route.get('/logout', 'ApiController.userLogout').middleware(['auth']);

// Route.get('/fetchUser', 'ApiController.fetchUser')
