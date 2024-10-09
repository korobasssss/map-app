declare global {
  interface Window {
    ymaps: any;
  }
}

import { FC, useEffect, useRef, useState } from 'react';
import { fetchGetDataApi } from '../store/api/fetchGetDataApi';
import { setCount } from '../store/reducers/countSlice';
import { useAppDispatch } from '../store/hooks';

export const YandexMap: FC = () => {
    const dispatch = useAppDispatch();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const isInitialized = useRef(false);
    const [objectManager, setObjectManager] = useState<any | null>(null);

    const { data } = fetchGetDataApi.useFetchAllDataQuery('', {
        pollingInterval: 5000,
        skipPollingIfUnfocused: true,
    });

    useEffect(() => {
        if (!objectManager || !data) return;

        objectManager.removeAll();
        
        objectManager.add(data);

        const totalCount = data.length;
        let emptyCount = 0;
        let fullCount = 0;

        data.forEach((item: any) => {
            if (item.properties.balloonContent === "Полная") {
                fullCount++;
            } else {
                emptyCount++;
            }
        });

        dispatch(setCount({ emptyCount, totalCount, fullCount }));
    }, [data, dispatch, objectManager])

    useEffect(() => {
        const init = () => {
            const myMap = new window.ymaps.Map(mapContainerRef.current as HTMLDivElement, {
                center: [55.76, 37.64],
                zoom: 10,
                controls: []
            });
    
            const objectManagerInstance = new window.ymaps.ObjectManager({
                clusterize: true,
                gridSize: 64,
                clusterIconLayout: "default#pieChart"
            });
    
            myMap.geoObjects.add(objectManagerInstance);

            setObjectManager(objectManagerInstance);
    
            const listBoxItems = ['Полная', 'Пустая'].map(title => 
                new window.ymaps.control.ListBoxItem({
                    data: { content: title },
                    state: { selected: true }
                })
            );

            const reducer = (filters: Record<string, boolean>, filter: any) => {
                filters[filter.data.get('content')] = filter.isSelected();
                return filters;
            };
    
            const listBoxControl = new window.ymaps.control.ListBox({
                data: {
                    content: 'Фильтр',
                    title: 'Фильтр'
                },
                items: listBoxItems,
                state: {
                    expanded: false,
                    filters: listBoxItems.reduce(reducer, {})
                }
            });
    
            myMap.controls.add(listBoxControl, {
                float: 'none',
                position: { top: '10px', left: '10px' }
            });
    
            listBoxControl.events.add(['select', 'deselect'], (e: any) => {
                const listBoxItem = e.get('target');
                const filters = { ...listBoxControl.state.get('filters') };
                filters[listBoxItem.data.get('content')] = listBoxItem.isSelected();
                listBoxControl.state.set('filters', filters);
            });
    
            const filterMonitor = new window.ymaps.Monitor(listBoxControl.state);
            
            filterMonitor.add('filters', (filters: any) => {
                objectManagerInstance.setFilter(getFilterFunction(filters));
            });
    
            function getFilterFunction(categories: Record<string, boolean>) {
                return (obj: any) => categories[obj.properties.balloonContent];
            }
        };

        if (!isInitialized.current) {
            window.ymaps.ready(init);
            isInitialized.current = true;
        }
    }, []);

    return (
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
    );
};