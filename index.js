const { response } = require('express')
const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())



morgan.token('inside', (request, response) => {
    if (request.body.name) {
        return `{ name:${request.body.name} number:${request.body.number}}`
    }
    return ''
})

let notes = [
    {
        id: 1,
        name: "Arto",
        number: "903-3333"
    },
    {
        id: 2,
        name: "Celine",
        number: "00002343"
    },
    {
        id: 3,
        name: "Diane",
        number: "901293"
    }
]

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :inside'))

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    }
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 1000000)

    if (!request.body.number || !request.body.name) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const note = request.body
    note.id = id

    notes = notes.concat(note)

    response.json(note)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${notes.length} people</p><p>${new Date()}</p>`)
})

const PORT = 3001
app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port ${PORT}`)
})