import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import Kanban from 'react-advanced-kanban';
import "@babel/polyfill";


import setUp from './js/getStructure';
import renderer from './js/renderer';

/* globals __webpack_public_path__ */
__webpack_public_path__ = `${window.STATIC_URL}/app/assets/bundle/`;


class Myapp extends Component {
    state = {
        "data": {
            "cards": [],
            "columns": {},
            "columnOrder": []
        }
    }


    componentDidMount() {
        setUp(this);
    }

    onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const start = this.state.data.columns[source.droppableId];
        const finish = this.state.data.columns[destination.droppableId];

        if (start === finish) {
            const newCardIds = Array.from(start.cardIds);
            newCardIds.splice(source.index, 1);
            newCardIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                cardIds: newCardIds,
            };

            const newState = {
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn
                }
            };

            this.setState(newState);
            return;
        }

        const startCardIds = Array.from(start.cardIds);
        startCardIds.splice(source.index, 1);
        const newStart = {
            ...start,
            cardIds: startCardIds,
        }

        const finishCardIds = Array.from(finish.cardIds);
        finishCardIds.splice(destination.index, 0, draggableId);

        const newFinish = {
            ...finish,
            cardIds: finishCardIds,
        }

        const newState = {
            ...this.state,
            data: {
                ...this.state.data,
                columns: {
                    ...this.state.data.columns,
                    [newStart.id]: newStart,
                    [newFinish.id]: newFinish,
                }
            }
        }

        this.setState(newState);

        const card = this.state.data.cards.find(card => card.id == draggableId);
        const sid = card.sid;

        global.JF.getSubmission(sid, response => {
            const newResponse = {};
            newResponse[this.state.qid] = this.state.data.columns[destination.droppableId].title;

            global.JF.editSubmission(sid, newResponse, response => {
                console.log(response);
            })
        })
    }

    addCard = (columnId) => {
        const submission = new Object();
        const columnTitle = this.state.data.columns[columnId].title;


        const newCard = {
            id: `task-${this.state.data.cards.length + 1}`,
            content: 'New Card',
            column: columnTitle
        }

        this.state.data.cards.push(newCard);
        this.state.data.columns[columnId].cardIds.push(newCard.id);

        this.setState(this.state);

        if(columnTitle != "Uncategorized") {
            submission[this.state.qid] = columnTitle;
        } else {
            submission[this.state.qid] = '';
        }

        submission[this.state.questions[1].qid] = newCard.content;

        JF.createFormSubmission(this.state.fid, submission, function (response) {
            console.log(response.URL);
        });
    }

    editCard = (editedCard) => {
        let cardIndex;
        const newState = this.state;

        this.state.data.cards.map((card, index) => {
            if (card.id === editedCard.id) {
                cardIndex = index;
            }
        })

        newState.data.cards[cardIndex] = {
            ...newState.data.cards[cardIndex],
            ...editedCard
        };

        this.setState(newState);

        const submission = new Object();
        submission[this.state.questions[1].qid] = editedCard.content;

        JF.editSubmission(newState.data.cards[cardIndex].sid, submission, function (response) {
            console.log(response.submissionID);
        })

    }

    editColumn = (editedColumn) => {
        const newState = this.state;
        newState.data.columns[editedColumn.id] = editedColumn;

        this.setState(newState);
    }

    render() {
        return (
            <Kanban 
                data={ this.state.data } 
                onDragEnd={this.onDragEnd}
                addCard={this.addCard}
                editCard={this.editCard}
                editColumn={this.editColumn}
                renderer={renderer}
            ></Kanban>
        )
    }
}

render(<Myapp/>, document.getElementById('app'));