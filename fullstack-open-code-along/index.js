const http = require('http')
const express = require('express')
const app = express()

//JSON-parser
app.use(express.json()) 

// ===========
// Listen
// ===========
const PORT = 3001
app.listen(PORT) // port is defined as port 3001
console.log(`Server running on port ${PORT}`) // lets us know the port is successfully running

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
  ]
  
// Commenting out - this is node syntax. We are switching to express.
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes)) //turn the array into JSON
// })


//user requests homepage (GET request):
app.get('/', (request, response) => { //HTTP GET request made to the '/' path
  response.send('<h1>Hello World!</h1>') //using send() method of the response object.
})

//user requests our api data (GET request):
app.get('/api/notes', (request, response) => { //HTTP GET request made to the '/api/notes' path
  response.json(notes) //json() will send the notes array in JSON format
})

//creating a route for fetching a single resource (getting a single resource - GET request):
app.get('/api/notes/:id', (request, response) => { //:id is the unique id number of whatever note the user is looking for. this is a query parameter, meaning any argument can be passed into a URL
  const id = Number(request.params.id) //here we are saying, from the user's request, go into the request object, go into the params object, and get the value of the id, and store it in the variable id
  const note = notes.find(note => note.id === id) //notes is the array we created. we will use find() on our array and look at each note object and find the value of the id that matches the parameter
  if (note) { //if note is found, the server responds with json(note)
    response.json(note) //when user makes request at /api/notes/:id, send the response of note (variable defined on line 47) as json
  } else {
    response.status(404).end() //if no note is found, the server should respond with the status code 404 not found
                               // the end method causes the web server to stop processing the script and return the current result, which has nothing passed into it (because there is no note, there is no data to pass in).
  }
})

//deleting a resource (DELETE request):
app.delete('/api/notes/:id', (request, response) => { //the user makes a delete request for a specific note id
  const id = Number(request.params.id) //here we are saying, from the user's request, go into the request object, go into the params object, and get the value of the id, and store it in the variable id
  notes = notes.filter(note => note.id !== id) //notes is the array we created. we filter() through the array, creating a new notes array. any id that does not match the user's requested id, will be added to the new array (so essentially we are leaving out whatever id the user requested... essentially deleting it from the array)

  response.status(204).end() //if deletion of the note was successsful, respond with 204 no content, and return no data (the end() is empty)
})

//adding new notes to the server (POST request):

//find the largest id number in notes array and assign to the generateId variable
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) //notes.map(n=>n.id) creates a new array that contains all the id's of the notes. Math.max returns the maxc value of the numbers that are passed to it. However, notes.map(n=>n.id) is an array so it can't directly be given as a parameter to Math.max , so we use ... (spread syntax) to pass each element (instead of passing an array) to the Math.max method
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body //go into request object, get the value from the body property, and store into variable body

  if (!body.content) { //if the body object (defined on line 84) has no value in its content property, return 400
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})


