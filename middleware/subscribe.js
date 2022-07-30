client = null

const subscribe = (req, res) => {
  // send headers to keep connection alive
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache'
  }
  res.writeHead(200, headers)
  // send client a simple response
  res.write('you are subscribed\n\n')
  // store `res` of client to let us send events at will
  client = res
  // listen for client 'close' requests
  req.on('close', () => {
    client = null
  })
}

// send refresh event (must start with 'data: ')
global.sendRefresh = () => {
  client.write('event: reload\n')
  client.write('data: reload browser\n\n')
}

module.exports = { subscribe }
