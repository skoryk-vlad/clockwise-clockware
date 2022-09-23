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

export const ColumnHead = ({ value, title, onClick, sortable, sortByField }) => {
    return (
        <th onClick={sortable ? () => onClick(value) : () => { }} value={sortByField.value !== value ? '\u25BC' : ''}
            className={sortable ? 'colTitle' : ''}>
            <p>{title}</p>
            <p className='colTitle__arrow'>{sortByField.value === value && (sortByField.isDirectedASC ? '\u25BC' : '\u25B2')}</p>
        </th>
    )
}
