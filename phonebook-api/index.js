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
  const id = Number(request.params.id); //get the id number that the user is asking for; we do this by grabbing it from the params of the query
  
  const person = persons.find(person => person.id === id) //personss is the array we created. we will use find() on our array and look at each element of the array, which is an object (andhere we are saying each element of the array, or each object, is defined as person) and then we are saying look at that object and find the id property, then find the value of the id thatmatches (===) the variable id (which we defined on line 56, its the id that the user is looking for). let person = the  object in the array that has the id that the user is looking for.
  
  if (person) { // if person is true, so if we found an id that matches the id that the user is looking for:
    response.json(person) //return person as json (return the object that we found on line 58)
  } else {
    response.status(404).end() //if none of the objects contained the id that the user is looking for, end the rest of the script and return a 404.
  }
})

//let user delete a person's info
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id); //get the id number that the user is asking for; we do this by grabbing it from the params of the query
  
  persons = persons.filter(person => person.id !== id) //persons is the array we created. we will use filter() on our array which will create a new array and overwrite the old one (persons =persons.filter()) . Filter will look at each element of the array, wand each element of the array is an object (and here we are saying each element of the array, or each object, is definedas person) and then we are saying look at that person object and find the id property, and if the value of the id property DOES NOT match (!==) the variable id (which we defined on line 68,its the id that the user is looking for), then that person object will be added to the new array (essentially, it will be kept in the array). so basically, we are replacing our initialarray with all the objects that have an id that DOES NOT match the id that the user requested (because they requested to delete it)
  
  response.status(204).end() //if deletion of the note was successsful, respond with 204 no content, and return no data (the end() is empty)
})

//let user create a new phonebook entry using a POST request

    //generate a new id with Math.random
    const newId = () => {
      min = Math.ceil(5);
      max = Math.floor(999999999);
      return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

app.post('/api/persons', (request, response) => {
  const body = request.body //go into request object, get the value from the body property, and store into variable body

  if ((!body.name || persons.find(person => person.name === body.name)) && !body.number) { //if the body object (defined on line 87) has no value in its name and body property, return 400 - if the user doesn't input anything as the name and number, tell them that they have to.
    return response.status(400).json({ 
      error: 'name and number missing. please fill out with the correct information.' 
    })
  }

  const newPerson = {
    id: newId(),
    name: body.name || 'no name input',
    number: body.number || 'no number input'
  }

  persons = persons.concat(newPerson)

  response.json(newPerson) //respond with the newPerson as json
})