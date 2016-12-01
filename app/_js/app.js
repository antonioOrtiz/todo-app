(function() {
    var todoListItems = [],
        doc = document,
        todoapp = doc.getElementById('todoapp'),
        addTodoLink = doc.getElementById('add-todo');

    function getUuid() {
        var i, random,
            uuid = '';
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }

    function TodoItem(title, completed) {
        this.title = title;
        this.completed = completed;
        this.id = getUuid();
    }

    function redrawList() {
        var i;
        var list = document.getElementById('todo-list');
        var len = todoListItems.length;
        list.innerHTML = "";
        for (i = 0; i < len; i++) {
            var todo = todoListItems[i];
            var item = document.createElement("li");
            item.id = "li_" + todo.id;
            if (todo.completed) {
                item.className += "completed"
            }

            // checkbox

            var checkbox = document.createElement('input');
            checkbox.className = "toggle";
            checkbox.type = "checkbox";
            checkbox.addEventListener('change', checkboxChangeHandler);
            checkbox.checked = todo.completed;
            checkbox.setAttribute('data-todo-id', todo.id);

            // label

            var label = document.createElement('label');
            label.appendChild(document.createTextNode(todo.title));
            label.addEventListener('dblclick', editItemHandler);
            label.setAttribute('data-todo-id', todo.id);

            // delete button
            deleteButton = document.createElement('button');
            deleteButton.className = 'destroy';
            deleteButton.setAttribute('data-todo-id', todo.id);
            deleteButton.addEventListener('click', deleteClickHandler);

            // div wrapper

            var divDisplay = document.createElement('div');
            divDisplay.className = "view";
            divDisplay.appendChild(checkbox);
            divDisplay.appendChild(label);
            divDisplay.appendChild(deleteButton);

            item.appendChild(divDisplay);

            list.appendChild(item);
        }
        addTodoLink.classList.add('hidden');
    }

    function editTodo(id, text) {
        var todo = getTodoById(id);
        if (todo) {
            todo.title = text;
            saveList();
            redrawList();
        }
    }

    function deleteTodo(id) {
        var index = getTodoIndexById(id);
        if (index > -1) {
            todoListItems.splice(index, 1);
            saveList();
            redrawList();
        }
    }

    function deleteClickHandler(event) {
        var button = event.target;
        var id = button.getAttribute('data-todo-id');
        deleteTodo(id);
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
            if (typeof(item.id) === 'undefined') {
                todoListItems[i] = new TodoItem(item.title, item.completed);
            }
        }
    }

    function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    function reloadList(item) {
        if (storageAvailable('localStorage')) {
            // Yippee! We can use localStorage awesomeness
            var stored = localStorage.getItem('todo-list');
            if (stored) {
                todoListItems = JSON.parse(stored);
                migrateData();
            }
            redrawList();
        } else {
            // Too bad, no localStorage for us
            console.log('We can\'t seem to use localStorage because it is not available in this browser');
        }
    }

    function getTodoById(id) {
        var i, l;
        for (i = 0, l = todoListItems.length; i < l; i++) {
            if (todoListItems[i].id == id) return todoListItems[i];
        }
        return null;
    }

    function getTodoIndexById(id) {
        var i, l;
        for (i = 0, l = todoListItems.length; i < l; i++) {
            if (todoListItems[i].id == id) return i;
        }
        return -1;
    }

    function saveList() {
        localStorage.setItem('todo-list', JSON.stringify(todoListItems));
    }

    function checkboxChangeHandler(event) {
        var checkbox = event.target;
        var id = checkbox.getAttribute('data-todo-id');
        var todo = getTodoById(id)
        todo.completed = checkbox.checked;
        saveList();
        redrawList();
    }

    function newTodoKeyPressHandler(event) {
        if (event.keyCode === 13) {
            var todoField = document.getElementById('new-todo');
            var text = todoField.value.trim();
            if (text !== '') {
                addToList(todoField.value);
                redrawList();
                todoField.value = "";
            }
        }
    }

    function inputEditItemKeyPressHandler(event) {
        if (event.keyCode === 13) {
            // statement
            var input = event.target,
                text = input.value.trim(),
                id = input.getAttribute('data-todo-id');
            input.removeEventListener('blur', inputEditItemKeyPressHandler);
            if (text === '') {
                // statement
                deleteTodo(id);
            } else {
                // statement
                editTodo(id, text);
            }
        }
    }

    function inputEditItemBlurHandler(event) {
        var input = event.target;
        var text = input.value.trim();
        var id = input.getAttribute('data-todo-id');
        if (text === '') {
            deleteTodo(id);
        } else {
            editTodo(id, text);
        }
    }

    function editItemHandler(event) {
        var label = event.target;
        var id = label.getAttribute('data-todo-id');
        var todo = getTodoById(id);
        var li = document.getElementById('li_' + id)
        var input = document.createElement('input');
        input.setAttribute('data-todo-id', id);
        input.className = "edit";
        input.value = todo.title;
        input.addEventListener('keypress', inputEditItemKeypressHandler);
        input.addEventListener('blur', inputEditItemBlurHandler);
        li.appendChild(input);
        li.className = "editing";
        input.focus();
    }

    function hideTodo() {
        todoapp.parentNode.removeChild(todoapp);
        addTodoLink.classList.remove('hidden');
    }

    function addTodo() {
        var parentOfFooter = doc.getElementById('footer').parentNode,
            footer = doc.getElementById('footer');
        parentOfFooter.insertBefore(todoapp, footer);
        addTodoLink.classList.add('hidden');
    }
    window.addEventListener('load', windowLoadHandler, false);

    function windowLoadHandler() {
        reloadList();
        document.getElementById('add-todo').addEventListener('click', addTodo, false);
        document.getElementById('close-todo').addEventListener('click', hideTodo, false);
        document.getElementById('new-todo').addEventListener('keypress', newTodoKeyPressHandler, false);
    }
}());
