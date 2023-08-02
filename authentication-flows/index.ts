import express from 'express'

const app = express()

app.get('/', (req, res) => res.send('hi there'))

app.listen(3333, () => console.log('listening on http://127.0.0.1:3333'))
