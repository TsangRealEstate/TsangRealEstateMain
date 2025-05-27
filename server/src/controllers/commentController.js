const Comment = require("../models/Comment");


exports.createComment = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { comment } = req.body;

    if (!comment)
      return res.status(400).json({ message: "Comment is required" });

    const newComment = new Comment({ tenantId, comment });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.getComments = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const comments = await Comment.find({ tenantId }).sort({ createdAt: -1 });

    if (comments.length === 0) {
      return res
        .status(200)
        .json({ message: "No comments yet for this tenant." });
    }

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;

    if (!comment)
      return res.status(400).json({ message: "Comment is required" });

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { comment },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Comment not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await Comment.findByIdAndDelete(commentId);

    if (!deleted) return res.status(404).json({ message: "Comment not found" });

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
