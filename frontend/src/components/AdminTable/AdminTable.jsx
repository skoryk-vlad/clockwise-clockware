import React from 'react'
import { useState } from 'react';
import classes from './AdminTable.module.css';



export const AdminTable = ({ dataArr, setModalUpd, setIdUpd, deleteRow, completeOrd }) => {

    const [sortedBy, setSortedBy] = useState({
        column: '',
        direction: true
    });

    const colTitles = [];

    for(let key in dataArr[0]) {
        colTitles.push(key);
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
                            colTitles.map(title => <th className={classes.colTitle} onClick={e => sortByColumn(e.target.textContent)} key={title}>{title}</th>)
                        }
                        {!completeOrd
                        ?
                            <>
                                <th>Изменение</th>
                                <th>Удаление</th>
                            </>
                        :
                            <th>Выполнение</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {dataArr.map(el =>
                        <tr key={el.id} id={el.id}>
                            {colTitles.map(col => <td key={col}>{String(el[col])}</td>)}
                            {/* <td className={classes.adminBody__link}><span onClick={e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }}>Изменить</span></td> */}
                            {/* <td className={classes.adminBody__link}><span onClick={e => deleteRow(e)}>Удалить</span></td> */}
                            {!completeOrd
                            ?
                                <>
                                    <td className={classes.adminBody__link}><span onClick={e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }}>Изменить</span></td>
                                    <td className={classes.adminBody__link}><span onClick={e => deleteRow(e)}>Удалить</span></td>
                                </>
                            :
                            <td className={classes.adminBody__link}><span onClick={e => completeOrd(e)}>Выполнен</span></td>
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
