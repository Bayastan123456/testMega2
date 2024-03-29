import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Обновленная функция getData
async function getData(endpoint) {
    const delay = (0.5 + Math.random() * 2) * 1000
    try {
        const response = await fetch(endpoint)
        const data = await response.json()
        return { data } // Возвращаем объект с данными
    } catch (error) {
        return { error } // Возвращаем объект с ошибкой
    }
}

// Создаем thunk для получения списка продуктов
export const getProducts = createAsyncThunk(
    'products/getProducts',
    async () => {
        return getData('/products.json')
    }
)

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: {
        [getProducts.pending]: (state) => {
            state.loading = true
            state.error = null
        },
        [getProducts.fulfilled]: (state, action) => {
            state.loading = false
            state.items = action.payload.data
            state.error = null
        },
        [getProducts.rejected]: (state, action) => {
            state.loading = false
            state.error = action.payload.error
        },
    },
})

export const selectProducts = (state) => state.products

export default configureStore({
    reducer: {
        products: productsSlice.reducer,
    },
})
