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
    },
    isTaskComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  }, {});
  task.associate = function(models) {
      task.belongsTo(models.User, {
        foreignKey: 'user',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
  };
  return task;
};