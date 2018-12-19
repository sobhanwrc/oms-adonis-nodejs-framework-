'use strict'


const { validate } = use('Validator')
const Hash = use('Hash')
const User = use('App/Models/User')

class LoginController {
    index ({view}) {
        return view.render('index')
    }

    async login ({request, response, session}) {
        const rules = {
            username: 'required',
            password: 'required'
        }

        const messages = {
            'username.required' : 'The field is required',
            'password.required' : 'The field is required'
        }
        
        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
            session
              .withErrors(validation.messages())
              .flashExcept(['password'])
      
            return response.redirect('back')
        }else{
            return response.redirect('/dashboard')
        }
    }

    user_login ({view}) {
        return view.render('user_login')
    }

    //social login
    async facebook ({ally}) {
        await ally.driver('facebook').redirect()
    }

    async callback ({ ally, auth }) {
        try {
          const fbUser = await ally.driver('facebook').getUser()
          console.log(fbUser);
          return false;
    
          // user details to be saved
          const userDetails = {
            email: fbUser.getEmail(),
            token: fbUser.getAccessToken(),
            login_source: 'facebook'
          }
    
          // search for existing user
          const whereClause = {
            email: fbUser.getEmail()
          }
    
          const user = await User.findOrCreate(whereClause, userDetails)
          await auth.login(user)
    
          return 'Logged in'
        } catch (error) {
          return 'Unable to authenticate. Try again later'
        }
    }
}

module.exports = LoginController
