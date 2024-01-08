const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require("./Database/database");

const env = require('./env/config');

const routev1 = require('./Routes/route');


// connectDB();


app.use(express.json());
app.use(cors({ origin: "*" }));

app.get('/' , (req, res)=> res.send("Hello"));

app.use('/v1' , routev1);

const port = env.BACKEND_PORT;

app.listen(port , ()=>{
    console.log(`Server is running on port  :  http://localhost:${port}`)
})