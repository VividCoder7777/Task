'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('User', {
    googleId: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    username: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};