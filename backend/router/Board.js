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

router.put("/card-on-card", async (req, res) => {
  // removing card from the source board

  const pick_board = await Board.findById(req.body.bid);
  if (!pick_board) res.status(404).send("pick board not define");
  else {
    // calculating index to remove
    // console.log(pick_board)
    let c_cardIndex = pick_board.Cards?.map((item) => {
      return item.toString();
    }).indexOf(req.body.cid);
    // console.log(c_cardIndex);
    pick_board.Cards.splice(c_cardIndex, 1);
    await pick_board.save();
  }

  // adding card to the target board
  const drop_board = await Board.findById(req.body.T_bid);
  if (!drop_board) res.status(404).send("drop board not define");
  else {
    // calculating index at which the new board will be added
    let t_cardIndex = drop_board.Cards?.map((item) => {
      return item.toString();
    }).indexOf(req.body.T_cid);
    drop_board.Cards.splice(t_cardIndex, 0, req.body.cid);
    // console.log(drop_board.Cards);
    await drop_board.save();

    // res.status(200).send({ pick_board, drop_board });
    res
      .status(200)
      .send({ success: true, msg: "card placed on other board cards  " });
  }
});
router.put("/card-on-board", async (req, res) => {
  // considering target board but the bord is not dragabel so no worry
  // console.log(req.body);
  // removing card from the source board
  const pick_board = await Board.findById(req.body.bid);
  // console.log("pick_board -> ", pick_board);
  if (!pick_board) res.status(500).send("pick board not define");
  else {
    // calculating index to remove
    let c_cardIndex = pick_board.Cards?.map((item) => {
      return item.toString();
    }).indexOf(req.body.cid);
    // console.log(c_cardIndex);
    pick_board.Cards.splice(c_cardIndex, 1);
    // console.log("pick_board.Cards",pick_board.Cards);
    await pick_board.save();
  }

  // console.log(req.body);
  const drop_board = await Board.findById(req.body.T_bid);
  // console.log("drop_board -> ", drop_board);
  if (!drop_board) res.status(500).send("drop board nort define");
  else {
    // console.log(drop_board.Cards?.length)
    drop_board.Cards?.splice(drop_board.Cards?.length, 0, req.body.cid); // add at 0 th position without removing anything
    await drop_board.save();

    // res.status(200).send({ pick_board, drop_board });
    res.status(200).send({ success: true, msg: "card added to other board  " });
  }
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
