'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    name: {type: DataTypes.STRING},
    age: {type: DataTypes.INTEGER},
    email:{type:DataTypes.STRING},
    gender:{type:DataTypes.ENUM('Male', 'Female', 'Others')},
    
    createdAt:{type:DataTypes.DATE},
    updatedAt:{type:DataTypes.DATE}
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};