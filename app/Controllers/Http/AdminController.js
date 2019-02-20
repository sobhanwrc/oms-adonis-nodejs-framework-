'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const Job = use ('App/Models/Job')

class AdminController {
    login_view({view}) {
        return view.render('admin.login')
    }

    async login_submit ({request, response, session, auth}) {
        var user_email = request.input('username')
        var password = request.input('password')
        var reg_type = 1; 

        // const user = await User.findOne({email : user_email, reg_type : reg_type});
        // var user_details = await auth.attempt(user_email, password)
        // console.log(user_details,'user_details');
        // return false

        try{
            await auth.attempt(user_email, password)

            return response.redirect('/admin/dashboard')
        }catch(e) {
            session.flash({ login_error: 'Wrong username or password.' })
            
            return response.redirect('/admin')
        }

        // if(user === null) {
        //     session.flash({ login_error: 'Wrong username or password.' })
        //     return response.redirect('back')
        // } else{ 
        //     if(Object.keys(user).length > 0) {
        //         const isSame = await Hash.verify(password, user.password);

        //         if(user != null && isSame && user.status === 1) {
        //             var generate_token = await auth.generate(user);

        //             // return response.json({
        //             //     status: true,
        //             //     code : 200,
        //             //     token: 'Bearer ' + generate_token.token,
        //             //     message : "Login successfully."
        //             // })
        //             return response.redirect('/admin/dashboard')

        //         }else { 
        //             session.flash({ login_error: 'Wrong username or password.' })
            
        //             return response.redirect('back')
        //         }
                
        //     }
        // }
    }
    
    async logout ({auth, response}) {
        await auth.logout()

        return response.redirect('/admin')
    }

    async dashboard({view}) {
        var fetch_total_users = await User.find({reg_type : 2, status : 1});
        var fetch_total_vendors = await User.find({reg_type : 3, status : 1});
        var totals_jobs_posted = await Job.find();

        var user_progress_bar = 0;
        var vendor_progress_bar = 0;
        var totals_jobs_posted_progress_bar = 0;
        
        if(fetch_total_users.length >= 0 && fetch_total_users.length <= 100) {
            user_progress_bar = fetch_total_users.length + "%";
        }else {
            user_progress_bar = "100%"
        }

        if(fetch_total_vendors.length >= 0 && fetch_total_vendors.length <= 100) {
            vendor_progress_bar = fetch_total_vendors.length + "%";
        }else {
            vendor_progress_bar = "100%"
        }

        if(totals_jobs_posted.length >= 0 && totals_jobs_posted.length <= 100) {
            totals_jobs_posted_progress_bar = totals_jobs_posted.length + "%";
        }else {
            totals_jobs_posted_progress_bar = "100%";
        }

        return view.render('admin.dashboard',{total_users:fetch_total_users.length, total_vendors: fetch_total_vendors.length, user_progress_bar:user_progress_bar, vendor_progress_bar:vendor_progress_bar, totals_jobs_posted : totals_jobs_posted.length, job_progress_bar : totals_jobs_posted_progress_bar})
    }
}

module.exports = AdminController
