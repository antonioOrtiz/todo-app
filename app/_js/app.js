(function() {

    var todoListItems = [], doc = document;

    function getUuid () {
        // body... 
        var i, random, uuid = '';

        for(var i = 0, i < 32; i++){
            random = Math.rnadom() * 16 | 0;
        }

    }

    function TodoItem(title, completed) {
        this.title = title;
        this.completed = completed;
    }

    function redrawList() {
        var i;
        var list = doc.getElementById('todo-list');
        var len = todoListItems.length;
        list.innerHTML = "";
        for (i = 0; i < len; i++) {
            var todo = todoListItems[i];
            var item = doc.createElement("li");
            if (todo.completed) {
                item.className += "completed";
            }

            // checkbox

            var checkbox = doc.createElement('input');
            checkbox.className = "toggle";
            checkbox.type = "checkbox";
            checkbox.addEventListener('change', checkboxChangeHandler);
            checkbox.checked = todo.completed;
            checkbox.setAttribute('data-todo-id', i);

            // label

            var label = doc.createElement('label');
            label.appendChild(doc.createTextNode(todo.title));


            // div wrapper
            var divDisplay = doc.createElement('div');
            divDisplay.className = "view";
            divDisplay.appendChild(checkbox);
            divDisplay.appendChild(label);

            item.appendChild(divDisplay);

            list.appendChild(item);

            // delete button
            deleteButton = doc.createElement('button');
            deleteButton.className = 'destroy';
            deleteButton.setAttribute('data-todo-id', i);
            deleteButton.addEventListener('click', deleteClickHandler);

            divDisplay.appendChild(deleteButton);
        }
    }

    function deleteTodo(index) {
        todoListItems.splice(index, 1);
        saveList();
        redrawList();
    }

    function deleteClickHandler(event) {
        var button = event.target,
            index = button.getAttribute('data-todo-id');
        deleteTodo(index);
    }


    function addToList(title) {
        var todo = new TodoItem(title, false);
        todoListItems.push(todo);
        saveList();
    }

    function migrateData() {
        var i, l;
        for (i = 0, l = todoListItems.length; i < l; i++) {
            item = todoListItems[i];
            if (typeof(item) === 'string') {
                todoListItems[i] = new TodoItem(item, false);
            }
        }
    }

    function reloadList(item) {
        var stored = localStorage.getItem('todo-list');
        if (stored) {
            todoListItems = JSON.parse(stored);
            migrateData();
        }
        redrawList();
    }

    function saveList() {
        localStorage.setItem('todo-list', JSON.stringify(todoListItems));
    }

    function checkboxChangeHandler(event) {
        var checkbox = event.target;
        var index = checkbox.getAttribute('data-todo-id');
        var todo = todoListItems[index];
        todo.completed = checkbox.checked;
        saveList();
        redrawList();
    }

    function newTodoKeyPressHandler(event) {
        if (event.keyCode === 13) {
            var todoField = doc.getElementById('new-todo'),
                text = todoField.value.trim();
            if (text !== '') {
                addToList(todoField.value);
                redrawList();
                todoField.value = '';
            }
        }
    }

    function inputEditItemKeyPressHandler(event) {
        if (event.keyCode === 13) {
            // statement
            var input = event.target,
                text = input.value.trim(),
                index = input.getAttribute('data-todo-id');
            input.removeEventListener('blur', inputEditItemKeyPressHandler);

            if (text === '') {
                // statement
                deleteTodo(index);
            } else {
                // statement
                editTodo(index, text);
            }

        }
    }

    function inputEditItemBlurHandler (event) {
        // body... 
        var input = event.target,
            text = input.value.trim(),
            index = input.getAttribute('data-todo-id');
        if (text === '') {
            // statement
            deleteTodo(index);
        } else {
            // statement
            editTodo(index, text);
        }
    }

    window.addEventListener('load', windowLoadHandler, false);

    function windowLoadHandler() {
        reloadList();
        document.getElementById('new-todo').addEventListener('keypress', newTodoKeyPressHandler, false);
    }
}());
