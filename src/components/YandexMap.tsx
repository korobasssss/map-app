import { ListBox, ListBoxItem, Map, ObjectManager, YMaps } from '@pbe/react-yandex-maps';
import { useCallback, useEffect, useState } from 'react';
import { fetchGetDataApi } from '../store/api/fetchGetDataApi';
import { useAppDispatch } from '../store/hooks';
import { setCount } from '../store/reducers/countSlice';

const enum TYPE {
    FULL = 'Полная',
    EMPTY = 'Пустая'
}

export const YandexMap: React.FC = () => {
    const dispatch = useAppDispatch();
    const [collection, setCollection] = useState<any[]>([]);

    const [ListBoxItems, setListBoxItems] = useState([
        {
            key: TYPE.EMPTY,
            title: TYPE.EMPTY,
            isSelected: true
        },
        {
            key: TYPE.FULL,
            title: TYPE.FULL,
            isSelected: true
        }
    ])

    const [filters, setFilters] = useState<(string | null)[]>([TYPE.EMPTY, TYPE.FULL]);

    const { data } = fetchGetDataApi.useFetchAllDataQuery('', {
        pollingInterval: 5000,
        skipPollingIfUnfocused: true,
    });

    useEffect(() => {
        if (data && Array.isArray(data)) {

            setCollection([...data]);

            const totalCount = data.length;
            let emptyCount = 0;
            let fullCount = 0;

            data.forEach((item: any) => {
                if (item.properties.balloonContent === TYPE.FULL) {
                    fullCount++;
                } else {
                    emptyCount++;
                }
            });

            dispatch(setCount({ emptyCount, totalCount, fullCount }));
        }
    }, [data, dispatch]);

    const handleFilter = useCallback((title: string, action: number) => {
        const filtersCopy = [...filters]
        const ListBoxItemsCopy = [...ListBoxItems]
        if (action === 0 ) {
            if (title === TYPE.FULL) {
                filtersCopy[1] = null
                ListBoxItemsCopy[1].isSelected = false
            } else {
                filtersCopy[0] = null
                ListBoxItemsCopy[0].isSelected = false
            }
        } else {
            if (title === TYPE.FULL) {
                filtersCopy[1] = TYPE.FULL
                ListBoxItemsCopy[1].isSelected = true
            } else {
                filtersCopy[0] = TYPE.EMPTY
                ListBoxItemsCopy[0].isSelected = true
            }
        }
        setFilters(filtersCopy)
        setListBoxItems(ListBoxItemsCopy)
    }, [filters, ListBoxItems])

    return (
        <YMaps>
            <Map defaultState={{ center: [55.75, 37.57], zoom: 11 }} style={{ width: '100%', height: '100vh' }}>
                <ObjectManager
                    key={JSON.stringify(collection)}
                    objects={{
                        openBalloonOnClick: true,
                    }}
                    clusters={{ 
                        preset: 'islands#pieClusterIcons',
                    }}
                    options={{
                        clusterize: true,
                        gridSize: 32,
                        
                    }}
                    features={(!filters[0] && !filters[1]) || (filters[0] && filters[1]) ? collection : 
                        collection.filter(items => items.properties.balloonContent === filters[0] || items.properties.balloonContent === filters[1])}
                    modules={[
                        "objectManager.addon.objectsBalloon",
                        "objectManager.addon.clustersBalloon",
                    ]}
                />
                <ListBox data={{ content: "Фильтры" }}
                    onChange={handleFilter}>
                    {
                        ListBoxItems.map((item: {key: string, title: string, isSelected: boolean}) => {
                            return (
                                <ListBoxItem data={{ content: item.title}} state={ {selected: item.isSelected }} key={item.key}
                                            onClick={() => handleFilter(item.title, item.isSelected ? 0 : 1)}/>
                            )
                        })
                    }
                </ListBox>
            </Map>
        </YMaps>
    );
};