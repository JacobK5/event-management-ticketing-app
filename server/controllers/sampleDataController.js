import SampleDataService from "../services/sampleDataService.js";

const SampleDataController = {
  async populate(req, res) {
    try {
      await SampleDataService.populateSampleData(); // Call the sample data function
      return res
        .status(200)
        .json({ message: "Sample data populated successfully" });
    } catch (error) {
      console.error("Error populating sample data:", error);
      return res.status(500).json({ error: "Failed to populate sample data" });
    }
  },
};

export default SampleDataController;
