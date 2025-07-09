const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', (req, res) => {
    const data = req.body

    return data ? JSON.stringify(data) : " "
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"))

app.use(express.static('dist'))

let contacts = [
  { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/info', (request, response) => {
    response.send(`
        <div>Phonebook has info for ${contacts.length} people</div>
        <div>${new Date()}</div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const contact = contacts.find(contact => contact.id === id)

    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

const genId = () => {
    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

    if (contacts.find(contact => contact.id === id) === undefined) {
        return id.toString()
    } else {
        return genId().toString()
    }
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(404).json({
            error: 'contact info missing'
        })
    }

    const name = body.name
    if (contacts.find(contact => contact.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    const contact = {
        name: body.name,
        number: body.number,
        id: genId(),
    }

    contacts = contacts.concat(contact)

    return response.json(contact)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})