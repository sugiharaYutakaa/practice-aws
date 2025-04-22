const express = require("express");
const app = express();
const cors = require("cors")
const usersRouter = require("./src/users")
app.use(express.json())
app.use(cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*"
}))

app.use("/users", usersRouter);


const port = 3001;
app.listen(port, () => {
    console.log("server is runnning on port 3001");
})
