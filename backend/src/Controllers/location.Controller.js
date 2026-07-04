import axios from "axios";

export const getStates = async (req, res) => {
  try {
    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      {
        country: "India",
      },
    );

    const states = response.data.data.states.map((s) => s.name);

    res.json(states);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch states",
    });
  }
};

export const getCities = async (req, res) => {
  try {
    const { state } = req.params;

    const response = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: "India",
        state,
      },
    );

    res.json(response.data.data);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch cities",
    });
  }
};
