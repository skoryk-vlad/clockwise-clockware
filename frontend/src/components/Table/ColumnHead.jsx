import React from 'react';

export const ColumnHead = ({ value, title, onClick, sortable, sortByField, ...props }) => {
    return (
        <th onClick={sortable ? () => onClick(value) : () => { }} value={sortByField.sortedField !== value ? '\u25BC' : ''}
            className={`${sortable ? 'colTitle' : ''} ${value === 'id' ? 'table-id' : ''}`} {...props}>
            <p>{title}</p>
            <p className='colTitle__arrow'>{sortByField.sortedField === value && (sortByField.isDirectedASC ? '\u25BC' : '\u25B2')}</p>
        </th>
    )
};
