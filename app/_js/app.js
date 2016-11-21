(function(window, document) {
    'use strict';

    var doc = document;

    window.addEventListener('load', windowLoadHandler, false);

    function newTodoKeyPressHandler(event) {
        // body... 
           
              var todoField = doc.getElementById('new-todo'),
                  list = doc.getElementById('todo-list'),
                  item = doc.createElement('li');

        if (event.keyCode === 13) {
            // statement
            console.log('We have a new Todo');
          


                item.appendChild(doc.createTextNode(todoField.value));
                list.appendChild(item);
                todoField.value = '';


        }
    }

    function windowLoadHandler() {
        // body... 
        doc.getElementById('new-todo').addEventListener('keypress', newTodoKeyPressHandler, false);
    }

})(window, document);
