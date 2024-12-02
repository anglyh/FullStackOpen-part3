const express = require("express");
const app = express();
var morgan = require("morgan");
const cors = require("cors");

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] :response-time[4] ms :body"));
app.use(cors());

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.get("/api/persons/", (req, res) => {
  res.send(persons);
});

app.get("/info/", (req, res) => {
  const date = Date();
  const msg = `Phonebook has info for ${persons.length} people`;

  res.send(`
    <p>${date}</p>
    <p>${msg}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  if (!person) return res.status(404).end();

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);

  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const id = Math.floor(Math.random() * 1000);
  return id;
};

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number)
    return res.status(400).json({ error: "name or number missing" });

  const nameExists = persons.find((person) => person.name === body.name);
  if (nameExists) return res.status(409).json({ error: "name must be unique" });

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  // persons = [...persons, person];
  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is now in running on port ${PORT}`);
});
