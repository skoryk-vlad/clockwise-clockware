import React from 'react'
import classes from './AdminTable.module.css';


export const AdminTable = ({ dataArr, setModalUpd, setIdUpd, deleteRow }) => {

    const colTitles = [];

    for(let key in dataArr[0]) {
        colTitles.push(key);
    }

    return (
        <div>
            <table className={classes.table}>
                <thead>
                    <tr>
                        {
                            colTitles.map(title => <th key={title}>{title}</th>)
                        }
                        <th>Изменение</th>
                        <th>Удаление</th>
                    </tr>
                </thead>
                <tbody>
                    {dataArr.map(el =>
                        <tr key={el.id} id={el.id}>
                            {colTitles.map(col => <td key={col}>{String(el[col])}</td>)}
                            <td className={classes.adminBody__link}><span onClick={e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }}>Изменить</span></td>
                            <td className={classes.adminBody__link}><span onClick={e => deleteRow(e)}>Удалить</span></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
