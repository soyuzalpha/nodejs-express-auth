const app = require("./src/app");

app.get("/", (_req, res) => {
  res.send("Hello Express!");
});

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://nextjs-auth-template-peach.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Fake Auth API running on port ${PORT}`);
});
