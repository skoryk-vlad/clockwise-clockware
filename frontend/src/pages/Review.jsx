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

const ReviewSchema = z.object({
    rating: z.number({ invalid_type_error: 'Необходимо выставить рейтинг' }).int().min(1, 'Рейтинг должен находиться в диапазоне 1-5').max(5, 'Рейтинг должен находиться в диапазоне 1-5'),
    review: z.string().trim().max(1000, 'Отзыв должен быть не длиннее 1000 символов').optional()
});

export const Review = () => {
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
            notify(NOTIFY_TYPES.SUCCESS, 'Спасибо! Отзыв успешно получен!');
            setIsRedirected(true);
        } catch (error) {
            if (error?.response?.data === 'No such order')
                notify(NOTIFY_TYPES.ERROR, 'Такого заказа не существует!');
            else if (error?.response?.data === 'Order not completed yet')
                notify(NOTIFY_TYPES.ERROR, 'Заказ еще не выполнен!');
            else if (error?.response?.data === 'Review already exist')
                notify(NOTIFY_TYPES.ERROR, 'Отзыв уже был оставлен!');
            else
                notify(NOTIFY_TYPES.ERROR);
        }
    }
    return (
        !isRedirected ?
            <form onSubmit={handleSubmit(addReview)}>
                <div className='reviewWrapper'>
                    <div className='review'>
                        <h2 className='reviewTitle'>Оценка заказа</h2>
                        <div className='reviewBlock'>
                            <div className="reviewLabel">Рейтинг:
                                {errors.rating && (
                                    <span className='errorMessage'>{errors.rating.message}</span>
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
                            <div className="reviewLabel">Отзыв:</div>
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
                            disabled={(isSubmitted && !isValid)}>Оставить отзыв</OrderButton>
                    </div>
                </div>
            </form>
            :
            <Navigate push to="/" />
    )
}
