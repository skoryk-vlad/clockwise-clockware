import React from 'react';
import classes from './Table.module.css';

const getProperty = (obj, prop) => {
    const parts = prop.split(".");

    if (Array.isArray(parts)) {
        const last = parts.length > 1 ? parts.pop() : parts;
        
        if (typeof obj === "object" && obj !== null) {
            return obj[last];
        }
        return obj || '-';
    } else {
        throw new Error("parts is not valid array");
    }
};

export const Table = ({ data, tableHeaders, tableBodies }) => {
    return (
        <table className={classes.table}>
            <thead>
                <tr>
                    {tableHeaders.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map(data => (
                    <tr key={data.id}>
                        {tableBodies.map(body =>
                            typeof body === "string" ? (
                                <td key={body}>{getProperty(data, body)}</td>
                            ) : (
                                <td key={body.name} className={classes.adminBody__link}>
                                    <span onClick={() => body.callback(getProperty(data, body.param))} >{body.name}</span>
                                </td>
                            )
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
