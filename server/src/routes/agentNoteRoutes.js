const express = require("express");
const router = express.Router();
const agentNoteController = require("../controllers/agentNoteController");

router.post("/", agentNoteController.createNote);

router.get("/:tenantId/:scrapeListId", agentNoteController.getNotes);

router.put("/:noteId", agentNoteController.updateNote);

router.delete("/:noteId", agentNoteController.deleteNote);

module.exports = router;
