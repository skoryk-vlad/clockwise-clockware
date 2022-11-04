import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MasterService } from '../../API/Server';
import { OrderButton } from '../OrderButton/OrderButton';
import classes from './MasterChoice.module.css';

export const MasterChoice = ({ freeMasters, returnForm, addOrder, price }) => {
    const { t } = useTranslation();

    const [chosenMaster, setChosenMaster] = useState(null);
    const [reviewsInfo, setReviewsInfo] = useState({
        masterName: '',
        reviews: []
    });

    const getReviews = async (event) => {
        const id = +event.target.closest(`.mstr_itm`).id;
        const reviews = await MasterService.getMasterReviews(id);
        setReviewsInfo({
            masterName: freeMasters.find(master => master.id === id).name,
            reviews
        });
    }

    return (
        <div className={classes.mastersBlock}>
            <div className={classes.mastersList}>
                {
                    freeMasters.map(master =>
                        <div key={master.id} id={master.id} className={`${classes.masterItem} mstr_itm ${+chosenMaster === master.id ? classes.active : ''}`}>
                            <div className={classes.masterName}>{master.name}</div>
                            <div className={classes.masterRating}>{t('orderForm.masterRating')}: {master.rating}</div>
                            <div className={classes.masterRating}>{t('orderForm.masterReviews')}: {master.reviews} {master.reviews > 0 && <span onClick={getReviews} className={classes.showReviews}>({t('orderForm.show')})</span>}</div>
                            <OrderButton onClick={event => setChosenMaster(+event.target.closest(`.mstr_itm`).id)} className={classes.masterBtn}>{t('orderForm.masterChoose')}</OrderButton>
                        </div>
                    )
                }
                {
                    freeMasters.length === 0 &&
                    <div className={classes.warning}>{t('orderForm.noMasters')}</div>
                }
            </div>
            <div className={classes.return} onClick={returnForm}>
                <img src="/images/icons/top.png" alt="Назад" />
            </div>
            <div className={classes.formBottom}>
                <OrderButton onClick={() => addOrder(chosenMaster)} className={(chosenMaster === null ? "disabledBtn" : '')}
                    disabled={chosenMaster === null}>{t('orderForm.submitButton')}</OrderButton>
                <div className={classes.orderPrice}>{t('orderForm.price')}: {price || 0}</div>
            </div>
            {reviewsInfo.reviews.length > 0 && <div className={classes.reviews}>
                <h3>{t('orderForm.masterReviewsTitle')} <div className={classes.masterName}>{reviewsInfo.masterName}</div></h3>
                {reviewsInfo.reviews.map(review => <div key={review.id} className={classes.masterReview}>
                    <div className={classes.masterReviewTop}>
                        <div className={classes.masterReviewName}>{review.client}</div>
                        <div>{review.rating}{`\u2605`}</div>
                    </div>
                    <div>{review.review}</div>
                    <div className={classes.masterReviewDate}>{review.date}</div>
                </div>)}
                <div className={`${classes.return} ${classes.close}`} onClick={() => setReviewsInfo({ masterName: '', reviews: [] })}>
                    <img src="/images/icons/close.png" alt="Назад" />
                </div>
            </div>}
        </div>
    )
}
