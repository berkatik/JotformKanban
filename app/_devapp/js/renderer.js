import React from 'react'

import '../css/renderer.css'

const makeCardEditable = id => {
    document.getElementById(`title__card-${id}`).contentEditable = true;
}

const editCardContent = (id, editCardState, e) => {
    if (e.keyCode === 13 || e.type === 'blur') {
        document.getElementById(`title__card-${id}`).contentEditable = false;

        const newTitle = document.getElementById(`title__card-${id}`).innerText;
        const newCard = {
            id: id,
            content: newTitle,
        }
        editCardState(newCard);
    }
}

const Renderer = (card, editCardState, index) => {
    return (
        <div className="card">
            <p id={`title__card-${card.id}`}
                className="title"
                onDoubleClick={() => { makeCardEditable(card.id) }}
                onBlur={e => { editCardContent(card.id, editCardState, e) }}
                onKeyDown={e => { editCardContent(card.id, editCardState, e) }}
            >{card.content}</p>
        </div>
    )
}

export default Renderer;