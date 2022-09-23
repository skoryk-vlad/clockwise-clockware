import React from 'react';

export const sortByColumn = (data, value, isDirectedASC, setData) => {
    let dataToSet = [];
    if (isDirectedASC) {
        dataToSet = data.sort((a, b) => a[value] > b[value] ? 1 : -1);
    } else {
        dataToSet = data.sort((a, b) => a[value] < b[value] ? 1 : -1);
    }
    setData(dataToSet);
}

export const ColumnHead = ({ value, title, onClick, clickable, sortState }) => {
    return (
        <th onClick={clickable ? () => onClick(value) : () => { }} value={sortState.value !== value ? '\u25BC' : ''}
            className={clickable ? 'colTitle' : ''}>
            <p>{title}</p>
            <p className='colTitle__arrow'>{sortState.value === value && (sortState.isDirectedASC ? '\u25BC' : '\u25B2')}</p>
        </th>
    )
}
