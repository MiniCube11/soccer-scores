import React from 'react'

function CategoryButton({ category, key, changeStatus, gameStatus}) {
    return (
        <button key={key} onClick={() => changeStatus(category)} className={`${gameStatus === category ? 'selected-btn' : 'normal-btn'}`}>{ category }</button>
    )
}

export default CategoryButton
