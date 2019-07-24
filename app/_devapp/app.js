import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import Kanban from 'react-advanced-kanban';

/* globals __webpack_public_path__ */
__webpack_public_path__ = `${window.STATIC_URL}/app/assets/bundle/`;


class Myapp extends Component {
    // getData = () => {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', 'app/_devapp/php/connect.php', false);
    //     xhr.setRequestHeader("Content-Type", "text/xml");
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState == 4) {
    //             if (xhr.status == 200) {
    //                 console.log(xhr.responseText);
    //             }
    //         }
    //     };
    //     xhr.send(null);
    // }

    // componentWillMount() {
    //     this.getData();
    // }

    state = {
        "cards": [
            {
                "id": 'task-1',
                "title": 'Take out the garbage',
                "content": 'Take the garbage from the kitchen and take it out to the dumpster on the street.'
            },
            {
                "id": 'task-2',
                "title": 'Take dog out for a walk',
                "content": 'Dog needs to take a walk every morning before going to work, do not forget it!'
            },
        ],
        "columns": {
            "column-1": {
                id: "column-1",
                title: 'To-do',
                cardIds: ['task-1', 'task-2'],
            },
            "column-2": {
                id: "column-2",
                title: 'Done',
                cardIds: [],
            }
        },
        "columnOrder": ["column-1", "column-2"]
    }

    render() {
        return (
            <Kanban
                data={this.state}
            ></Kanban>
        )
    }
}

render(<Myapp/>, document.getElementById('app'));