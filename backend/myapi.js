const express = require("express");
const app = express();
const skills = [
    {
        "id": "000001",
        "skill": "HTML",
        "level": 3,
        "experience": 3
    },
    {
        "id": "000002",
        "skill": "javascript",
        "level": 2,
        "experience": 2
    },
    {
        "id": "000003",
        "skill": "css",
        "level": 3,
        "experience": 3
    },
    {
        "id": "000004",
        "skill": "php",
        "level": 4,
        "experience": 2
    }
]


app.get("/skills",(req,res)=>{
    res.status(200).json(skills)
})

app.post("/skill",(req,res)=>{
    res.status(200).json(req.body)
})

