import React from 'react';
import { Navbar } from '../../components/Navbar/Navbar';
import '../../styles/App.css';
import { ROLES } from '../../constants';
import { Tab } from '../../components/Tab/Tab';
import { OrdersByCitiesStatistic } from '../../components/Statistics/OrdersByCitiesStatistic';
import { OrdersByMastersStatistic } from '../../components/Statistics/OrdersByMastersStatistic';
import { OrdersByDatesStatistic } from '../../components/Statistics/OrdersByDatesStatistic';
import { MasterStatistic } from '../../components/Statistics/MasterStatistic';

const tabs = [
    { title: 'Заказы по датам', component: <OrdersByDatesStatistic /> },
    { title: 'Заказы по городам', component: <OrdersByCitiesStatistic /> },
    { title: 'Заказы по мастерам', component: <OrdersByMastersStatistic /> },
    { title: 'Мастера', component: <MasterStatistic /> }
]

export const Statistics = () => {
    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Статистика</h1>
                <Tab tabs={tabs} defaultTab={0} />
            </div>
        </div>
    )
}
