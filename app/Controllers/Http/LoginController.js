'use strict'


const { validate } = use('Validator')
const Hash = use('Hash')
const User = use('App/Models/User')
const Mailjet = use('node-mailjet').connect('ce9c25078a4f1474dc6d3ce5524a711c', 'd9ca8c7b9944f10a34eb42118277e6f5');
const Mail = use('Mail')

class LoginController {
    index ({view}) {
        return view.render('index')
    }

    async forgot_password ({view, request, response}) {
        var queryString = request.get();
        var secret_key = queryString.key;
        var date = queryString.date;
        
        var check_user_forgot_pw = await User.find({forgot_pw_key : secret_key});

        if(check_user_forgot_pw.length > 0) {
            var date1 = new Date(check_user_forgot_pw[0].forgot_pw_email_sent_date);
            var date2 = new Date();
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if(diffDays <= 2) {
                return view.render('forgot_password', { key : secret_key, date : date,});
            }else {
                return view.render('forgot_password', { key : 0});
            }
        }else {
            return view.render('forgot_password', { key : ''});
        }
        
    }

    async contact_us ({request, response}) {
        var name = request.input('user_name');
        var email = request.input('email');
        var subject = request.input('subject');
        var message = request.input('message');

        // var sendEmail = Mailjet.post('send');
        // var emailData = {
        //     'FromEmail': email,
        //     'FromName': 'Oh! My Concierge',
        //     'Subject': subject,
        //     'Html-part': message,
        //     'Recipients': [{'Email': 'sobhan.das@intersoftkk.com'}]
        // };
        // var sent_email = await sendEmail.request(emailData);

        var sent_email = await Mail.send('emails.welcome', name, (message) => {
            message
              .to('sobhan.das@intersoftkk.com')
              .from(email)
              .subject('Welcome to OMC')
        })

        console.log(sent_email);
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

    async callback_fb ({ ally, auth }) {
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

    async google ({ally}) {
        await ally.driver('google').redirect()
    }

    async callback_google ({ ally, auth }) {
        try {
          const google_User = await ally.driver('google').getUser()
          console.log(google_User);
          return false;
    
          // user details to be saved
          const userDetails = {
            email: fbUser.getEmail(),
            token: fbUser.getAccessToken(),
            login_source: 'google'
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
