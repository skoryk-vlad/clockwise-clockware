import React from 'react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { OrderService } from '../API/Server';
import { notify, NOTIFY_TYPES } from '../components/Notifications';
import { NumPicker } from '../components/NumPicker/NumPicker';
import { OrderButton } from '../components/OrderButton/OrderButton';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Header } from '../components/Landing/Header/Header';

const ReviewSchema = z.object({
    rating: z.number({ invalid_type_error: 'errors.rating' }).int().min(1, 'errors.ratingBorders').max(5, 'errors.ratingBorders'),
    review: z.string().trim().max(1000, 'errors.reviewLength').optional()
});

export const Review = () => {
    const { t } = useTranslation();
    const { control, handleSubmit, getValues, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            rating: null,
            review: ''
        },
        resolver: zodResolver(ReviewSchema)
    });
    const [isRedirected, setIsRedirected] = useState(false);

    const addReview = async () => {
        try {
            await OrderService.addOrderReview(window.location.search.replace('?', ''), getValues().rating, getValues().review)
            notify(NOTIFY_TYPES.SUCCESS, t('notifications.reviewReceived'));
            setIsRedirected(true);
        } catch (error) {
            if (error?.response?.data === 'No such order')
                notify(NOTIFY_TYPES.ERROR, t('notifications.orderNotExist'));
            else if (error?.response?.data === 'Order not completed yet')
                notify(NOTIFY_TYPES.ERROR, t('notifications.orderNotCompleted'));
            else if (error?.response?.data === 'Review already exist')
                notify(NOTIFY_TYPES.ERROR, t('notifications.orderHasReview'));
            else
                notify(NOTIFY_TYPES.ERROR);
        }
    }
    return (
        !isRedirected ?
            <>
                <Header isButtonsVisible={false} />
                <form onSubmit={handleSubmit(addReview)}>
                    <div className='reviewWrapper'>
                        <div className='review'>
                            <h2 className='reviewTitle'>{t('reviewPage.title')}</h2>
                            <div className='reviewBlock'>
                                <div className="reviewLabel">{t('reviewPage.rating')}:
                                    {errors.rating && (
                                        <span className='errorMessage'>{t(errors.rating.message)}</span>
                                    )}
                                </div>
                                <Controller
                                    control={control}
                                    name="rating"
                                    render={({
                                        field: { onChange, value }
                                    }) => (
                                        <NumPicker from={1} to={5} value={value} onClick={event => onChange(+event.target.dataset.num)} />
                                    )}
                                />
                            </div>
                            <div className='reviewBlock'>
                                <div className="reviewLabel">{t('reviewPage.review')}:</div>
                                <Controller
                                    control={control}
                                    name="review"
                                    render={({
                                        field: { onChange, value }
                                    }) => (
                                        <textarea value={value} onChange={onChange} className='reviewTextarea' />
                                    )}
                                />
                            </div>
                            <OrderButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                                disabled={(isSubmitted && !isValid)}>{t('reviewPage.submitButton')}</OrderButton>
                        </div>
                    </div>
                </form>
            </>
            :
            <Navigate push to="/" />
    )
}
