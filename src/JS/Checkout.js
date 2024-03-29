import { useEffect } from 'react'
import styles from './Checkout.module.css'
import { LoadingIcon } from './Icons'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchProducts,
    selectProducts,
    selectTotalPrice,
    updateQuantity,
} from './productSlice'
import { getProducts } from './dataService'

const Product = ({
    id,
    name,
    availableCount,
    price,
    orderedQuantity,
    total,
}) => {
    const dispatch = useDispatch()
    const handleIncrement = () => {
        if (orderedQuantity < availableCount) {
            dispatch(updateQuantity({ id, quantity: orderedQuantity + 1 }))
        }
    }

    const handleDecrement = () => {
        if (orderedQuantity > 0) {
            dispatch(updateQuantity({ id, quantity: orderedQuantity - 1 }))
        }
    }
    return (
        <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{availableCount}</td>
            <td>${price}</td>
            <td>{orderedQuantity}</td>
            <td>${total}</td>
            <td>
                <button
                    className={styles.actionButton}
                    onClick={handleIncrement}
                >
                    +
                </button>
                <button
                    className={styles.actionButton}
                    onClick={handleDecrement}
                >
                    -
                </button>
            </td>
        </tr>
    )
}

const Checkout = () => {
    const dispatch = useDispatch()
    const products = useSelector(selectProducts)
    const totalPrice = useSelector(selectTotalPrice)
    const loading = useSelector((state) => state.products.loading)
    const error = useSelector((state) => state.products.error)
    useEffect(() => {
        dispatch(fetchProducts())
    }, [dispatch])

    useEffect(() => {
        getProducts()
            .then((data) => {
                console.log('Products:', data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }, [])

    const discount = totalPrice > 1000 ? (totalPrice * 0.1).toFixed(2) : 0
    const discountedTotalPrice = (totalPrice - discount).toFixed(2)
    return (
        <div>
            <header className={styles.header}>
                <h1>Electro World</h1>
            </header>
            <main>
                {loading ? <LoadingIcon /> : <></>}
                {error ? (
                    <h4 style={{ color: 'red' }}>Some thing went wrong</h4>
                ) : (
                    <></>
                )}

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product Name</th>
                            <th># Available</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <Product
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                availableCount={product.availableCount}
                                price={product.price}
                                orderedQuantity={product.orderedQuantity}
                            />
                        ))}
                    </tbody>
                </table>
                <h2>Order summary</h2>
                <p>Total price: ${totalPrice}</p>
                {discount > 0 && <p>Discount: ${discount}</p>}
                <p>Total after discount: ${discountedTotalPrice}</p>
            </main>
        </div>
    )
}

export default Checkout
