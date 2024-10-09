import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fetchGetDataApi = createApi({
    reducerPath: 'fetchGetDataApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.SERVER_URL}` }),
    endpoints: (built) => ({
        fetchAllData: built.query({
            query: () => ({
                url: '/features',
                method: 'GET'
            })
        })
    })
})