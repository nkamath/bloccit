const Topic = require("./models").Topic;
const Post = require("./models").Post;
const Authorizer = require("../policies/topic");


module.exports = {
  getAllTopics(callback){
    return Topic.all()
    .then((topics) => {
      callback(null, topics);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addTopic(newTopic, callback){
    return Topic.create({
      title: newTopic.title,
      description: newTopic.description
    })
    .then((topic) => {
      callback(null, topic);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getTopic(id, callback){
     return Topic.findById(id, {
      include: [{
        model: Post,
        as: "posts"
      }]
    })
     .then((topic) => {
       callback(null, topic);
     })
     .catch((err) => {
       callback(err);
     })
   },

  deleteTopic(req, callback){
     return Topic.findById(req.params.id).then((topic) => {
       const authorized = new Authorizer(req.user, topic).destroy();
       console.log("queries.topics authorized: " + authorized);
       if(authorized) {
 // #3
         topic.destroy()
         .then((res) => {
           callback(null, topic);
         });
       } else {
         debugger
         req.flash("notice", "You are not authorized to do that.")
         callback(401);
       }
     })
     .catch((err) => {
       debugger
       callback(err);
     });
   },
   updateTopic(req, updatedTopic, callback){
   return Topic.findById(req.params.id)
   .then((topic) => {
     if(!topic){
       return callback("Topic not found");
     }
     const authorized = new Authorizer(req.user, topic).update();
     if(authorized) {
       debugger
       topic.update(updatedTopic, {
         fields: Object.keys(updatedTopic)
       })
       .then(() => {
         callback(null, topic);
       })
       .catch((err) => {
         callback(err);
       });
     } else {
       req.flash("notice", "You are not authorized to do that.");
       callback("Forbidden");
     }
    });
  }
}
