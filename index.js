const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

let data = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Middleware to parse JSON
app.use(express.json())

morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body);
  });

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())

// Route to get all data
app.get('/api/persons', (request, response) => {
  response.json(data)
})

// Route to get a single person by id
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = data.find(p => p.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
    const date = new Date()
    const numberOfEntries = data.length
  
    const info = `
      <p>Phonebook has info for ${numberOfEntries} people</p>
      <p>${date}</p>
    `
  
    response.send(info)
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 1000000).toString()
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing' });
      }
    
      const nameExists = data.some(person => person.name === body.name);
      if (nameExists) {
        return response.status(400).json({ error: 'name must be unique' });
      }
    const person = {
      id: generateId(),
      "name": body.name,
      "number": body.number
    }
  
    data = data.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
