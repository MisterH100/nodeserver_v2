import Activity from "../models/activity.model.js";

export const newActivity = async (req, res) => {
  const { title, description } = req.body;
  const start_date = Date.now();
  try {
    const newActivity = new Activity({
      title,
      description,
      start_date,
    });
    await newActivity.save();
    res.json(newActivity);
  } catch (error) {
    res.send(error);
  }
};

export const stopActivity = async (req, res) => {
  const { id: activityId } = req.params;
  try {
    await Activity.findByIdAndUpdate(activityId, { end_date: Date.now() }).then(
      (activity) => {
        res.json(activity);
      }
    );
  } catch (error) {
    res.json(error);
  }
};

export const getActivities = async (req, res) => {
  try {
    await Activity.find()
      .sort({ createdAt: "descending" })
      .then((activities) => {
        res.json(activities);
      });
  } catch (error) {
    res.json(error);
  }
};
