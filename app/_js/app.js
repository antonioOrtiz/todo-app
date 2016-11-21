(function(window, document) {
    'use strict';

    var doc = document, todoListItems = [];

    function redrawList() {
        // body... 
        var i, 
            list = doc.getElementById('todo-list'), 
            len = todoListItems.length;
            list.innerHTML = '';

            for (i=0; i < len; i++){
                var item = document.createElement('li');
                item.appendChild(
                    doc.createTextNode(todoListItems[i].value)
                );
                list.appendChild(item);
            } 
    }

    window.addEventListener('load', windowLoadHandler, false);


    function newTodoKeyPressHandler(event) {
        // body... 

        var todoField = doc.getElementById('new-todo'),
            list = doc.getElementById('todo-list'),
            item = doc.createElement('li');

        if (event.keyCode === 13) {
            // statement

            item.appendChild(doc.createTextNode(todoField.value));
            list.appendChild(item);
            todoField.value = '';
            console.log('We have a new Todo');


        }
    }

    function windowLoadHandler() {
        // body... 
        doc.getElementById('new-todo').addEventListener('keypress', newTodoKeyPressHandler, false);
    }

})(window, document);
