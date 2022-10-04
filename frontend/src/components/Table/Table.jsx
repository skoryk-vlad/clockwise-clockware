import React from 'react';
import classes from './Table.module.css';

const availableLimit = [10, 25, 50];
const defaultValue = availableLimit[0];

export const Table = ({ children, changeLimit, changePage, currentPage, totalPages }) => {
    let pages = [];
    if (!totalPages) {
        pages = [1];
    } else if (totalPages < 5) {
        pages = Array(totalPages).fill(0).map((num, index) => index + 1);
    } else {
        pages = Array(5).fill(0);
        pages[currentPage > 3 ? (currentPage + 2 < totalPages ? 2 : 4 - (totalPages - currentPage)) : currentPage - 1] = currentPage;
        pages = pages.map((num, index) => num === currentPage ? currentPage : currentPage + index - pages.indexOf(currentPage))
    }

    return (
        <div>
            <table className={classes.table}>
                {children}
            </table>
            {totalPages > 0 && <div className={classes.paginationBtns}>
                <div></div>
                <div className={classes.paginationBtns_page}>
                    <div className={classes.double_arrow}>{currentPage > 3 && totalPages > 5 && <div className={classes.changePage} onClick={() => changePage(1)}><div className={classes.firstPage}></div></div>}</div>
                    <div className={`${classes.changePage} ${(currentPage === 1 ? classes.disabled : '')}`} onClick={() => changePage(currentPage - 1)}><div className={`${classes.paginationBtns__btn} ${classes.left_arrow}`}></div></div>
                    {pages.map((num, index) => {
                        if (num !== currentPage) {
                            return <div key={index} className={classes.changePage} onClick={() => changePage(num)}>{num || ''}</div>
                        } else {
                            return <React.Fragment key={index}>
                                <div className={classes.currentPage} key={num}>{currentPage || 0}</div>
                            </React.Fragment>
                        }
                    })}
                    <div className={`${classes.changePage} ${(!totalPages || currentPage === totalPages ? classes.disabled : '')}`} onClick={() => changePage(currentPage + 1)}><div className={`${classes.paginationBtns__btn} ${classes.right_arrow}`}></div></div>
                    <div className={classes.double_arrow}>{totalPages - 2 > currentPage && totalPages > 5 && <div className={classes.changePage} onClick={() => changePage(totalPages)}><div className={classes.lastPage}></div></div>}</div>
                </div>
                <select name="limit" defaultValue={defaultValue} className={classes.paginationBtns_select} onChange={event => changeLimit(+event.target.value)}>
                    {availableLimit.map(limit => <option value={limit} key={limit}>{limit}</option>)}
                </select>
            </div>}
        </div>
    )
}
