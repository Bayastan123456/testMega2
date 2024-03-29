import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProducts } from './dataService'

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const response = await getProducts()
        return response
    }
)

const initialState = {
    products: [],
    loading: false,
    error: null,
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        updateQuantity(state, action) {
            const { id, quantity } = action.payload
            const product = state.products.find((prod) => prod.id === id)
            if (product) {
                product.orderedQuantity = quantity
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.error = null
                state.products = action.payload
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export const { updateQuantity } = productsSlice.actions

export const selectProducts = (state) => state.products.products
export const selectTotalPrice = (state) =>
    state.products.products.reduce(
        (total, product) => total + product.price * product.orderedQuantity,
        0
    )

export const productsReducer = productsSlice.reducer
