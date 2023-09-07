import express from "express";
const router = express.Router();
import Board from "../models/Board.js";
import Card from "../models/Card.js";

router.get("/all", async(req, res) => {
    const boards = await Board.find();
    if(!boards)
    {
        res.status(500).json({success: false});
    }
    res.status(200).send(boards);
});

router.get("/", async(req, res) => {
    const boards = await Board.find();
    if(!boards)
    {
        res.status(500).json({success: false});
    }
    res.status(200).send(boards);
});

router.post("/",async (req,res)=>{
    // console.log(req.body)
    const newBoard = Board({
        title: req.body.title,
        cart:[]
    });
    
    await newBoard.save().then((newBoard) => {
        if (newBoard) {
        res.status(200).send(newBoard);
        } else {
        res.status(404).send(newBoard);
        }
    })
    .catch((err) => {
        res.status(500).send(err);
    });
})
// router.post("/", async (req, res) => {
//   let newCardItems = new Lables({
//     title: "Enter your title",
//     desc: "Enter title discription",
//   });

//   newCardItems = await newCardItems.save();

//   // const labelIdsResolved = await label;

//   const newBoard = new Board({
//     title: req.body.title,
//   });

// });
export default router;
