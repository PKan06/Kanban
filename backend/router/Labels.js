import express from "express";
const router = express.Router();

import Labels from "../models/labels.js";

router.get("/", async (req, res) => {
  await Labels.find()
    .then((lables) => {
      if (lables) res.status(200).send(lables);
      else res.status(404).send("We dont have labesls yet ");
    })
    .catch((err) => res.status(500).send(err));
});

export default router;
