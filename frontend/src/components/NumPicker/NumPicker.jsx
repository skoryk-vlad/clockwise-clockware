import React, { useEffect, useState } from 'react';
import classes from './NumPicker.module.css';

export const NumPicker = ({ from, to, count = 1, onClick, min = from, value, id, ...props }) => {
    const [numPicked, setNumPicked] = useState(Array(to - from + 1).fill(0));

    const numsToShow = [];
    for (let i = from; i <= to; i++) {
        numsToShow.push(i);
    }

    useEffect(()=> {
        changeNum(value - from);
    }, [count, value]);

    const numClicked = (event) => {
        event.preventDefault();
        if(!event.target.classList.contains(classes.disabled)) {
            const num = event.target.textContent;

            changeNum(num - from);
        }
    };

    const changeNum = (starPos) => {
        let pickedFrom = (starPos);
        let pickedTo = (starPos + Number(count) - 1);

        if(pickedTo >= numPicked.length) {
            pickedTo = numPicked.length - 1;
            pickedFrom = pickedTo - count + 1;
        }
        
        setNumPicked(numPicked.map((num, index) => pickedFrom <= index && pickedTo >= index ? 1 : 0));
    }

    return (
        <div className={classes.numPicker + ' timeP'} onClick={onClick}>
            {
            numsToShow.map((num, index) => 
                    <button onClick={event => numClicked(event)} {...props}
                    className={classes.numItem + (numPicked[index] === 1 ? ' ' + classes.active : '') + (num < min ? ' ' + classes.disabled : '') }
                    key={num} data-num={+num + +count - 1 > to ? num - count + 1 + +to - +num : num} disabled={num < min}>{num}</button>)
            }
        </div>
    )
}