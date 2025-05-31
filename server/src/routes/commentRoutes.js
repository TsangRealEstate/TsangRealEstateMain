const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.post("/:tenantId", commentController.createComment);

router.get("/:tenantId", commentController.getComments);

router.put("/update/:commentId", commentController.updateComment);

router.delete("/delete/:commentId", commentController.deleteComment);

module.exports = router;
