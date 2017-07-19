
const Moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  var GooglesPlaces = sequelize.define('GooglesPlaces',{
      name: DataTypes.STRING,
      description:DataTypes.STRING,
      latitude:DataTypes.STRING,
      longtitude:DataTypes.STRING,
      centrallatitude:DataTypes.STRING,
      centrallongtitude:DataTypes.STRING
  });
  
  return GooglesPlaces;
};