const db = require("./db");

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@mail.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Regular User",
    email: "user@mail.com",
    password: "user123",
    role: "user",
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO users (id, name, email, password, role)
  VALUES (@id, @name, @email, @password, @role)
`);

const seed = db.transaction(() => {
  for (const user of users) {
    insert.run(user);
  }
});

seed();

console.log("✅ Users seeded successfully");
