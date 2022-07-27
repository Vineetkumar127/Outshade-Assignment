
const express = require("express");
const mongoose = require("mongoose");
const multer=require('multer');
const cookie=require('cookie-parser');

const route = require("./routes/route");
const app = express();

app.use(express.json())
app.use(multer().any())
app.use(cookie())

app.use("/", route);



mongoose.connect("mongodb+srv://group13:UEEqzwKeluhyT2uM@cluster0.hkvjs.mongodb.net/outshade-Database?retryWrites=true&w=majority",{useNewUrlParser:true})
.then(()=>console.log("MongoDb connected"))
.catch(err=>console.log(err))

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});
