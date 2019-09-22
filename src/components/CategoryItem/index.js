import React from 'react';

import { Category } from './styles';

function CategoryItem({ name, id, handleClick }) {
    return (
        <Category>
            <button onClick={() => handleClick(id)}>{name}</button>
        </Category>
    );
}

export default CategoryItem;
