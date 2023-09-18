import express from "express";
const router = express.Router();

import Task from "../models/Task.js";

router.get("/", async (req, res) => {
  await Task.find()
    .then((lables) => {
      if (lables) res.status(200).send(lables);
      else res.status(404).send("We dont have labesls yet ");
    })
    .catch((err) => res.status(500).send(err));
});

router.post("/", async (req, res) => {
  let NewTask = new Task({
    title: req.body.title,
    completed: req.body.completed,
  });

  NewTask = await NewTask.save();
  if (!NewTask) res.status(400).send({ msg: "err" });
  res.status(200).send(NewTask);
});

router.put("/:taskID", async (req, res) => {
  const NewTask = await Task.findByIdAndUpdate(
    req.params.taskID,
    {
      completed: req.body.completed || "false",
    },
    { new: true }
  );
  if (!NewTask) res.status(400).send({ msg: "err" });
  res.status(200).send({ success: true, msg: "Task updated successfully" });
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
    .then((value) => {
      if (value) {
        // console.log("task deleted");
        res
          .status(200)
          .send({ success: "true", msg: "Task deleted successfully" });
      } else {
        res.status(404).send({ success: "true", msg: "task Not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
export default router;
