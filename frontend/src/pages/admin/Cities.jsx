import React, { useEffect, useState } from 'react';
import { CityService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { CityForm } from '../../components/Forms/CityForm';
import { ROLES } from '../../constants';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { Table } from '../../components/Table/Table';
import { ColumnHead } from '../../components/Table/ColumnHead';
import { CityFilterForm } from '../../components/Forms/CityFilterForm';
// import { AdminMap } from '../../components/Map/AdminMap';

const defaultCity = {
    name: '',
    price: 0
};

const defaultSortByField = {
    sortedField: 'id',
    isDirectedASC: true
};
const defaultFilters = {
    name: ''
};
const defaultPagination = {
    page: 1,
    limit: 10
};
const tableHeaders = [
    { value: 'id', title: 'id', sortable: true },
    { value: 'name', title: 'Имя', sortable: true },
    { value: 'price', title: 'Цена', sortable: true },
    { value: 'change', title: 'Изменение', sortable: false },
    { value: 'delete', title: 'Удаление', sortable: false }
];

export const Cities = () => {
    const [cities, setCities] = useState([]);

    const [currentCity, setCurrentCity] = useState(defaultCity);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isMapOpened, setIsMapOpened] = useState(false);

    const [pagination, setPagination] = useState(defaultPagination);
    const [filters, setFilters] = useState(defaultFilters);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities({ ...pagination, ...sortByField, ...filters });
        setTotalPages(Math.ceil(cities.count / pagination.limit));
        setCities(cities.rows);
    });

    useEffect(() => {
        document.title = "Города - Clockwise Clockware";
        fetchCities();
    }, []);

    useEffect(() => {
        fetchCities();
    }, [pagination, sortByField, filters]);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentCity(null);
    }, [isModalOpened]);

    const deleteCity = async (id) => {
        try {
            await CityService.deleteCityById(id);
            notify(NOTIFY_TYPES.SUCCESS, 'Город успешно удален');
            fetchCities();
        } catch (error) {
            if(error.response.data === 'There are orders in this city') {
                notify(NOTIFY_TYPES.ERROR, 'В данном городе есть заказы. Его удаление невозможно!');
            } else {
                notify(NOTIFY_TYPES.ERROR);
            }
            console.log(error.response.data);
        }
    }
    const addCity = async (city) => {
        try {
            await CityService.addCity(city);
            notify(NOTIFY_TYPES.SUCCESS, 'Город успешно добавлен');
            setIsModalOpened(false);
            fetchCities();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const updateCity = async (city) => {
        try {
            await CityService.updateCityById(city);
            notify(NOTIFY_TYPES.SUCCESS, 'Город успешно изменен');
            setIsModalOpened(false);
            fetchCities();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Города</h1>
                <div className='admin-body__top'>
                    <CityFilterForm filters={defaultFilters} setFilters={setFilters}
                        onClick={newFilterState => { JSON.stringify(filters) !== JSON.stringify(newFilterState) && setFilters(newFilterState); }} ></CityFilterForm>
                    <div className="admin-body__btns">
                        <AdminButton onClick={() => { setIsModalOpened(true); setCurrentCity(defaultCity) }}>
                            Добавить
                        </AdminButton>
                    </div>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentCity && <CityForm city={currentCity}
                        onClick={currentCity.id ? updateCity : addCity}
                        btnTitle={currentCity.id ? 'Изменить' : 'Добавить'}
                        mapBtnTitle={currentCity?.MapArea?.length ? 'Изменить область' : 'Добавить область'}
                        openMap={() => setIsMapOpened(true)} />}
                </MyModal>
                <MyModal visible={isMapOpened} setVisible={setIsMapOpened}>
                    {/* {isMapOpened && <AdminMap onChange={() => { setIsMapOpened(false); fetchCities(); }} cityId={currentCity?.id} />} */}
                </MyModal>

                <Table changeLimit={limit => setPagination({ ...pagination, limit: limit })}
                    changePage={changeTo => (changeTo > 0 && changeTo <= totalPages) && setPagination({ ...pagination, page: changeTo })}
                    currentPage={pagination.page} totalPages={totalPages}>
                    <thead>
                        <tr>
                            {tableHeaders.map(tableHeader => <ColumnHead value={tableHeader.value} title={tableHeader.title}
                                key={tableHeader.value} sortable={tableHeader.sortable} sortByField={sortByField}
                                onClick={tableHeader.sortable &&
                                    (sortedField => sortByField.sortedField === sortedField
                                        ? setSortByField({ sortedField: sortedField, isDirectedASC: !sortByField.isDirectedASC })
                                        : setSortByField({ sortedField: sortedField, isDirectedASC: true }))} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {cities.map(city => <tr key={city.id}>
                            <td>{city.id}</td>
                            <td>{city.name}</td>
                            <td>{city.price}</td>
                            <td className='tableLink' onClick={() => { setIsModalOpened(true); setCurrentCity(cities.find(cityToFind => cityToFind.id === city.id)) }}><span>Изменить</span></td>
                            <td className='tableLink' onClick={() => deleteCity(city.id)}><span>Удалить</span></td>
                        </tr>
                        )}
                    </tbody>
                </Table>

                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {cities.length === 0 && !isCitiesLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isCitiesLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}
