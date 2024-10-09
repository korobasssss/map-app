import { rootReducer, store } from "./rootStore"

export type RootStateType = ReturnType<typeof rootReducer>
export type AppStoreType = ReturnType<typeof store>
export type AppDispatchType = AppStoreType['dispatch']