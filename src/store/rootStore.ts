import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { fetchGetDataApi } from "./api/fetchGetDataApi";
import { countSlice } from "./reducers/countSlice";


export const rootReducer = combineReducers({
    [fetchGetDataApi.reducerPath]: fetchGetDataApi.reducer,
    count: countSlice.reducer
})

export const store = () => 
    configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(fetchGetDataApi.middleware)
    })