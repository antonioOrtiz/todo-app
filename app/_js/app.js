(function() {

    var todoListItems = [],
        doc = document;

    // function getUuid () {
    //     // body... 
    //     var i, random, uuid = '';

    //     for(var i = 0, i < 32; i++){
    //         random = Math.rnadom() * 16 | 0;
    //         if (i === 8 || i === 12 || i === 16 || i === 20) {
    //             // statement
    //             uuid += '-';
    //         } 
    //         uuid +=
    //     }

    // }

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
                item.id = "li_" + i;
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
            label.addEventListener('dblclick', editItemHandler);
            label.setAttribute('data-todo-id', i);


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

    function editTodo(index, text) {
        todoListItems[index].title = text;
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

    function saveList() {
        localStorage.setItem('todo-list', JSON.stringify(todoListItems));
    }

    function checkboxChangeHandler(event) {
        var checkbox = event.target,
            index = checkbox.getAttribute('data-todo-id'),
            todo = todoListItems[index];
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

    function inputEditItemBlurHandler(event) {
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

    function editItemHandler(event) {
        // body... 
        var label = event.target,
            index = label.getAttribute('data-todo-id');
        todo = todoListItems[index];
        li = doc.getElementById('li_' + index);
        input = doc.createElement('input');

        input.setAttribute('data-todo-id', index);
        input.className = 'edit';
        input.value = todo.title;
        input.addEventListener('keypress', inputEditItemKeyPressHandler);
        input.addEventListener('blur', inputEditItemBlurHandler);

        li.appendChild(input);
        li.className = 'editing';
        input.focus();
    }




    window.addEventListener('load', windowLoadHandler, false);

    function windowLoadHandler() {
        reloadList();
        document.getElementById('new-todo').addEventListener('keypress', newTodoKeyPressHandler, false);
    }
}());
