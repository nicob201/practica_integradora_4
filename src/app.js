// Librerias y Modulos
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import { create } from "express-handlebars";
import compression from 'compression';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

// Routers
import viewsRouter from "./routes/viewsRouter.js";
import cartRouter from "./routes/cartRouter.js";
import ticketRouter from "./routes/ticketRouter.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import sessionsRouter from "./routes/api/sessions.js";
import messageRouter from "./routes/messagesRouter.js";
import mockingRouter from './routes/mockingRouter.js';

// Configuracion de MongoDB y conexion con la DB
import mongoose from "./config/databaseConfig.js";
import MongoStore from "connect-mongo";

// Utilidades y configuraciones adicionales
import __dirname from "./utils/utils.js";
import initializePassport from "./config/passportConfig.js";
import config from "./config/config.js";
import configureSocket from "./config/socketConfig.js";
import errorHandler from "./middleware/errors/index.js";

const app = express();

const PORT = config.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'E-commerce API',
      description: 'API para el proyecto final de Coderhouse',
    },
  },
  apis: [`src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

// Helper eq para manejo de isPremium o isUser en handlebars
const hbs = create({
  extname: ".handlebars",
  defaultLayout: "main",
  helpers: {
    eq: (a, b) => a === b,
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");

app.use("/public", express.static(path.join(__dirname, "../public")));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: config.MONGO_URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Compresion Gzip
app.use(compression());

// Manejo de errores
app.use(errorHandler);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/messages", messageRouter);
app.use("/api/tickets", ticketRouter);

// Ruta para crear 100 productos falsos con "faker"
app.use('/api/mocking', mockingRouter);

// Ruta Swagger
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} OK`);
});

const io = configureSocket(httpServer);

export { io };
export default app;
