import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); // connect to env file and add the data in process.env
import ConnecttoMongo from "./db.js";
ConnecttoMongo();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// mongoose.set('useFindAndModify', false);

// app.get("/", (req, res) => {
//   res.status(200).json("welcome to your node app");
// });

import BoardRoutes from "./router/Board.js";
import CardRoutes from "./router/Card.js";
import LableRoutes from "./router/Labels.js";
import TaskRoutes from "./router/Task.js";
app.use("/board", BoardRoutes);
app.use("/card", CardRoutes);
app.use("/labels", LableRoutes);
app.use("/task", TaskRoutes);


import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



app.get('/',(req,res)=>{
  // app.use(express.static(path.resolve(__dirname,'build')))
  // res.sendFile(path.resolve(__dirname,'build','index.html'))
  res.send({msg:"hello"})
})

app.listen(PORT, () =>
  console.log(`Server rinning on : http://localhost:${PORT}`)
);
