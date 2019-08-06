const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {

  beforeEach((done) => {
    this.topic;
    this.post;
    this.flair;
    sequelize.sync({force: true}).then((res) => {

      Topic.create({
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      })
      .then((topic) => {
        this.topic = topic;

        Flair.create({
          name: "news",
          color: "black",
        })
        .then((flair) => {
          this.flair = flair;

          Post.create({
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            topicId: this.topic.id,
            flairId: this.flair.id
          })
          .then((post) => {
            this.post = post;
            done();
          });

        });

      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#create()", () => {
     it("should create a flair object with a name and color", (done) => {
       Flair.create({
         name: "blog",
         color: "yellow"
       })
       .then((flair) => {
         expect(flair.name).toBe("blog");
         expect(flair.color).toBe("yellow");
         done();

       })
       .catch((err) => {
         console.log(err);
         done();
       });
     });

     it("should not create a flair with missing name or color", (done) => {
     Flair.create({
        name: "blog"
     })
     .then((flair) => {

      // the code in this block will not be evaluated since the validation error
      // will skip it. Instead, we'll catch the error in the catch block below
      // and set the expectations there

       done();

     })
     .catch((err) => {

       expect(err.message).toContain("Flair.color cannot be null");
       done();

     })
   });
   });

});
