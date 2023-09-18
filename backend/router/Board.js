import express from "express";
const router = express.Router();
import Lables from "../models/labels.js";
import Task from "../models/Task.js";
import Card from "../models/Card.js";
import Board from "../models/Board.js";

router.get("/all", async (req, res) => {
  const boards = await Board.find().populate("Cards").populate({
    path: "Cards",
    populate: "labels task",
  });

  if (!boards) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(boards);
});

router.get("/", async (req, res) => {
  const boards = await Board.find();
  if (!boards) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(boards);
});

router.post("/", async (req, res) => {
  // console.log(req.body)
  const newBoard = Board({
    title: req.body.title,
    Cards: [],
  });

  await newBoard
    .save()
    .then((newBoard) => {
      if (newBoard) {
        res.status(200).send(newBoard);
      } else {
        res.status(404).send(newBoard);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.delete("/:boardId", async (req, res) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) res.status(404).send({ success: false, msg: "board not found" });
  else {
    board.Cards.map(async (cardid) => {
      // deleting the labels and task from the db
      await Card.findById(cardid)
        .then(async (carditem) => {
          if (carditem) {
            carditem.labels.map(async (item) => {
              await Lables.findByIdAndDelete(item.toString()).catch((err) => {
                console.log(err.message);
              });
            });
            carditem.task.map(async (item) => {
              await Task.findByIdAndDelete(item.toString()).catch((err) => {
                console.log(err.message);
              });
            });
            console.log({ msg: "card deleted succesfully" });
          } else {
            console.log({ msg: "card not found" });
          }
        })
        .catch((err) => {
          console.log({ msg: err });
        });
      // detete card from db
      await Card.findByIdAndDelete(cardid).catch((err) => {
        console.log(err);
      });
    });

    // delete board
    await Board.findByIdAndDelete(req.params.boardId)
      .then((value) => {
        if (value) {
          console.log("task deleted");
          res
            .status(200)
            .send({ success: "true", msg: "Board deleted successfully" });
        } else {
          res.status(404).send({ success: "false", msg: "Board Not found" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }
});
export default router;
