import React from 'react';
import { OrderButton } from '../../OrderButton/OrderButton';
import classes from './Main.module.css';
import { Element } from "react-scroll";

export const Main = ({ onClick }) => {
    return (
        <main className={classes.main}>
            <section className={classes.main__mainBlock}>
                <div className={classes.mainBlock__container + ' container'}>
                    <div className={classes.mainBlock__body}>
                        <div className={classes.mainBlock__subtitle}>Ремонт напольных часов</div>
                        <h1 className={classes.mainBlock__title}>
                            Clockwise
                            <span className={classes.mainBlock__title_purple}>Clockware</span>
                        </h1>
                        <div className={classes.mainBlock__text}>
                            Профессиональный ремонт напольных часов с выездом на дом.
                        </div>
                        <OrderButton onClick={onClick}>
                            Заказать услугу
                        </OrderButton>
                    </div>
                </div>
            </section>
            <Element name='benefits'>
                <section className={classes.main__benefits}>
                    <div className={classes.benefits__container + ' container'}>
                        <div className={classes.top}>
                            <h2 className={classes.title}>Почему Clockwise Clockware?</h2>
                            <div className={classes.subtitle}>Наши преимущества</div>
                        </div>
                        <div name='benefits' className={classes.benefits__items}>
                            <div className={classes.benefits__item + ' ' + classes.itemBenefits}>
                                <div className={classes.itemBenefits__icon}>
                                    <img src="/images/icons/01.png" alt="More insight" />
                                </div>
                                <div className={classes.itemBenefits__title}>Любая сложность</div>
                                <div className={classes.itemBenefits__text}>Мы производим ремонт настенных часов любой сложности, мастер починит и отладит как современные, так и антикварные модели часов, восстановит ход кукушек, кварцевых, механических часов с обычным или четвертным боем.</div>
                            </div>
                            <div className={classes.benefits__item + ' ' + classes.itemBenefits}>
                                <div className={classes.itemBenefits__icon}>
                                    <img src="/images/icons/02.png" alt="More personal" />
                                </div>
                                <div className={classes.itemBenefits__title}>Выезд на дом</div>
                                <div className={classes.itemBenefits__text}>Нужно починить старинные напольные часы с большим громоздким корпусом? Часовой мастер приедет на дом, чтобы разобраться с поломкой!</div>
                            </div>
                            <div className={classes.benefits__item + ' ' + classes.itemBenefits}>
                                <div className={classes.itemBenefits__icon}>
                                    <img src="/images/icons/03.png" alt="More effective" />
                                </div>
                                <div className={classes.itemBenefits__title}>Качество</div>
                                <div className={classes.itemBenefits__text}>Специалисты центра ежегодно посещают тренинги по повышению квалификации и используют только новейшее оборудование для ремонта часов. Поэтому наши клиенты могут быть уверены: их часы в надежных руках.</div>
                            </div>
                        </div>
                    </div>
                </section>
            </Element>
            <Element name='etaps'>
                <section className={classes.main__etaps}>
                    <div className={classes.etaps__container + ' container'}>
                        <div className={classes.top}>
                            <h2 className={classes.title}>Етапы ремонта часов</h2>
                            <div className={classes.subtitle}>Что необходимо сделать</div>
                        </div>
                        <div name='benefits' className={classes.etaps__items}>
                            <div className={classes.etaps__item + ' ' + classes.itemEtaps}>
                                <div className={classes.itemEtaps__icon}>
                                    <img src="/images/icons/04.png" alt="More insight" />
                                </div>
                                <div className={classes.itemEtaps__title}>1. Оформление</div>
                                <div className={classes.itemEtaps__text}>Оформление заказа с выбором даты, времени, города и указания контактных данных.</div>
                            </div>
                            <div className={classes.etaps__item + ' ' + classes.itemEtaps}>
                                <div className={classes.itemEtaps__icon}>
                                    <img src="/images/icons/05.png" alt="More personal" />
                                </div>
                                <div className={classes.itemEtaps__title}>2. Подтверждение</div>
                                <div className={classes.itemEtaps__text}>Подтверждение заказа по отправленной на почту ссылке.</div>
                            </div>
                            <div className={classes.etaps__item + ' ' + classes.itemEtaps}>
                                <div className={classes.itemEtaps__icon}>
                                    <img src="/images/icons/06.png" alt="More effective" />
                                </div>
                                <div className={classes.itemEtaps__title}>3. Выполнение</div>
                                <div className={classes.itemEtaps__text}>Выполнение мастером Вашего заказа в указанное время.</div>
                            </div>
                        </div>
                    </div>
                </section>
            </Element>
            <section className={classes.main__order}>
                <div className={classes.order__container + ' container'}>
                    <OrderButton onClick={onClick} className={classes.bigButton}>
                        Заказать услугу
                    </OrderButton>
                </div>
            </section>
        </main>
    )
}
