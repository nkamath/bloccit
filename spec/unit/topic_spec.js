const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;



describe("Topic", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {

// #2
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user; //store the user

// #3
        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",

// #4
          posts: [{
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id
          }]
        }, {

// #5
          include: {
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic; //store the topic
          this.post = topic.posts[0]; //store the post
          done();
        })
      })
    });
  });

  describe("#create()", () => {
     it("should create a topic object with a title and body", (done) => {
       Topic.create({
         title: "Expeditions to Beta Centauri",
         description: "A compilation of reports from recent visits to the new star system"
       })
       .then((topic) => {
         expect(topic.title).toBe("Expeditions to Beta Centauri");
         expect(topic.description).toBe("A compilation of reports from recent visits to the new star system");
         done();

       })
       .catch((err) => {
         console.log(err);
         done();
       });
     });

     it("should not create a topic with missing title or body", (done) => {
     Topic.create({
         title: "Expeditions to Gamma Centauri"
     })
     .then((topic) => {
       done();
     })
     .catch((err) => {
       expect(err.message).toContain("Topic.description cannot be null");
       done();
     })
   });
   });

  describe("#getPosts()", () => {
     it("should return all associated posts", (done) => {
       this.topic.getPosts()
       .then((associatedPost) => {
         expect(associatedPost[0].title).toBe("My first visit to Proxima Centauri b");
         done();
       });
     });
   });
});
