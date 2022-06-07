import React from 'react'
import { MyRadio } from '../radio/MyRadio'
import classes from './RadioBlock.module.css';

export const RadioBlock = ({onClick}) => {
  return (
    <div onClick={onClick} className={classes.radioBlock}>
        <MyRadio name="sz" id="1" checked>1</MyRadio>
        <MyRadio name="sz" id="2">2</MyRadio>
        <MyRadio name="sz" id="3">3</MyRadio>
    </div>
  )
}
