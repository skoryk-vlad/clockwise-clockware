import React, { useEffect, useState } from 'react';
import classes from './NumPicker.module.css';

export const NumPicker = ({ from, to, count = 1, onClick, min = from, value, id, values, ...props }) => {
    const [numPicked, setNumPicked] = useState(Array(to - from + 1).fill(0));

    let numsToShow = Array(to - from + 1).fill(from);
    numsToShow = numsToShow.map((num, i) => +num + i);

    useEffect(() => {
        changeNum(value - from);
    }, [count, value]);

    const numClicked = (event) => {
        event.preventDefault();
        if (!event.target.classList.contains(classes.disabled)) {
            const num = event.target.dataset.num;
            changeNum(num - from);
        }
    };

    const changeNum = (starPos) => {
        let pickedFrom = (starPos);
        let pickedTo = (starPos + Number(count) - 1);

        setNumPicked(numPicked.map((num, index) => pickedFrom <= index && pickedTo >= index ? 1 : 0));
    }

    return (
        <div className={classes.numPicker + ' timeP'} onClick={onClick}>
            {
                numsToShow.map((num, index) =>
                    <button onClick={event => numClicked(event)} {...props}
                        className={classes.numItem + (numPicked[index] === 1 ? ' ' + classes.active : '') + (num < min ? ' ' + classes.disabled : '')}
                        key={num} data-num={num} disabled={num < min}>{values ? values[num - 1] : num}</button>)
            }
        </div>
    )
}