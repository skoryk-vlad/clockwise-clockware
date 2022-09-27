import React, { useState } from 'react';
import { OrderButton } from '../OrderButton/OrderButton';
import classes from './MasterChoice.module.css';

export const MasterChoice = ({ freeMasters, returnForm, addOrder, price }) => {
    const [chosenMaster, setChosenMaster] = useState(null);

    return (
        <div className={classes.mastersBlock}>
            <div className={classes.mastersList}>
                {
                    freeMasters.map(master =>
                        <div key={master.id} id={master.id} className={`${classes.masterItem} mstr_itm ${+chosenMaster === master.id ? classes.active : ''}`}>
                            <div className={classes.masterName}>{master.name}</div>
                            <div className={classes.masterRating}>Рейтинг: {master.rating}</div>
                            <OrderButton onClick={event => setChosenMaster(+event.target.closest(`.mstr_itm`).id)} className={classes.masterBtn}>Выбрать</OrderButton>
                        </div>
                    )
                }
                {
                    freeMasters.length === 0 &&
                    <div className={classes.warning}>К сожалению, мастеров на это время в этот день нет. Выберите другое время или дату.</div>
                }
            </div>
            <div className={classes.return} onClick={returnForm}>
                <img src="/images/icons/top.png" alt="Назад" />
            </div>
            <div className={classes.formBottom}>
                <OrderButton onClick={() => addOrder(chosenMaster)} className={(chosenMaster === null ? "disabledBtn" : '')}
                    disabled={chosenMaster === null}>Оформить заказ</OrderButton>
                <div className={classes.orderPrice}>Цена: {price || 0}</div>
            </div>
        </div>
    )
}
