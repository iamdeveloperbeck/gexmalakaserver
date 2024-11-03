const fastify = require("fastify")();
const dotenv = require("dotenv");
dotenv.config();
const { default: mongoose } = require("mongoose");
const cors = require("@fastify/cors");

//? Multer setup
const multer = require("fastify-multer");
fastify.register(multer.contentParser);
const path = require("path");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "./uploads"),
  prefix: "/uploads/", // optional: default '/'
});

//? Fastify setup
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.register(require("@fastify/swagger"), {
  exposeRoute: true,
  swagger: {
    info: {
      title: "MayTopia api",
      description: "This is the page of MayTopia api list",
      version: "1.0.0",
    },
    tags: [{ name: "Admin", description: "Admin related end-points" }],
  },
});

// swaagger endpoint
fastify.register(require("@fastify/swagger-ui"), {
  routePrefix: "/docs",
});

//? Routes
fastify.get("/", (req, res) => {
  res.send("Welcome to the API");
});

fastify.register(require("./routes/admin.routes"), {
  prefix: "v1/api/admin",
});
fastify.register(require("./routes/user.routes"), {
  prefix: "v1/api/user",
});
fastify.register(require("./routes/info.routes"), {
  prefix: "v1/api/info",
});

//? Connection to the database
mongoose
  .connect(process.env.DATABASE_URL_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the local db");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

//? Runs the server
fastify.listen(process.env.PORT || 8000, "0.0.0.0", (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
