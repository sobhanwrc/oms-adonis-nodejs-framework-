'use strict'


const { validate } = use('Validator')
const Hash = use('Hash')
const User = use('App/Models/User')

class LoginController {
    index ({view}) {
        return view.render('login')
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
}

module.exports = LoginController
