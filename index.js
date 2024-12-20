require('dotenv').config();
const express = require('express');
const app = express();
var morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] :response-time[4] ms :body')
);
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.get('/api/people/', (req, res) => {
  Person.find({}).then(result => res.json(result));
});

app.get('/info/', (req, res) => {
  const date = Date();
  Person.find({})
    .then(result => {
      const peopleLength = result.length;
      res.send(`
        <p>${date}</p>
        <p>Phonebook has info for ${peopleLength} people</p>
      `);
    });
});

app.get('/api/people/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person);
  });

  // if (!person) return res.status(404).end();
  // res.json(person);
});

app.post('/api/people/', (req, res, next) => {
  const { name, number } = req.body;

  // const nameExists = persons.find((person) => person.name === body.name);
  // if (nameExists) return res.status(409).json({ error: "name must be unique" });

  const person = new Person({
    name,
    number,
  });

  person.save()
    .then(result => {
      console.log(`Added ${result.name} number ${result.number} to phonebook`);
      res.json(result);
    })
    .catch(error => next(error));
});

app.put('/api/people/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
});

app.delete('/api/people/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error));
});

// const generateId = () => {
//   const id = Math.floor(Math.random() * 1000);
//   return id;
// };

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);


// Middleware para manejar errores
const errorHandler = (error, req, res, next) => {
  console.error('Mensaje de error', error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is now in running on port ${PORT}`);
});
