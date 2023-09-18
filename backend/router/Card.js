import express from "express";
const router = express.Router();
import Lables from "../models/labels.js";
import Task from "../models/Task.js";
import Card from "../models/Card.js";
import Board from "../models/Board.js";

router.get("/", async (req, res) => {
  await Card.find()
    .populate("labels")
    .populate("task")
    .then((card) => {
      if (card) res.status(200).send(card);
      else res.status(404).send("We dont have cards yet ");
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/:cardId", async (req, res) => {
  await Card.findById(req.params.cardId)
    .populate("labels")
    .populate("task")
    .then((card) => {
      if (card) res.status(200).send(card);
      else res.status(404).send("We dont have cards yet ");
    })
    .catch((err) => res.status(500).send(err));
});

// creating a new card and adding to its board board
router.post("/:bid", async (req, res) => {
  // console.log(req.body);
  /* Card : {creation} from frontend
    title
  */

  const board = await Board.findById(req.params.bid).catch((err) =>
    console.log(err.reason)
  );

  let newCard = new Card({
    title: req.body.title,
  });
  newCard = await newCard.save();
  board.Cards.push(newCard);
  board
    .save()
    .then(async (board) => {
      if (board) {
        // console.log(card);
        res.status(200).send({
          success: true,
          msg: "card added in board successfully",
        });
      } else {
        res.status(404).send({ success: false, msg: "board not found" });
      }
    })
    .catch((err) => console.log(err));
});

// updating the card
router.put("/:cardID", async (req, res) => {
  // console.log(req.body);
  /* Card : {updation} cardId
    id
    title
    desc
    date
  */

  const card = await Card.findById(req.params.cardID).catch((err) =>
    console.log(err.reason)
  );
  if (!card) res.status(404).send({ success: false, msg: "card not found" });
  else {
    card.title = req.body.title || card.title;
    card.desc = req.body.desc || card.desc;
    card.date = req.body.date || card.date;

    await card
      .save()
      .then(async (card) => {
        if (card) {
          // console.log(card);
          res.status(200).send({
            success: true,
            msg: "task added in card updated successfully",
          });
        } else res.status(404).send({ success: false, msg: "card not found" });
      })
      .catch((err) => console.log(err));
  }
});

// create new task and add its id to card
router.put("/addTask/:cardID", async (req, res) => {
  const card = await Card.findById(req.params.cardID).catch((err) =>
    console.log(err.reason)
  );
  if (!card) res.status(404).send({ success: false, msg: "card not found" });
  else {
    let NewTask = new Task({
      title: req.body.title,
      completed: req.body.completed,
    });

    NewTask = await NewTask.save().catch((err) => console.log(err));
    if (!NewTask) res.status(400).send({ msg: "err" });
    else {
      card.task.push(NewTask.id);
      await card
        .save()
        .then(async (card) => {
          if (card) {
            // console.log(card);
            res.status(200).send({
              success: true,
              msg: "task added in card updated successfully",
            });
          } else
            res.status(404).send({ success: false, msg: "card not found" });
        })
        .catch((err) => console.log(err));
    }
  }
});

router.put("/addLabel/:cardID", async (req, res) => {
  const card = await Card.findById(req.params.cardID).catch((err) =>
    console.log(err.reason)
  );
  if (!card) res.status(404).send({ success: false, msg: "card not found" });
  else {
    let NewLabel = new Lables({
      text: req.body.text,
      Color: req.body.color,
    });

    NewLabel = await NewLabel.save().catch((err) => console.log(err));
    if (!NewLabel) res.status(400).send({ msg: "err" });
    else {
      card.labels.push(NewLabel.id);
      await card
        .save()
        .then(async (card) => {
          if (card) {
            // console.log(card);
            res.status(200).send({
              success: true,
              msg: "task added in card updated successfully",
            });
          } else
            res.status(404).send({ success: false, msg: "card not found" });
        })
        .catch((err) => console.log(err));
    }
  }
});

router.put("/deleteTask/:cardID", async (req, res) => {
  const card = await Card.findById(req.params.cardID).catch((err) =>
    console.log(err.reason)
  );
  if (!card) res.status(404).send({ success: false, msg: "card not found" });
  else {
    await Task.findByIdAndDelete(req.body.taskID)
      .then(() => {
        card.task.remove(req.body.taskID);
        card
          .save()
          .then((card) => {
            if (card) {
              // console.log(card);
              res.status(200).send({
                success: true,
                msg: "task id deleted successfully",
              });
            } else
              res.status(404).send({ success: false, msg: "card not found" });
          })
          .catch((err) => {
            res.status(500).send(err.message);
          });
      })
      .catch((err) => res.status(500).send(err.message));
  }
});
router.put("/deleteLabel/:cardID", async (req, res) => {
  const card = await Card.findById(req.params.cardID).catch((err) =>
    console.log(err.reason)
  );
  if (!card) res.status(404).send({ success: false, msg: "card not found" });
  else {
    await Lables.findByIdAndDelete(req.body.LabelID)
      .then(() => {
        card.labels.remove(req.body.LabelID);
        card
          .save()
          .then((card) => {
            if (card) {
              // console.log(card);
              res.status(200).send({
                success: true,
                msg: "Label deleted successfully",
              });
            } else
              res.status(404).send({ success: false, msg: "card not found" });
          })
          .catch((err) => res.status(500).send(err));
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  }
});

// delete card
router.delete("/deleteCard/:boardID", async (req, res) => {
  // console.log(req.body, req.params);
  const board = await Board.findById(req.params.boardID);
  if (!board) res.status(404).send({ success: false, msg: "board not found" });
  else {
    // deleteing labels and task from there schema
    Card.findById(req.body.cardID)
      .then(async (card) => {
        if (card) {
          await card.labels.map(async (item) => {
            await Lables.findByIdAndDelete(item.toString()).catch((err) => {
              res.status(500).send(err.message);
            });
          });
          await card.task.map(async (item) => {
            await Task.findByIdAndDelete(item.toString()).catch((err) => {
              res.status(500).send(err.message);
            });
          });
          console.log({ msg: "card deleted succesfully" });
        } else {
          console.log({ msg: "card not found" });
        }
      })
      .catch((err) => {
        res.status(500).send({ msg: err });
      });
    // deleting card
    await Card.findByIdAndDelete(req.body.cardID).catch((err) => {
      console.log(err);
    });
    // deleting card from body
    board.Cards.remove(req.body.cardID);
    board
      .save()
      .then((board) => {
        if (board) {
          // console.log(card);
          res.status(200).send({
            success: true,
            msg: "card deleted successfully",
          });
        } else res.status(404).send({ success: false, msg: "board not found" });
      })
      .catch((err) => res.status(500).send(err));
  }
});

export default router;
