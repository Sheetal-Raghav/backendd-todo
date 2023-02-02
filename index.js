const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const Route=require("./routes/routes");
const login=require("./routes/login");
const register=require("./routes/register");
const cors=require("cors");
const app=express();
const PORT=process.env.PORT || 7000

mongoose.connect("mongodb://localhost:27017/todo-app",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},(err)=>{
  if(err)console.log(err);
  else console.log("DatabaseConnected")
}
)
//mongodb+srv://sheetal:sheetal123@cluster0.ayktrln.mongodb.net/?retryWrites=true&w=majority"

app.use(cors());
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
  next(); 
})
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/todos", Route);
app.use("/login", login);
app.use("/register", register);

app.get("*", (req, res) => {
  res.status(404).json({
    message: "Path Not Found",
  });
});

app.listen(PORT, () => {
  console.log("App is Running at 7000");
});
