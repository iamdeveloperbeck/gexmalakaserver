const {
  create,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchByDiplomNumber,
} = require("../controller/info.controller");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");
const { fieldsUpload } = require("../utils/multer");

function InfoRoute(fastify, options, done) {
  fastify.post("/create/:id", {
    preHandler: [auth(["admin"]), fieldsUpload("avatar")],
    schema: {
      tags: ["Info"],
      consumes: ["multipart/form-data"],
      body: {
        type: "object",
        nullable: true,
        properties: {
          fullname: { type: "string", default: "John Doe" },
          phoneNumber: { type: "string", default: "+998904561223" },
          studied_time: { type: "string", format: "date" },
          completed_time: { type: "string", format: "date" },
          specialization_course: {
            type: "string",
          },
          diplom_number: { type: "string" }, // for validation
          avatar: { type: "string" }, // for multer
        },
        required: ["fullname", "phoneNumber", "diplom_number", "avatar"],
      },
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
      response: {
        201: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            user: {
              type: "object",
              properties: {
                _id: { type: "string" },
                user_id: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                    },
                    phoneNumber: {
                      type: "string",
                    },
                  },
                },
                fullname: { type: "string" },
                studied_time: { type: "string" },
                completed_time: { type: "string" },
                specialization_course: {
                  type: "string",
                },
                diplom_number: {
                  type: "string",
                },
                avatar: { type: "string" },
              },
            },
          },
        },
      },
    },
    handler: errorHandler(create),
  });

  fastify.get("/", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Info"],

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            users: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  user_id: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                      },
                      phoneNumber: {
                        type: "string",
                      },
                    },
                  },
                  fullname: { type: "string" },
                  studied_time: { type: "string" },
                  completed_time: { type: "string" },
                  specialization_course: {
                    type: "string",
                  },
                  diplom_number: {
                    type: "string",
                  },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    handler: errorHandler(getAllUsers),
  });

  fastify.get("/finddiplom/:diplom_number", {
    schema: {
      tags: ["Info"],
      params: {
        type: "object",
        nullable: true,
        properties: {
          diplom_number: { type: "string" },
        },
      },
    },

    handler: errorHandler(searchByDiplomNumber),
  });

  fastify.get("/:id", {
    preHandler: [auth(["admin", "user"])],
    schema: {
      tags: ["Info"],
      params: {
        type: "object",
        properties: {
          id: { type: "string", default: "me" },
        },
        required: ["id"],
      },
      headers: {
        authorization: {
          type: "string",
          description: "Administrator or User Token",
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            user: {
              type: "object",
              properties: {
                _id: { type: "string" },
                user_id: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                    },
                    phoneNumber: {
                      type: "string",
                    },
                  },
                },
                fullname: { type: "string" },
                studied_time: { type: "string" },
                completed_time: { type: "string" },
                specialization_course: {
                  type: "string",
                },
                diplom_number: {
                  type: "string",
                },
                avatar: { type: "string" },
              },
            },
          },
        },
      },
    },
    handler: errorHandler(getUserById),
  });
  fastify.put("/update/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Info"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            user: {
              type: "object",
              properties: {
                _id: { type: "string" },
                fullname: { type: "string" },
                user_id: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                    },
                    phoneNumber: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: errorHandler(updateUser),
  });
  fastify.delete("/delete/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Info"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(deleteUser),
  });

  done();
}

module.exports = InfoRoute;
