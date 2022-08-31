const ws = require('ws')
const Fastify = require('fastify')
const path = require('path')
const fastifyStatic = require('@fastify/static')

const fastify = new Fastify({ logger: true })
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'client'),
  setHeaders (res, path, stat) {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  }
})

const wss = new ws.WebSocketServer({ port: 9999 })
wss.on('connection', function connection (ws) {
  ws.on('message', function message (data) {
    console.log('received:', Date.now(), data)
    ws.send(data)
  })
  ws.send('ws open')
})

fastify.listen({ port: 3000 })
