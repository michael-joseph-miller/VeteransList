const evtSource = new EventSource('/subscribe')
evtSource.onopen = event => {
  console.log('Connection to server opened')
}
evtSource.addEventListener('message', event => {
  console.log(event.data)
})
evtSource.addEventListener('reload', event => {
  window.location.reload()
})
