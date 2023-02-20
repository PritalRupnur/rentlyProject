'use strict';
const {Op} = require('sequelize');
const jwt = require('jsonwebtoken');

const {
  Model,
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
    email: {type: DataTypes.STRING},
    gender: {type: DataTypes.ENUM('Male', 'Female', 'Others')},

    createdAt: {type: DataTypes.DATE},
    updatedAt: {type: DataTypes.DATE},
  }, {
    sequelize,
    modelName: 'user',
  });

  user.associate = function(models) {
    user.hasMany(models.order);
  };



  // login user
  user.login = async function({name}) {



    const data = await user.findOne({where: {name}});
    const expiresIn = {expiresIn: '48h'};
    const token = jwt.sign({
      userId: data.id.toString(),
      name: 'trainee',
      iat: Math.floor(Date.now() / 1000),
    },
      'trainingProject',
      expiresIn);
     
    const tokenData = {
      userId: data.id,
      token: token,
    };
    return tokenData;



  };
   return user;
};




