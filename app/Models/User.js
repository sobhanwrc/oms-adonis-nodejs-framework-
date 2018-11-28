'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class User
 */
class User extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'UserHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * User's schema
   */
  static get schema () {
    return {
      first_name: { type: String, default: '' },
      middle_name: { type: String, default: ''},
      last_name: { type: String, default: '' },
      profile_image : { type : String,  default: '' },
      email: { type: String, unique: true ,  default: '' },
      gender : { type : String,  default: '' },
      phone_number : {type: Number,  default: '' },
      password: { type: String,  default: ''  },
      address: {type : String,  default: '' },
      user_address2 : {type : String},
      city: { type : String,  default: '' },
      dob: { type: String,  default: '' },
      business : [
        {
          company_name: { type : String,  default: '' },
          company_address : { type : String,  default: '' },
          company_ph_no : { type: String,  default: '' },
          experience : { type : Number,  default: '' },
          service_type : { type : String,  default: '' },
          services: { type : String,  default: '' }
        }
      ],
      bank_information: [
        {
          bank_name:  { type : String, default: '' },
          account_no : { type : String,default: '' },
          swift_code :  { type : String, default: '' },
        }
      ],
      uen_no : { type: String, unique: true,  default: '' },
      latitude: {type : Number,  default: '' },
      longitude : { type: Number,  default: '' },
      status: { type: Number, default: 0}, //1 = 'active', 0='Inactive'
      reg_type: { type: String,  default: ''  }, //1=Admin,2=User,3=Vendor
      login_type: { type: String,  default: ''  }, //F=Facebook,G=Google,N=Normal
      social_id: { type: String,  default: ''  },
      forgot_pw_key : { type: String, default: ''},
      forgot_pw_email_sent_date : { type: Date, default: ''},
      created_at : { type: Date, default : Date.now()}
    }
  }
}

module.exports = User.buildModel('User')
