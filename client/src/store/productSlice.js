import {createSlice} from '@reduxjs/toolkit';

const intialValue = {
    allCategory: [],
    loadingCategory: false,
    allSubCategory: [],
    product: []
}

const productSlice = createSlice({
    name: 'product',
    initialState: intialValue,
    reducers: {
        setAllCategory: (state, action) => {
            state.allCategory = [...action.payload]
        },
        loadingCategory: (state, action) => {
            state.loadingCategory = action.payload
        },
        setAllSubCategory: (state, action) => {
            state.allSubCategory = [...action.payload]
        },
    }
})

export const {setAllCategory, setAllSubCategory, loadingCategory} = productSlice.actions
export default productSlice.reducer