import React from 'react';

import { Product } from './styles';

function ProductItem({ name, price, image }) {
    return (
        <Product>
            <img src={image} alt={name} />
            <span>{name}</span>
            <strong>R$ {price}</strong>
        </Product>
    );
}

export default ProductItem;
