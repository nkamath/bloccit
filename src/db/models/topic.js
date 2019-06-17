'use strict';
module.exports = (sequelize, DataTypes) => {
  var Topic = sequelize.define('Topic', {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Topic.associate = function(models) {
    // associations can be defined here
    Topic.hasMany(models.Banner, {
     foreignKey: "topicId",
     as: "Banners",
   });
   Topic.hasMany(models.Rule, {
    foreignKey: "topicId",
    as: "Rules",
  });
  };
  return Topic;
};
