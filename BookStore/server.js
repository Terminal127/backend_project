const express = require("express");
const connectDB = require("./config/db");
const swaggerDocs = require("./config/swagger");
const app = express();

// Connection check with db
connectDB();

// Body parser middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/books", require("./routes/api/books"));
app.use("/", swaggerDocs);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app; // only for testing
