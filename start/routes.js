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
Route.post('/api/registration', 'ApiController.registration')
Route.post('/api/submitLogin', 'ApiController.submitLogin')
Route.post('/api/socialLogin', 'ApiController.socialLogin')
Route.post('/api/forgotPassword', 'ApiController.forgotPassword')
Route.post('/api/addJobIndustrty', 'ApiController.addJobIndustrty')
Route.post('/api/addJobCategory', 'ApiController.addJobCategory')
Route.get('/api/fetchJobCategoryAndIndustry', 'ApiController.fetchJobCategoryAndIndustry')
Route.post('/api/addLocations', 'ApiController.addLocations')
Route.get('/api/fetchLocations', 'ApiController.fetchLocations')
Route.group(() => { 
    Route.get('/api/userDetails', 'ApiController.userDetails')
    Route.post('/api/profileEdit', 'ApiController.profileEdit')
    Route.post('/api/uploadProfileImage', 'ApiController.uploadProfileImage')
    Route.post('/api/changePassword', 'ApiController.changePassword')
    Route.post('/api/addJob', 'ApiController.addJob')
    Route.get('/api/jobList', 'ApiController.jobList')
    Route.post('/api/jobDetails', 'ApiController.jobDetails')
    Route.post('/api/editJob', 'ApiController.editJob')
    Route.get('/api/shoeDonationListings', 'ApiController.shoeDonationListings')
    Route.get('/api/logout', 'ApiController.userLogout')
}).middleware(['auth:jwt'])

// Route.get('/fetchUser', 'ApiController.fetchUser')
