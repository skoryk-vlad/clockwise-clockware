import React from 'react'
import classes from './TopButton.module.css';
import { animateScroll as scroll } from 'react-scroll'

export const TopButton = () => {
  return (
    <div className={classes.topBtn} onClick={ () => scroll.scrollToTop() }>
        <img src="/images/icons/top.png" alt="Наверх" />
    </div>
  )
}
