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
    user.hasMany(models.Task, {
      foreignKey: 'user',
      onUpdate: 'CASCADE'
    });
  };
  return user;
};