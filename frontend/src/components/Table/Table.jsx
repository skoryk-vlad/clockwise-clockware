import React from 'react';
import classes from './Table.module.css';

const availableLimit = [10, 25, 50];
const defaultValue = availableLimit[0];

export const Table = ({ children, changeLimit, changePage, currentPage, totalPages }) => {
    const pages = [0, 0, 0, currentPage, 0, 0, 0].map((num, index) => {
        if (currentPage - 3 + index > 0 && currentPage - 3 + index <= totalPages)
            return currentPage - 3 + index;
    });

    return (
        <div>
            <table className={classes.table}>
                {children}
            </table>
            <div className={classes.paginationBtns}>
                <div></div>
                <div className={classes.paginationBtns_page}>
                    {pages.map((num, index) => {
                        if (num !== currentPage) {
                            return <div key={index} className={classes.changePage} onClick={() => changePage(num)}>{num || ''}</div>
                        } else {
                            return <React.Fragment key={index}>
                                <button className={classes.paginationBtns__btn} onClick={() => changePage(currentPage - 1)} key={-num}></button>
                                <div className={classes.currentPage} key={num}>{currentPage || 0}</div>
                                <button className={classes.paginationBtns__btn} onClick={() => changePage(currentPage + 1)} key={-num - 1}></button>
                            </React.Fragment>
                        }
                    })}
                    <div className={classes.lastPage}>
                        {totalPages - 3 > currentPage && <>
                            <div className={classes.currentPage}>...</div>
                            <div className={classes.changePage} onClick={() => changePage(totalPages)}>{totalPages}</div>
                        </>}
                    </div>
                </div>
                <select name="limit" defaultValue={defaultValue} className={classes.paginationBtns_select} onChange={event => changeLimit(+event.target.value)}>
                    {availableLimit.map(limit => <option value={limit} key={limit}>{limit}</option>)}
                </select>
            </div>
        </div>
    )
}
