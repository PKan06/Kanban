import express from "express";
const router = express.Router();
import Lables from "../models/labels.js";
import Task from "../models/Task.js";
import Card from "../models/Card.js";
import Board from "../models/Board.js";

router.get("/", (req, res) => {
  res.send("Welcome to card api");
});

// adding card by boardid
router.post("/:bid", async (req, res) => {
  console.log(req.body.Cards);
  // removing prevous data
  req.body.Cards.map(async (cardItem) => {
    // console.log(cardItem.id);
    if (cardItem.labels.id && cardItem.labels.length != 0) {
      cardItem.labels.map(async (labelsItem) => {
        await Lables.findByIdAndRemove(labelsItem.id)
          .then(() => console.log("Lables deleted"))
          .catch((err) => console.log(err));
      });
    }
    // console.log({ card: card });
    if (cardItem.tasks.id && cardItem.tasks.length != 0) {
      cardItem.tasks.map(async (taskItem) => {
        await Task.findByIdAndRemove(taskItem.id)
          .then(() => console.log("task deleted"))
          .catch((err) => console.log(err));
      });
    }
    await Card.findByIdAndRemove(cardItem.id).catch((err) => console.log(err));
  });

  let TaskIdsResolved = [];
  let LabelIdsResolved = [];

  req.body.Cards.map(async (card) => {
    if (card.labels.length != 0) {
        LabelIdsResolved = await Promise.all(
        card.labels.map(async (LabelItem) => {
          let newLabel = await Lables({
            text: LabelItem.text,
            Color: LabelItem.color,
          });
          console.log(newLabel);
          newLabel = await newLabel.save().catch((err) => console.log(err));
          return newLabel.id;
        })
      );
      
      console.log(LabelIdsResolved);
    }
    // console.log("card.tasks --> ", card.tasks.length);
    if (card.tasks.length != 0) {
      const TaskIds = Promise.all(
        card.tasks.map(async (taskItem) => {
          let newTask = await Task({
            title: taskItem.title,
          });
          //   console.log(newCard);
          newTask = await newTask.save().catch((err) => console.log(err));
          return newTask.id;
        })
      );
      TaskIdsResolved = await TaskIds;
    }
  });

  console.log(TaskIdsResolved, LabelIdsResolved);
  let CarsIdsResolved = [];
  if (LabelIdsResolved.length == 0 && TaskIdsResolved.length == 0) {
    const CardIds = Promise.all(
      req.body.Cards.map(async (cardItem) => {
        let newCard = await Card({
          title: cardItem.title,
          desc: cardItem.desc || "",
        });
        //   console.log(newCard);
        newCard = await newCard.save();
        return newCard.id;
      })
    );

    CarsIdsResolved = await CardIds;
  } else if (TaskIdsResolved.length == 0) {
    const CardIds = Promise.all(
      req.body.Cards.map(async (cardItem) => {
        let newCard = await Card({
          title: cardItem.title,
          labels: LabelIdsResolved || [],
          desc: cardItem.desc || "",
        });
        //   console.log(newCard);
        newCard = await newCard.save();
        return newCard.id;
      })
    );

    CarsIdsResolved = await CardIds;
  } else if (LabelIdsResolved.length == 0) {
    const CardIds = Promise.all(
      req.body.Cards.map(async (cardItem) => {
        let newCard = await Card({
          title: cardItem.title,
          task: TaskIdsResolved || [],
          desc: cardItem.desc || "",
        });
        //   console.log(newCard);
        newCard = await newCard.save();
        return newCard.id;
      })
    );

    CarsIdsResolved = await CardIds;
  } else {
    const CardIds = Promise.all(
      req.body.Cards.map(async (cardItem) => {
        let newCard = await Card({
          title: cardItem.title,
          labels: LabelIdsResolved || [],
          task: TaskIdsResolved || [],
          desc: cardItem.desc || "",
        });
        //   console.log(newCard);
        newCard = await newCard.save();
        return newCard.id;
      })
    );

    CarsIdsResolved = await CardIds;
  }
  //   res.status(200).send(CarsIdsResolved);

  await Board.findByIdAndUpdate(
    req.params.bid,
    {
      Cards: CarsIdsResolved,
    },
    { new: true }
  )
    .then((boardByID) => {
      if (boardByID) res.status(200).send(boardByID);
      else res.status(404).send({ status: false });
    })
    .catch((err) => res.status(404).send(err));
});

router.put("/", async (req, res) => {
  const label = Promise.all(
    req.body.labels.map(async (labelItems) => {
      let newLabelItems = new Lables({
        title: labelItems.title,
        desc: labelItems.desc,
      });

      newLabelItems = await newLabelItems.save();

      return newLabelItems._id;
    })
  );
  const labelIdsResolved = await label;

  const task = Promise.all(
    req.body.tasks.map(async (taskItems) => {
      let newTaskItems = new Task({
        title: taskItems.title,
      });

      newTaskItems = await newTaskItems.save();

      return newTaskItems._id;
    })
  );

  const taskIdsResolved = await task;

  let card = new Card({
    title: req.body.title,
    labels: labelIdsResolved,
    task: taskIdsResolved,
    desc: req.body.desc,
  });
  card = await card.save();

  if (!card) return res.status(400).send("The Card cannot be created!");
  res.send(order);
});

export default router;
