const app = require("./src/app");

app.get("/", (_req, res) => {
  res.send("Hello Express!");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Fake Auth API running on port ${PORT}`);
});
