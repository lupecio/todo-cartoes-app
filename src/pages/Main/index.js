import React, { Component } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import ProductItem from '../../components/ProductItem';
import CategoryItem from '../../components/CategoryItem';

import api from '../../services/api';

import Container from '../../components/Container';
import { Form, SubmitButton, List, Pagination } from './styles';

export default class Main extends Component {
    state = {
        search: '',
        products: [],
        categories: [],
        pages: 0,
        loading: false,
        categorySelected: '',
    };

    async componentDidMount() {
        const products = await api.get(`/products`);
        const categories = await api.get(`/categories`);

        this.setState({
            products: products.data,
            categories: categories.data,
            pages: Math.ceil(products.headers.total / 2),
        });
    }

    componentDidUpdate(_, prevState) {
        const { products } = this.state;

        if (prevState.products !== products) {
            localStorage.setItem('products', JSON.stringify(products));
        }
    }

    handleInputChange = e => {
        this.setState({ search: e.target.value });
    };

    handleSubmit = async e => {
        e.preventDefault();

        this.setState({ loading: true });

        const { search } = this.state;

        const response = await api.get(`/products?name=${search}`);

        const categories = await api.get(`/categories`);

        this.setState({
            products: response.data,
            loading: false,
            categories: categories.data,
        });
    };

    handleClick = async categoryId => {
        this.setState({ loading: true });

        const { search } = this.state;

        const response = await api.get(
            `/products?category=${categoryId}&name=${search}`
        );

        const categories = await api.get(
            `/categories?category_father=${categoryId}`
        );

        if (categories.data.length > 0) {
            this.setState({ categories: categories.data });
        }

        this.setState({
            products: response.data,
            loading: false,
            categorySelected: categoryId,
        });
    };

    handleCleanCategories = async e => {
        e.preventDefault();

        this.setState({ loading: true });

        const products = await api.get(`/products`);

        const categories = await api.get(`/categories`);

        this.setState({
            products: products.data,
            categories: categories.data,
            loading: false,
        });
    };

    handlePaginate = async (e, page) => {
        e.preventDefault();

        this.setState({ loading: true });

        const { search, categorySelected } = this.state;

        const response = await api.get(
            `/products?category=${categorySelected}&name=${search}&page=${page}`
        );

        this.setState({
            products: response.data,
            loading: false,
        });
    };

    render() {
        const { search, products, categories, loading, pages } = this.state;

        const pagesArray = [];
        for (let i = 1; i <= pages; i++) {
            pagesArray.push(i);
        }

        return (
            <Container>
                <h1>Produtos</h1>

                <Form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        placeholder="Pesquisar produto"
                        value={search}
                        onChange={this.handleInputChange}
                    />

                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaSearch color="#FFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>

                <List>
                    {categories.map(category => (
                        <CategoryItem
                            handleClick={this.handleClick}
                            name={category.name}
                            id={category.id}
                        />
                    ))}
                    <button type="submit" onClick={this.handleCleanCategories}>
                        Limpar
                    </button>
                </List>

                <List>
                    {products.map(product => (
                        <ProductItem
                            name={product.name}
                            price={product.price}
                            image={product.image}
                        />
                    ))}
                </List>

                <Pagination>
                    {pagesArray.map(page => (
                        <button
                            onClick={e => {
                                this.handlePaginate(e, page);
                            }}
                            type="submit"
                        >
                            {page}
                        </button>
                    ))}
                </Pagination>
            </Container>
        );
    }
}
