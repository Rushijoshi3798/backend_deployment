const express = require("express");
const { NoteModel } = require("../model/note.model");
const noteRouter = express.Router();
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth.middleware");

noteRouter.get("/", async (req, res) => {
  const token = req.headers.authorization;
  console.log(token);
  const decoded = jwt.verify(token, "masai");
  try {
    if (decoded) {
      const notes = await NoteModel.find({ userID: decoded.userID });
      res.status(200).send(notes);
    }
  } catch (error) {
    res.status(400).send({ msg: err.message });
  }
});

noteRouter.post("/add", auth, async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.status(200).send({ msg: "A new note has been added" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

noteRouter.patch("/update/:noteID", async (req, res) => {
  const token = req.headers.authorization;
  const payload = req.body;

  const decoded = jwt.verify(token, "masai");
  console.log(decoded);
  const req_id = decoded.userID;

  const noteID = req.params.noteID;
  const note = await NoteModel.findOne({ userID: noteID });
  const userID_in_note = note.userID;

  try {
    console.log(req_id, userID_in_note);
    if(req_id === userID_in_note){
      await NoteModel.findByIdAndUpdate({_id: note._id}, payload);
      res.status(200).send({msg: "Note has been updated successfully"});
    }else {
      res.status(400).send("You are Not authorized to update this note");
    }
  } catch (error) {
    res.status(400).send("Err 404 !!");
  }
});

noteRouter.delete("/delete/:noteID", async (req, res) => {
  const token = req.headers.authorization;

  const decoded = jwt.verify(token, "masai");
  console.log(decoded);
  const req_id = decoded.userID; // person who requesting to delete note

  const noteID = req.params.noteID;
  const note = await NoteModel.findOne({ userID: noteID });
  const userID_in_note = note.userID;

  try {
    console.log(req_id, "req_id", "&&", userID_in_note, "userID_in_note");
    if (req_id == userID_in_note) {
      await NoteModel.findByIdAndDelete({ _id: note._id });
      res.status(200).send({ msg: "Note has been Deleted" });
    } else {
      res.status(400).send("Note authorized");
    }
  } catch (err) {
    res.status(400).send("Err 404 !!");
  }
});

module.exports = {
  noteRouter,
};

/*

{
    "title":"Masai",
    "body": "kust at the end of masai journey",
    "sub":"Web dev",
    "userID":
}

*/
