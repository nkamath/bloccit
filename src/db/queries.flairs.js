const Flair = require("./models").Flair;
const Post = require("./models").Post;

module.exports = {
  getAllFlairs(callback){
    return Flair.all()
    .then((flairs) => {
      callback(null, flairs);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addFlair(newFlair, callback){
    return Flair.create({
      name: newFlair.name,
      color: newFlair.color
    })
    .then((flair) => {
      callback(null, flair);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getFlair(id, callback){
     return Flair.findById(id, {
      include: [{
        model: Post,
        as: "posts"
      }]
    })
     .then((flair) => {
       callback(null, flair);
     })
     .catch((err) => {
       callback(err);
     })
   },

   deleteFlair(id, callback){
     return Flair.destroy({
       where: {id}
     })
     .then((flair) => {
       callback(null, flair);
     })
     .catch((err) => {
       callback(err);
     })
   },

   updateFlair(id, updatedFlair, callback){
     return Flair.findById(id)
     .then((flair) => {
       if(!flair){
         return callback("Flair not found");
       }

//#1
       flair.update(updatedFlair, {
         fields: Object.keys(updatedFlair)
       })
       .then(() => {
         callback(null, flair);
       })
       .catch((err) => {
         callback(err);
       });
     });
   }
}
