const express = require("express");
const cors = require("cors");
require('dotenv').config();
const connectDB = require('./config/db')


const app = express();
const db = process.env.DATABASE_URI;
const PORT = process.env.PORT || 3000;

//Connect DB
connectDB(db);

app.use(cors());

app.options("*", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
    res.send(200);
});


app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method + req.path + req.ip);
    next();
});


app.use("/api/products", require('./routes/api/products'));
app.use("/api/categories", require('./routes/api/categories'));
app.use("/api/orders", require('./routes/api/orders'));
app.use("/api/orderStates", require('./routes/api/orderStates'));


app.get('/', (req, res) => {
    res.send("Hello World");
});


app.all('*', (req, res) => {
    res.send("Invalid route");
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));