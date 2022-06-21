import React, { useEffect, useState } from 'react';
import classes from './TimePicker.module.css';

export const TimePicker = ({ from, to, count, onClick }) => {

    const [timePicked, setTimePicked] = useState(Array(to - from + 1).fill(0));

    const numsToShow = [];
    for (let i = from; i <= to; i++) {
        numsToShow.push(i);
    }

    const timeClicked = (event) => {
        const num = event.target.textContent;
        event.target.classList.add(classes.active);

        let pickedFrom = (num - from);
        let pickedTo = (num - from + Number(count) - 1);

        if(pickedTo >=  timePicked.length) {
            pickedTo = timePicked.length - 1;
            pickedFrom = pickedTo - count + 1;
        }
        
        setTimePicked(timePicked.map((time, index) => pickedFrom <= index && pickedTo >= index ? 1 : 0));
    };

    return (
        <div className={classes.timePicker + ' timeP'} onClick={onClick}>
            {
                numsToShow.map((num, index) => 
                        <div onClick={e => timeClicked(e)}
                        className={classes.timeItem + (timePicked[index] === 1 ? ' ' + classes.active : '')}
                        key={num}>{num}</div>)
            }
        </div>
    )
}