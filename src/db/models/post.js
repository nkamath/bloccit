'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
           type: DataTypes.STRING,
           allowNull: false
    },
    topicId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.Flair, {
      foreignKey: "flairId",
      onDelete: "SET NULL"
    });
  };
  return Post;
};
