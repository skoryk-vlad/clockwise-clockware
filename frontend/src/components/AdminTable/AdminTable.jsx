import React from 'react'
import { useState } from 'react';
import classes from './AdminTable.module.css';



export const AdminTable = ({ dataArr, columns, btnTitles, btnFuncs }) => {

    const [sortedBy, setSortedBy] = useState({
        column: '',
        direction: true
    });

    const colData = [];

    for(let key in dataArr[0]) {
        colData.push(key);
    }

    const sortByColumn = (column) => {
        if(sortedBy.column === column) {
            if(sortedBy.direction) {
                dataArr.sort((a, b) => a[column] < b[column] ? 1 : -1);
            } else {
                dataArr.sort((a, b) => a[column] > b[column] ? 1 : -1);
            }
            setSortedBy({
                column: sortedBy.column,
                direction: !sortedBy.direction
            });
        } else {
            dataArr.sort((a, b) => a[column] > b[column] ? 1 : -1);
            setSortedBy({
                column: column,
                direction: true
            });
        }
    }

    return (
        <div>
            <table className={classes.table}>
                <thead>
                    <tr>
                        {
                            columns.map((title, index) => 
                                <th className={classes.colTitle} onClick={e => sortByColumn(e.target.dataset.col)}
                                data-col={colData[index]} key={title}>{title}</th>
                            )
                        }
                        {btnTitles.map(title => <th key={title}>{title}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {dataArr.map(el =>
                        <tr key={el.id} id={el.id}>
                            {colData.map(col => <td key={col}>{el[col] || '-'}</td>)}
                            {btnFuncs.map((func, i) => <td key={i} className={classes.adminBody__link}><span onClick={func}>{btnTitles[i]}</span></td>)}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
