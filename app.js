const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 4000;
const usersRoutes = require("./routes/users.route.js");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
   const data = fs.readFileSync("index.html", "utf8");
   res.write(data);
   res.end();
});

app.use("/user", usersRoutes);

app.listen(port);
console.log(`Server is listening on ${port}`);
