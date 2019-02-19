'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class JobIndustry
 */
class JobIndustry extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'JobIndustryHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * JobIndustry's schema
   */
  static get schema () {
    return {
      industry_name : { type: String},
      status : {type: Number, default:1},
      created_at : { type: Date, default : Date.now()}
    }
  }
}

module.exports = JobIndustry.buildModel('JobIndustry')
