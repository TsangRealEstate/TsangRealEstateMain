const SavedUnit = require("../models/SavedUnit");

exports.saveSelectedUnits = async (req, res) => {
  try {
    const { tenantId, tenantName, selectedUnits } = req.body;

    if (!selectedUnits || selectedUnits.length === 0) {
      return res.status(400).json({ error: "No units selected" });
    }

    // Add isSaved: true to all selected units
    const unitsWithSavedStatus = selectedUnits.map(unit => ({
      ...unit,
      isSaved: true
    }));

    const existingSavedUnits = await SavedUnit.findOne({ tenantId });

    let savedData;
    if (existingSavedUnits) {
      const uniqueNewUnits = unitsWithSavedStatus.filter(
        (newUnit) =>
          !existingSavedUnits.selectedUnits.some(
            (existingUnit) => existingUnit.unitId === newUnit.unitId
          )
      );

      if (uniqueNewUnits.length === 0) {
        return res.status(200).json({
          message: "All units already exist in saved collection",
          count: 0,
          data: existingSavedUnits,
        });
      }

      existingSavedUnits.selectedUnits = [
        ...existingSavedUnits.selectedUnits,
        ...uniqueNewUnits,
      ];
      existingSavedUnits.timestamp = new Date();
      savedData = await existingSavedUnits.save();
    } else {
      savedData = await SavedUnit.create({
        tenantId,
        tenantName,
        selectedUnits: unitsWithSavedStatus,
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      message: "Units saved successfully",
      count: savedData.selectedUnits.length,
      data: savedData,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to save units",
      details: error.message,
    });
  }
};

exports.getSavedUnitsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const savedUnits = await SavedUnit.find({ tenantId })
      .sort({ timestamp: -1 })
      .lean()
      .exec();

    res.status(200).json(savedUnits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleFavoriteUnit = async (req, res) => {
  try {
    const { tenantId, unitId } = req.params;

    const savedUnitDoc = await SavedUnit.findOne({ tenantId });

    if (!savedUnitDoc) {
      return res
        .status(404)
        .json({ error: "No saved units found for this tenant" });
    }

    const unitIndex = savedUnitDoc.selectedUnits.findIndex(
      (unit) => unit.unitId === unitId
    );

    if (unitIndex === -1) {
      return res.status(404).json({ error: "Unit not found in saved units" });
    }

    savedUnitDoc.selectedUnits[unitIndex].isFavorite =
      !savedUnitDoc.selectedUnits[unitIndex].isFavorite;

    const updatedDoc = await savedUnitDoc.save();

    res.status(200).json({
      message: "Favorite status toggled successfully",
      isFavorite: updatedDoc.selectedUnits[unitIndex].isFavorite,
      data: updatedDoc,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to toggle favorite status",
      details: error.message,
    });
  }
};

exports.deleteSavedUnits = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { unitIds } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: "Tenant ID is required" });
    }

    const savedUnitDoc = await SavedUnit.findOne({ tenantId });

    if (!savedUnitDoc) {
      return res
        .status(404)
        .json({ error: "No saved units found for this tenant" });
    }

    if (unitIds && unitIds.length > 0) {
      // Delete specific units
      const initialCount = savedUnitDoc.selectedUnits.length;
      savedUnitDoc.selectedUnits = savedUnitDoc.selectedUnits.filter(
        (unit) => !unitIds.includes(unit.unitId)
      );

      if (savedUnitDoc.selectedUnits.length === initialCount) {
        return res.status(404).json({
          error: "None of the specified unit IDs were found in saved units",
          data: savedUnitDoc,
        });
      }

      // If no units left after deletion, delete the entire document
      if (savedUnitDoc.selectedUnits.length === 0) {
        await SavedUnit.deleteOne({ tenantId });
        return res.status(200).json({
          message: "All units deleted successfully, document removed",
          count: 0,
          data: null,
        });
      }

      // Save the document with remaining units
      const updatedDoc = await savedUnitDoc.save();
      return res.status(200).json({
        message: "Selected units deleted successfully",
        count: updatedDoc.selectedUnits.length,
        data: updatedDoc,
      });
    } else {
      // Delete all saved units for this tenant
      await SavedUnit.deleteOne({ tenantId });
      return res.status(200).json({
        message: "All saved units deleted successfully",
        count: 0,
        data: null,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete saved units",
      details: error.message,
    });
  }
};
