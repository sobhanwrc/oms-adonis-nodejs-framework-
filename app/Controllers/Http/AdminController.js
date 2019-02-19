'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')

class AdminController {
    login_view({view}) {
        return view.render('admin.login')
    }

    async login_submit ({request, response, session, auth}) {
        var user_email = request.input('username')
        var password = request.input('password')
        var reg_type = 1; 

        const user = await User.findOne({email : user_email, reg_type : reg_type});

        if(user === null) {
            session.flash({ login_error: 'Wrong username or password.' })
            return response.redirect('back')
        } else{ 
            if(Object.keys(user).length > 0) {
                const isSame = await Hash.verify(password, user.password);

                if(user != null && isSame && user.status === 1) {
                    var generate_token = await auth.generate(user);

                    // return response.json({
                    //     status: true,
                    //     code : 200,
                    //     token: 'Bearer ' + generate_token.token,
                    //     message : "Login successfully."
                    // })
                    return response.redirect('/admin/dashboard')

                }else { 
                    session.flash({ login_error: 'Wrong username or password.' })
            
                    return response.redirect('back')
                }
                
            }
        }
    }   

    dashboard({view}) {
        return view.render('admin.dashboard')
    }
}

module.exports = AdminController
