const { Configuration, OpenAIApi } = require("openai");
const router = require("express").Router();

// Configure open api
const configuration = new Configuration({
  apiKey: "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", // VISIT .env AND MAKE CHANGES
});
const openai = new OpenAIApi(configuration);

//post route for making requests
router.post("/", async (req, res) => {
  if (!req.body.message) {
    res.json({ message: "Please provide a message" }).status(400);
  }
  const { message } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
    });
    res.json({ message: response.data.choices[0].text });
  } catch (e) {
    console.log(e);
    res.json(e).status(400);
  }
});

module.exports = router;
