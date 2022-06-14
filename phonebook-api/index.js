const http = require('http')
const express = require('express')
const app = express()

//JSON-parser
app.use(express.json()) 

// ===========
// Listen
// ===========
const PORT = 8000
app.listen(PORT) // port is defined as port 8000
console.log(`Server running on port ${PORT}`) // lets us know the port is successfully running

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
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

//user requests homepage (GET request):
app.get('/', (request, response) => { //HTTP GET request made to the '/' path
    response.send('<h1>Phonebook API</h1>') //using send() method of the response object.
  })
  
  //user requests our api data (GET request):
  app.get('/api/persons', (request, response) => { //HTTP GET request made to the '/api/notes' path
    response.json(persons) //json() will send the notes array in JSON format
  })

  //user requests how many people are in the phonebook currently.
  app.get('/info', (request, response) => {
    let entries = persons.length;
    response.send(`<h1>Phonebook has info for ${entries} people</h2><br><h2>${Date()}</h2>`)
  })

  //display information for a single phonebook entry
  app.get('/api/persons/:id', (request, response) => {
    

  })