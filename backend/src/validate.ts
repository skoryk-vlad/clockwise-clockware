import { Client } from 'pg';
import { City, Master, Status } from './types';
import db from './db';

export const validate = async (props: any, neededProps: string[]): Promise<string> => {
    const missing: string[] = neededProps.filter(prop => !props[prop] && (prop !== 'rating' || props.rating != 0));
    
    if (missing.length !== 0) {
        return `Missing propert${missing.length === 1 ? 'y' : 'ies'} '${missing.join(', ')}'`;
    }

    if (neededProps.indexOf('id') !== -1 && isNaN(props.id)) {
        return "'id' must be 'integer'";
    }

    if (neededProps.indexOf('name') !== -1 && props.name.trim().length < 3) {
        return "'name' length must be more than 3 characters";
    }

    if (neededProps.indexOf('email') !== -1) {
        const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!regex.test(props.email)) {
            return "Wrong email format";
        }
    }

    if (neededProps.indexOf('cities') !== -1) {
        if(!Array.isArray(props.cities)) {
            return `'cities' must be array of integers`;
        }
        
        const cities: City[] = (await db.query('SELECT * FROM city')).rows;
        const noCities: number[] = props.cities.filter((ca: number) => !(cities.find(c => c.id === ca)));
        
        if(noCities.length !== 0) {
            return `No cit${noCities.length === 1 ? 'y' : 'ies'} '${noCities.join(', ')}'`;
        }
    }

    if (neededProps.indexOf('watch_size') !== -1) {
        if(isNaN(props.watch_size)) {
            return "'watch_size' must be 'integer'";
        }
        if(props.watch_size < 1 || props.watch_size > 3) {
            return "'watch_size' must be between 1 and 3";
        }
    }

    if (neededProps.indexOf('time') !== -1) {
        if(isNaN(props.time)) {
            return "'time' must be 'integer'";
        }
        if(props.time < 10 || props.time > 18) {
            return "'time' must be between 10 and 18";
        }
    }

    if (neededProps.indexOf('date') !== -1) {
        const date: number[] = props.date.split('-');
        
        if(date.length !== 3) {
            return "Wrong date format";
        }
        if(isNaN(date[0])) {
            return "Wrong year in date";
        }
        if(isNaN(date[1]) || date[1] < 1 || date[1] > 12) {
            return "Wrong month in date";
        }
        if(isNaN(date[2]) || date[2] < 1 || date[2] > 31) {
            return "Wrong day in date";
        }
    }
    
    if (neededProps.indexOf('city_id') !== -1) {
        if(isNaN(props.city_id)) {
            return "'city_id' must be 'integer'";
        }
        const city: City[] = (await db.query('SELECT * FROM city WHERE id=$1', [props.city_id])).rows;
        if(city.length === 0) {
            return "No such city";
        }
    }

    if (neededProps.indexOf('master_id') !== -1) {
        if(isNaN(props.master_id)) {
            return "'master_id' must be 'integer'";
        }
        const master: Master[] = (await db.query('SELECT * FROM master WHERE id=$1', [props.master_id])).rows;
        if(master.length === 0) {
            return "No such master";
        }
    }

    if (neededProps.indexOf('client_id') !== -1) {
        if(isNaN(props.client_id)) {
            return "'client_id' must be 'integer'";
        }
        const client: Client[] = (await db.query('SELECT * FROM client WHERE id=$1', [props.client_id])).rows;
        if(client.length === 0) {
            return "No such client";
        }
    }

    if (neededProps.indexOf('status_id') !== -1) {
        if(isNaN(props.status_id)) {
            return "'status_id' must be 'integer'";
        }
        const status: Status[] = (await db.query('SELECT * FROM status WHERE id=$1', [props.status_id])).rows;
        if(status.length === 0) {
            return "No such status";
        }
    }
    
    if (neededProps.indexOf('rating') !== -1) {
        if(isNaN(props.rating)) {
            return "'rating' must be 'integer'";
        }
        if(props.rating < 0 || props.rating > 5) {
            return "'rating' must be between 0 and 5";
        }
    }
    
    return '';
};
