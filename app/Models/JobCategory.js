'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class JobCategory
 */
class JobCategory extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'JobCategoryHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * JobCategory's schema
   */
  static get schema () {
    return {
      category_type: { type: String},
      category_image : { type : String},
      status : { type: Number, default:1},
      created_at : { type: Date, default : Date.now()}
    }
  }
}

module.exports = JobCategory.buildModel('JobCategory')
