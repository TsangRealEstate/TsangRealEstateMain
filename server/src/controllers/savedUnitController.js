// Save selected units
const SavedUnit = require("../models/SavedUnit");

exports.saveSelectedUnits = async (req, res) => {
  try {
    const { tenantId, tenantName, selectedUnits } = req.body;

    if (!selectedUnits || selectedUnits.length === 0) {
      return res.status(400).json({ error: "No units selected" });
    }

    const existingSavedUnits = await SavedUnit.findOne({ tenantId });

    let savedData;
    if (existingSavedUnits) {
      const uniqueNewUnits = selectedUnits.filter(
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
        selectedUnits,
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

// Get saved units by tenant
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
