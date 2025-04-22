const express = require("express");
const app = express();
const cors = require("cors")
const Database = require("./src/db")
const usersRouter = require("./src/users")
const userSkillRouter = require("./src/userSkills")
const categoryRouter = require("./src/categories")
const skillsRouter = require("./src/skills")
app.use(express.json())
app.use(cors({
    origin:"*",
    methods:"*",
    allowedHeaders:"*"
}))

app.use("/users",usersRouter);
app.use("/users/skills",userSkillRouter);
app.use("/category",categoryRouter);
app.use("/skills",skillsRouter);


const port = 3001;
app.listen(port,()=>{
    console.log("server is runnning on port 3001");
})
