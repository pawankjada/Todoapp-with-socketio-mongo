$(function () {

  var d = moment().format("MMM Do YYYY");
  $('.date').html(d)



  $(document).ready(function () {
    // Getting a reference to the input field where user adds a new todo
    var $newItemInput = $("#input-task");
    // Our new todos will go inside the todoContainer
    var $todoContainer = $(".newtask");
    // Adding event listeners for deleting, editing, and adding todos
    $(document).on("click", "x", deleteTodo);
    $(document).on("click", ".create", editTodo);
    $(document).on("keyup", ".create", finishEdit);
    $(document).on("blur", ".create", cancelEdit);
    $(document).on("submit", ".newtask", insertTodo);

    // Our initial todos array
    var todos = [];

    // Getting todos from database when page loads
    getTodos();

    // This function resets the todos displayed with new todos from the database
    function initializeRows() {
      $todoContainer.empty();
      var rowsToAdd = [];
      for (var i = 0; i < todos.length; i++) {
        rowsToAdd.push(createNewRow(todos[i]));
      }
      $todoContainer.prepend(rowsToAdd);
    }

    // This function grabs todos from the database and updates the view
    function getTodos() {
      $.get("/api/todos", function (data) {
        todos = data;
        initializeRows();
      });
    }

    // This function deletes a todo when the user clicks the delete button
    function deleteTodo(event) {
      event.stopPropagation();
      var id = $(this).data("id");
      $.ajax({
        method: "DELETE",
        url: "/api/todos/" + id
      }).then(getTodos);
    }

    // This function handles showing the input box for a user to edit a todo
    function editTodo() {
      var currentTodo = $(this).data("todo");
      $(this).children().hide();
      $(this).children("input.edit").val(currentTodo.text);
      $(this).children("input.edit").show();
      $(this).children("input.edit").focus();
    }


    // This function starts updating a todo in the database if a user hits the "Enter Key"
    // While in edit mode
    function finishEdit(event) {
      var updatedTodo = $(this).data("todo");
      if (event.which === 13) {
        updatedTodo.text = $(this).children("input").val().trim();
        $(this).blur();
        updateTodo(updatedTodo);
      }
    }

    // This function updates a todo in our database
    function updateTodo(todo) {
      $.ajax({
        method: "PUT",
        url: "/api/todos",
        data: todo
      }).then(getTodos);
    }

    // This function is called whenever a todo item is in edit mode and loses focus
    // This cancels any edits being made
    function cancelEdit() {
      var currentTodo = $(this).data("todo");
      if (currentTodo) {
        $(this).children().hide();
        $(this).children("input.edit").val(currentTodo.text);
        $(this).children("span").show();
        $(this).children("button").show();
      }
    }

    // This function constructs a todo-item row
    function createNewRow(todo) {
      var $newInputRow = $(
        [
          `<ul>
            <li>
              <span>
                <p class="task">${todo.text}</p><i class="far fa-times-circle" id='x'></i>
              </span>
              </li>
          </ul>`
        ].join("")
      );

      $newInputRow.find("x").data("id", todo.id);
      $newInputRow.data("todo", todo);
      return $newInputRow;
    }

    // This function inserts a new todo into our database and then updates the view
    function insertTodo(event) {
      event.preventDefault();
      var todo = {
        text: $newItemInput.val().trim(),
        complete: false
      };

      $.post("/api/todos", todo, getTodos);
      $newItemInput.val("");
    }
  });


  const socket = io();
  socket.on('new todo', function (todo) {
    console.log(todo);
    getTodos();
  });

  socket.on('delete todo', function (todo) {
    console.log(todo);
    getTodos();
  });

  socket.on('update todo', function (todo) {
    console.log(todo);
    getTodos();
  });
});