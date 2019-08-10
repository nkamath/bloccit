const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";
const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

function authorizeUser(role, done) { // helper function to create and authorize new user
  User.create({
    email: "#{role}@example.com",
    password: "123456",
    role: role
  })
  .then((user) => {
    request.get({         // mock authentication
      url: "http://localhost:3000/auth/fake",
      form: {
        role: user.role,     // mock authenticate as `role` user
        userId: user.id,
        email: user.email
      }
    },
      (err, res, body) => {
        done();
      }
    );
  });
}

describe("routes : topics", () => {
  beforeEach((done) => {
      this.topic;
      sequelize.sync({force: true}).then((res) => {
       Topic.create({
         title: "JS Frameworks",
         description: "There is a lot of them"
       })
        .then((topic) => {
          this.topic = topic;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
    // #1: define the admin user context
   describe("admin user performing CRUD actions for Topic", () => {

// #2: // before each test in admin user context, send an authentication request
       // to a route we will create to mock an authentication request
     beforeEach((done) => {
       authorizeUser("admin", done);
     });
    describe("GET /topics", () => {
      it("should return a status code 200 and all topics", (done) => {
         request.get(base, (err, res, body) => {
           expect(res.statusCode).toBe(200);
           expect(err).toBeNull();
           expect(body).toContain("Topics");
           expect(body).toContain("JS Frameworks");
           done();
       });
     });
   });
    describe("GET /topics/new", () => {

     it("should render a new topic form", (done) => {
       request.get(`${base}new`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("New Topic");
         done();
       });
     });
   });
    describe("POST /topics/create", () => {
         const options = {
           url: `${base}create`,
           form: {
             title: "blink-182 songs",
             description: "What's your favorite blink-182 song?"
           }
         };

         it("should create a new topic and redirect", (done) => {

   //#1
           request.post(options,

   //#2
             (err, res, body) => {
               Topic.findOne({where: {title: "blink-182 songs"}})
               .then((topic) => {
                 expect(res.statusCode).toBe(303);
                 expect(topic.title).toBe("blink-182 songs");
                 expect(topic.description).toBe("What's your favorite blink-182 song?");
                 done();
               })
               .catch((err) => {
                 console.log(err);
                 done();
               });
             }
           );
         });
       });
    describe("GET /topics/:id", () => {

       it("should render a view with the selected topic", (done) => {
         request.get(`${base}${this.topic.id}`, (err, res, body) => {
           expect(err).toBeNull();
           expect(body).toContain("JS Frameworks");
           done();
         });
       });

     });
    describe("POST /topics/:id/destroy", () => {
      it("should delete the topic with the associated ID", (done) => {
        Topic.all()
        .then((topics) => {

    //#2
          const topicCountBeforeDelete = topics.length;

          expect(topicCountBeforeDelete).toBe(1);

          request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
            Topic.all()
            .then((topics) => {
              expect(err).toBeNull();
              expect(topics.length).toBe(topicCountBeforeDelete - 1);
              done();
            })
          });
        });
      });
    });
    describe("GET /topics/:id/edit", () => {
       it("should render a view with an edit topic form", (done) => {
         request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
           expect(err).toBeNull();
           expect(body).toContain("Edit Topic");
           expect(body).toContain("JS Frameworks");
           done();
         });
       });
     });
    describe("POST /topics/:id/update", () => {

       it("should update the topic with the given values", (done) => {
          const options = {
             url: `${base}${this.topic.id}/update`,
             form: {
               title: "JavaScript Frameworks",
               description: "There are a lot of them"
             }
           };
  //#1
           request.post(options,
             (err, res, body) => {

             expect(err).toBeNull();
  //#2
             Topic.findOne({
               where: { id: this.topic.id }
             })
             .then((topic) => {
               expect(topic.title).toBe("JavaScript Frameworks");
               done();
             });
           });
       });

     });
  });
  // #3: define the member user context
  // context of member user
  describe("member user performing CRUD actions for Topic", () => {

      beforeEach((done) => {  // before each suite in member context
        authorizeUser("member", done);
      });

      describe("GET /topics", () => {

        it("should respond with all topics", (done) => {
          request.get(base, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Topics");
            expect(body).toContain("JS Frameworks");
            done();
          });
        });

      });

      describe("GET /topics/new", () => {

        it("should redirect to topics view", (done) => {
          request.get(`${base}new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Topics");
            done();
          });
        });

      });

      describe("POST /topics/create", () => {
        const options = {
          url: `${base}create`,
          form: {
            title: "blink-182 songs",
            description: "What's your favorite blink-182 song?"
          }
        }

        it("should not create a new topic", (done) => {
          request.post(options,
            (err, res, body) => {
              Topic.findOne({where: {title: "blink-182 songs"}})
              .then((topic) => {
                expect(topic).toBeNull(); // no topic should be returned
                done();
              })
              .catch((err) => {
                console.log(err);
                done();
              });
            }
          );
        });
      });

      describe("GET /topics/:id", () => {

        it("should render a view with the selected topic", (done) => {
          // variables defined outside, like `this.topic` are only available
          // inside `it` blocks.
          request.get(`${base}${this.topic.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("JS Frameworks");
            done();
          });
        });
      });

      describe("POST /topics/:id/destroy", () => {

        it("should not delete the topic with the associated ID", (done) => {

          Topic.all()
          .then((topics) => {
            const topicCountBeforeDelete = topics.length;

            expect(topicCountBeforeDelete).toBe(1);

            request.post(`${base}${this.topic.id}/destroy`, (err, res, body) => {
              Topic.all()
              .then((topics) => {
                // confirm that no topics were deleted
                expect(topics.length).toBe(topicCountBeforeDelete);
                done();
              })

            });
          })

        });

      });

      describe("GET /topics/:id/edit", () => {

        it("should not render a view with an edit topic form", (done) => {

          request.get(`${base}${this.topic.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).not.toContain("Edit Topic");
            expect(body).toContain("JS Frameworks"); // confirm redirect to topic show
            done();
          });
        });

      });

      describe("POST /topics/:id/update", () => {

        it("should not update the topic with the given values", (done) => {
          const options = {
            url: `${base}${this.topic.id}/update`,
            form: {
              title: "JavaScript Frameworks",
              description: "There are a lot of them"
            }
          }

          request.post(options,
          (err, res, body) => {
            expect(err).toBeNull();
            Topic.findOne({
              where: { id:1 }
            })
            .then((topic) => {
              expect(topic.title).toBe("JS Frameworks"); // confirm title is unchanged
              done();
            });
          });
        });

      });

    });

  });
