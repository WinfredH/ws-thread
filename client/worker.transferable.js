const ws = new WebSocket('ws://localhost:9999?session=3')

ws.onopen = function (e) {
  postMessage({
    action: 'ws_open',
    content: ''
  })
}

ws.onmessage = function (e) {
  if (e.data instanceof Blob) {
    e.data.arrayBuffer().then(buffer => {
      postMessage(buffer, [buffer])
    })
  }
}

addEventListener('message', (e) => {
  if (e.data instanceof ArrayBuffer) {
    ws.send(e.data)
  }
})
