require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

mongoose.set('strictQuery', false);

// Middleware to parse JSON
app.use(express.json());

morgan.token('req-body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));
app.use(cors());

// Route to get all data
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => response.json(persons))
    .catch(error => {
      console.error('Error fetching data:', error);
      response.status(500).json({ error: 'failed to fetch data' });
    });
});

// Route to get a single person by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

// Route to get information
app.get('/info', (request, response) => {
  const date = new Date();
  Person.countDocuments({})
    .then(count => {
      const info = `
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `;
      response.send(info);
    })
    .catch(error => {
      console.error('Error fetching info:', error);
      response.status(500).json({ error: 'failed to fetch info' });
    });
});

// Route to delete a person by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error));
});

// Route to add a new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  console.log(body);

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error));
});

// Error handler middleware
const errorHandler = (error, req, res, next) => {
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
  console.log(`Server running on port ${PORT}`);
});
