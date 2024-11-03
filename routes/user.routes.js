const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controller/user.controller");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");

function UserRoute(fastify, options, done) {
  fastify.post("/register", {
    schema: {
      tags: ["User"],
      body: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", default: "+998904561223" },
          password: { type: "string", default: "12345678" },
        },
      },

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(registerUser),
  });

  fastify.post("/login", {
    schema: {
      tags: ["User"],
      body: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", default: "+998904561223" },
          password: { type: "string", default: "12345678" },
        },
      },
    },
    handler: errorHandler(loginUser),
  });
  fastify.get("/", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["User"],
    },
    handler: errorHandler(getAllUsers),
  });

  done();
}

module.exports = UserRoute;
