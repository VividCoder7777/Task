'use strict';
let moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    toDoDate: {
      type: DataTypes.DATE,
      allowNull: false,
      get(){
        return moment(this.getDataValue('toDoDate')).format('YYYY-MM-DD');
      },
    }
  }, {});
  task.associate = function(models) {
    // associations can be defined here
  };
  return task;
};