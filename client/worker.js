importScripts('./command.js')
const ws = new WebSocket('ws://localhost:9999?session=1')

ws.onopen = function (e) {
  postMessage({
    action: 'ws_open',
    content: ''
  })
}

ws.onmessage = function (e) {
  if (e.data instanceof Blob) {
    e.data.arrayBuffer().then((buffer) => {
      const sab = new SharedArrayBuffer(buffer.byteLength + 1)
      const uint8 = new Uint8Array(sab)
      uint8[0] = COMMAND.RECEIVE
      uint8.set(new Uint8Array(buffer), 1)
      postMessage(sab)
    })
  }
}

/**
 * msg from main thread
 */
onmessage = function (e) {
  if (e.data instanceof SharedArrayBuffer) {
    const origin = new Uint8Array(e.data)
    if (origin[0] === COMMAND.SEND) {
      const dupicate = Uint8Array.from(origin.slice(1))
      ws.send(dupicate.buffer)
    }
  }
}
