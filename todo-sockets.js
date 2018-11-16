const users = {}
module.exports = function (io) {
  io.on('connection', function (socket) {

    socket.on('new-message', function (data) {
      io.emit('emit-message', data.res)
    })
  })
}