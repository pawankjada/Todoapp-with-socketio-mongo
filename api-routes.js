const todos = require('../models/Todos.js');

module.exports = function (app, io) {

  app.get('/api/todos', function (req, res) {
    todos.find({})
      .then(function (dbTodos) {
        res.json(dbTodos);
      })
      .catch(function (error) {
        res.json(error);
      });
  });

  app.post('/api/todos', function (req, res) {
    todos.create(req.body)
      .then(function (dbtodos) {
        io.emit('new todo', dbtodos);
        res.json(dbtodos);
      })
      .catch(function (error) {
        res.json(error);
      });
  });


  app.put('/api/todos/:id', function (req, res) {
    todos.findOneAndUpdate({
        _id: req.params.id
      }, {
        $set: {
          completed: req.body.completed
        }
      })
      .then(function (dbtodos) {
        io.emit('update todo', dbtodos);
        res.json('updated');
      })
      .catch(function (error) {
        res.json(error);
      })
  });

  app.delete('/api/todos/:id', function (req, res) {
    todos.findOneAndDelete({
        _id: req.params.id
      })
      .then(function (dbtodos) {
        io.emit('delete todo', dbtodos);
        res.json('deleted');
      })
      .catch(function (error) {
        res.json(error);
      })
  });
}