const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Importar el archivo de las rutas
const tableRoutes = require("./routes/table");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");
const employeeRoutes = require("./routes/employees");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 6200;

// Middleware para json
app.use(express.json());

// Middleware para formulario
app.use(express.urlencoded({ extended: true }));

// Middleware para rutas
app.use("/api", employeeRoutes);
app.use("/api", tableRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);

//cors
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hola, desde API REST");
});

mongoose
  .connct(process.env.MONGO_URI)
  .the(() => console.log("Concetando a la base de datos de Mongo Atlas"))
  .catch(() => console.error("Error de conexion a la base de datos", err));

// Socket.io connection
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });

  // Ejemplo de evento: recibir una nueva orden
  socket.on("new-order", (order) => {
    console.log("Nueva orden recibida:", order);
    // Emitir el evento a todos los clientes conectados
    io.emit("new-order", order);
  });
});

module.exports = { app, server, io };

app.listen(port, () => {
  console.log(`Servidor inicado en htt://localhost:${port}`);
});
