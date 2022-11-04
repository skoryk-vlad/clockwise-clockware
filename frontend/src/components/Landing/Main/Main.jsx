import React from 'react';
import { OrderButton } from '../../OrderButton/OrderButton';
import classes from './Main.module.css';
import { Element } from "react-scroll";
import { useTranslation } from 'react-i18next';

export const Main = ({ onClick }) => {
    const { t } = useTranslation();

    return (
        <main className={classes.main}>
            <section className={classes.main__mainBlock}>
                <div className={classes.mainBlock__container + ' container'}>
                    <div className={classes.mainBlock__body}>
                        <div className={classes.mainBlock__subtitle}>{t('main.subtitle')}</div>
                        <h1 className={classes.mainBlock__title}>
                            Clockwise
                            <span className={classes.mainBlock__title_purple}>Clockware</span>
                        </h1>
                        <div className={classes.mainBlock__text}>
                            {t('main.text')}
                        </div>
                        <OrderButton onClick={onClick}>
                            {t('orderButton')}
                        </OrderButton>
                    </div>
                </div>
            </section>
            <Element name='benefits'>
                <section className={classes.main__benefits}>
                    <div className={classes.benefits__container + ' container'}>
                        <div className={classes.top}>
                            <h2 className={classes.title}>{t('benefits.title')}</h2>
                            <div className={classes.subtitle}>{t('benefits.subtitle')}</div>
                        </div>
                        <div name='benefits' className={classes.benefits__items}>
                            <div className={classes.benefits__item + ' ' + classes.itemBenefits}>
                                <div className={classes.itemBenefits__icon}>
                                    <img src="/images/icons/01.png" alt="More insight" />
                                </div>
                                <div className={classes.itemBenefits__title}>{t('benefits.item1.title')}</div>
                                <div className={classes.itemBenefits__text}>{t('benefits.item1.text')}</div>
                            </div>
                            <div className={classes.benefits__item + ' ' + classes.itemBenefits}>
                                <div className={classes.itemBenefits__icon}>
                                    <img src="/images/icons/02.png" alt="More personal" />
                                </div>
                                <div className={classes.itemBenefits__title}>{t('benefits.item2.title')}</div>
                                <div className={classes.itemBenefits__text}>{t('benefits.item2.text')}</div>
                            </div>
                            <div className={classes.benefits__item + ' ' + classes.itemBenefits}>
                                <div className={classes.itemBenefits__icon}>
                                    <img src="/images/icons/03.png" alt="More effective" />
                                </div>
                                <div className={classes.itemBenefits__title}>{t('benefits.item3.title')}</div>
                                <div className={classes.itemBenefits__text}>{t('benefits.item3.text')}</div>
                            </div>
                        </div>
                    </div>
                </section>
            </Element>
            <Element name='etaps'>
                <section className={classes.main__etaps}>
                    <div className={classes.etaps__container + ' container'}>
                        <div className={classes.top}>
                            <h2 className={classes.title}>{t('etaps.title')}</h2>
                            <div className={classes.subtitle}>{t('etaps.subtitle')}</div>
                        </div>
                        <div name='benefits' className={classes.etaps__items}>
                            <div className={classes.etaps__item + ' ' + classes.itemEtaps}>
                                <div className={classes.itemEtaps__icon}>
                                    <img src="/images/icons/04.png" alt="More insight" />
                                </div>
                                <div className={classes.itemEtaps__title}>{t('etaps.item1.title')}</div>
                                <div className={classes.itemEtaps__text}>{t('etaps.item1.text')}</div>
                            </div>
                            <div className={classes.etaps__item + ' ' + classes.itemEtaps}>
                                <div className={classes.itemEtaps__icon}>
                                    <img src="/images/icons/05.png" alt="More personal" />
                                </div>
                                <div className={classes.itemEtaps__title}>{t('etaps.item2.title')}</div>
                                <div className={classes.itemEtaps__text}>{t('etaps.item2.text')}</div>
                            </div>
                            <div className={classes.etaps__item + ' ' + classes.itemEtaps}>
                                <div className={classes.itemEtaps__icon}>
                                    <img src="/images/icons/06.png" alt="More effective" />
                                </div>
                                <div className={classes.itemEtaps__title}>{t('etaps.item3.title')}</div>
                                <div className={classes.itemEtaps__text}>{t('etaps.item3.text')}</div>
                            </div>
                        </div>
                    </div>
                </section>
            </Element>
            <section className={classes.main__order}>
                <div className={classes.order__container + ' container'}>
                    <OrderButton onClick={onClick} className={classes.bigButton}>
                        {t('orderButton')}
                    </OrderButton>
                </div>
            </section>
        </main>
    )
}
