'use strict'

const Hash = use('Hash')
const Encryption = use('Encryption')
const User = use('App/Models/User')
const Mailjet = use('node-mailjet').connect('ce9c25078a4f1474dc6d3ce5524a711c', 'd9ca8c7b9944f10a34eb42118277e6f5');
const gravatar = use('gravatar');
const base64_to_image = use ('base64-to-image');

class ApiController {
    async registration ({request, response, auth}) {
        var first_name = request.input('first_name');
        var last_name = request.input('last_name');
        var middle_name = request.input('middle_name');
        var email = request.input('email');
        var phone_number = request.input('phone_number');
        var password = await Hash.make(request.input('password'));
        var address = request.input('address');
        var city = 'Singapore';
        var dob = request.input('dob');
        var company_name = request.input('company_name');
        var company_address = request.input('company_address');
        var uen_no = request.input('uen_no');
        var reg_type = 0;

        const avatar = gravatar.url(email, {
            s: '200', // Size
            r: 'pg', // Rating
            d: 'mm' // Default
        });
        
        if(!company_name){
            reg_type = 2 //user
        }else { 
            reg_type = 3 //vendor
        }

        var checkExistingUser = await User.findOne ({
            email : email
        });
        
        if(checkExistingUser) {
            response.json ({
                status : false,
                code : 400,
                messages : "User is already registered with us."
            });
        } else {
            var add = new User({  
                first_name : first_name,
                middle_name : middle_name,
                last_name : last_name,
                profile_image : "http:" + avatar, 
                email : email,
                phone_number : phone_number,
                address : address,
                city : city,
                dob : dob,
                company_name : company_name,
                company_address : company_address,
                uen_no : uen_no,
                status : 1, //active
                reg_type : reg_type,
                password: password
            });

            var email_body = `
        <!DOCTYPE html>
        <html lang="en">
          <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
          <head>
            <style>
                #customers {
                    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
                    border-collapse: collapse;
                    width: 100%;
                }
        
                    #customers td, #customers th {
                        border: 1px solid #ddd;
                        padding: 5px;
                    }
        
                    #customers tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
        
        
                    #customers th {
                        padding-top: 12px;
                        padding-bottom: 12px;
                        text-align: left;
                        background-color: #4CAF50;
                        color: white;
                        font-weight: normal;
                    }
        
                    #customers td {
                        font-size: 12px;
                    }
        
                        #customers td img {
                            width: 50px;
                            border-radius: 50%;
                            height: 50px;
                        }
            </style>
          </head>
          <body>
            <table class="width_100 currentTable" align="center" border="0" cellpadding="0" cellspacing="0" width="800" style="border-collapse:collapse;" data-module="Account Password 1">
                <tr>
                    <td width="100%" align="center" valign="middle" background="https://w-dog.net/wallpapers/14/16/506636200709579/mood-a-bottle-a-letter-note-message-beach-sand-sea-river-water-background-wallpaper-widescreen-full-screen-hd-wallpapers.jpg" style="background-image: url('https://w-dog.net/wallpapers/14/16/506636200709579/mood-a-bottle-a-letter-note-message-beach-sand-sea-river-water-background-wallpaper-widescreen-full-screen-hd-wallpapers.jpg'); background-position: center center; background-repeat: repeat; background-size: cover;" bgcolor="#f7f8f8" data-bg="Account Password 1" data-bgcolor="Account Password 1">
                        <table align="center" border="0" cellpadding="0" width="100%" cellspacing="0" style="border-collapse: collapse;">
                            <tr>
                                <td width="100%" height="20" style="line-height:1px;"></td>
                            </tr>
                            <tr>
                                <td width="100%" align="center" valign="middle" style="line-height:1px;">
                                    <img src='/logo.png' alt="logo_chef_final" border="0" />
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="21" style="line-height:1px;"></td>
                            </tr>
                            <tr>
                                <td width="100%" align="center" valign="middle">
                                    <table class="width_90percent" align="center" border="0" cellpadding="0" width="600" cellspacing="0" style="border-collapse: collapse; max-width:90%; -webkit-border-radius: 10px; border-radius: 10px; background-color: #fff;" data-bgcolor="Box Color">
                                        <tr>
                                            <td width="100%" align="center" valign="middle">
                                                <table class="width_90percent" align="center" border="0" cellpadding="0" width="550" cellspacing="0" style="border-collapse: collapse; max-width:90%;">
                                                    <tr>
                                                        <td width="100%" height="53" style="line-height:1px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="100%" align="center" valign="middle" data-size="Main Title" data-min="20" data-max="28" data-color="Main Title" style="margin:0px; padding:0px; font-size:15px; color: #c63a39; margin-bottom: 10px; font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif; font-weight:bold;">
                                                           <p style="color: #b3b3b3;">
                                                            Hi ${first_name}, 
                                                            You have successfully registered to our services.
                                                            <br>
                                                                Thank You!
                                                           </p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td width="100%" height="18" style="line-height:1px;"></td>
                                                    </tr>
                                                    
                                                    <tr>
                                                        <td width="100%" align="center" valign="middle">
                                                            <table class="width_90percent" align="center" border="0" cellpadding="0" cellspacing="0" width="255" style="border-collapse:collapse; max-width:100%; -webkit-border-radius:30px; border-radius:30px;">
                                                                <tr>
                                                                    <td width="100%" align="center" data-size="Button" data-color="Button" data-min="10" data-max="18">
                                                                        <a href="http://122.163.54.103:90/ChefsCorner/"><img src='/logo.png' alt="logo_chef_final" border="0" width="80%" /></a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="display-block padding" width="100%" height="21" style="line-height:1px;"></td>
                                                    </tr>
        
                                                    <tr>
                                                        <td class="display-block padding" width="100%" height="25" style="line-height:1px;"></td>
                                                    </tr>
        
        
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" height="39" style="line-height:1px;"></td>
                            </tr>
        
                            <tr>
                                <td width="100%" align="center" valign="middle" data-size="Footer Description" data-min="9" data-max="16" data-color="Footer Description" style="margin:0px; padding:0px; font-size:12px; color:#000000; font-family: 'Open Sans', Helvetica, Arial, Verdana, sans-serif; font-weight:normal; line-height:24px;">
                                    © 2018 All right reserved OMC
                                </td>
                            </tr>
        
                            <tr>
                                <td width="100%" height="43" style="line-height:1px;"></td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
          </body>
        </html>`;
            try{
                if(await add.save()) {
                    const user = await User.findOne({email : email});
                    var generate_token = await auth.generate(user);

                    var sendEmail = Mailjet.post('send');
                    var emailData = {
                        'FromEmail': 'sobhan.das@intersoftkk.com',
                        'FromName': 'Oh! My Concierge',
                        'Subject': 'Registration confirmation',
                        'Html-part': email_body,
                        'Recipients': [{'Email': email}]
                    };
                    if(sendEmail.request(emailData)) {
                        return response.json({
                            success: true, 
                            code: 200, 
                            token: 'Bearer ' + generate_token.token,
                            message: 'Registration completed successfully.'
                        });
                    }
                }

            }catch (error) {
                throw error;
            }
        }

    }

    async submitLogin ({ request, response, auth}){
        
        try {
            // validate the user credentials and generate a JWT token
            const token = await auth.attempt(
                request.input('email'),
                request.input('password')
            )         
    
            return response.json({
                status: 'success',
                data: 'Bearer ' + token.token,
            })

        } catch (error) {
            return response.json ({
                status: false,
                code: 400,
                message : "Wrong username or password."
            });
        }
    }

    async userDetails ({ request, response, auth}) {
        try {
            return await auth.getUser()
        } catch (error) {
            response.send('Missing or invalid jwt token')
        }
    }

    async uploadProfileImage ({ request, response, auth}) {
        try{
            var user = await auth.getUser();

            var base64Str = request.input('profile_image');
    
            // var base64Str = req.body.profile_image.replace(/^data:image\/jpeg+;base64,/, "");
            var base64Str1 = base64Str.replace(/ /g, '+');

            let base64ImageMimeType = base64Str1.split(';base64,');
            var type = base64ImageMimeType[0].split(':image/');

            var path ='public/profile_image/';

            var imageFileName = user.id + '-' + Date.now();
            var optionalObj = {'fileName': imageFileName, 'type': type[1]};
            var uploadImage = base64_to_image(base64Str1,path,optionalObj);

            var full_image_path = request.header('Host') + '/profile_image/' + uploadImage.fileName;

            user.profile_image = 'http://'+full_image_path;

            if(await user.save()){
                response.json({
                success: true,
                code:200,
                message: "Profile image uploaded successfully."
                });
            }
        }catch (error) {
            throw error;
        }
    }

    async changePassword ({request, response, auth}) {
        var user = await auth.getUser();

        var user_old_password = request.input('old_password');

        //for checking db existing pw with user given pw
        const isSame = await Hash.verify(user_old_password, user.password);

        if(isSame) {
            var new_password = await Hash.make(request.input('new_password'));
            user.password = new_password;

            if(await user.save()) {
                response.json ({
                    status : true,
                    code : 200,
                    message : "Password updated successfully."
                });
            }
        }else{ 
            response.json ({
                status : false,
                code : 400,
                message : "Old password does not match."
            });
        }
        
    } 

    async userLogout ({ auth, response }) {
        // const user =  await auth.current.user 
        // console.log(user);
        // const token = auth.getAuthHeader()
        // await user
        //         .tokens()
        //         .where('type', 'api_token')
        //         .where('is_revoked', false)
        //         .where('token', Encryption.decrypt(token))
        //         .update({ is_revoked: true })

        await auth.logout();

        return response.json({
            status: true,
            msg : "Logout successfully."
        });
    }
}

module.exports = ApiController
