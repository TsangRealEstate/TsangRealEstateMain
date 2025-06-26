const AgentNote = require("../models/AgentNote");

exports.createNote = async (req, res) => {
    try {
        const { tenantId, scrapeListId, propertyArea, propertyNote } = req.body;


        if (!tenantId || !scrapeListId || !propertyArea || !propertyNote) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const note = await AgentNote.findOneAndUpdate(
            { tenantId, scrapeListId },
            {
                propertyArea,
                propertyNote,
                lastUpdated: Date.now(),
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            message: "Note saved successfully",
            data: note,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to save note",
            details: error.message,
        });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { propertyNote, propertyArea } = req.body;

        const updatedNote = await AgentNote.findByIdAndUpdate(
            noteId,
            {
                propertyNote,
                propertyArea,
                lastUpdated: Date.now()
            },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({
            message: 'Note updated successfully',
            data: updatedNote
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update note',
            details: error.message
        });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const { tenantId, scrapeListId } = req.params;

        const notes = await AgentNote.find({ tenantId, scrapeListId })
            .sort({ lastUpdated: -1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch notes",
            details: error.message,
        });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        const deletedNote = await AgentNote.findByIdAndDelete(noteId);
        if (!deletedNote) {
            return res.status(404).json({ error: "Note not found" });
        }

        res.status(200).json({
            message: "Note deleted successfully",
            data: deletedNote,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete note",
            details: error.message,
        });
    }
};
