import { Client } from './models/client.model';
import { Status } from './models/status.model';
import { City } from './models/city.model';
import { Master } from './models/master.model';

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
        
        const cities = await City.findAll();
        const noCities: number[] = props.cities.filter((ca: number) => !(cities.find(c => c.getDataValue('id') === ca)));
        
        if(noCities.length !== 0) {
            return `No cit${noCities.length === 1 ? 'y' : 'ies'} '${noCities.join(', ')}'`;
        }
    }

    if (neededProps.indexOf('watchSize') !== -1) {
        if(isNaN(props.watchSize)) {
            return "'watchSize' must be 'integer'";
        }
        if(props.watchSize < 1 || props.watchSize > 3) {
            return "'watchSize' must be between 1 and 3";
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
    
    if (neededProps.indexOf('cityId') !== -1) {
        if(isNaN(props.cityId)) {
            return "'cityId' must be 'integer'";
        }
        const city = City.findByPk(props.cityId);
        if(!city) {
            return "No such city";
        }
    }

    if (neededProps.indexOf('masterId') !== -1) {
        if(isNaN(props.masterId)) {
            return "'masterId' must be 'integer'";
        }
        const master = Master.findByPk(props.masterId);
        if(!master) {
            return "No such master";
        }
    }

    if (neededProps.indexOf('clientId') !== -1) {
        if(isNaN(props.clientId)) {
            return "'clientId' must be 'integer'";
        }
        const client = Client.findByPk(props.clientId);
        if(!client) {
            return "No such client";
        }
    }

    if (neededProps.indexOf('statusId') !== -1) {
        if(isNaN(props.statusId)) {
            return "'statusId' must be 'integer'";
        }
        const status = Status.findByPk(props.statusId);
        if(!status) {
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
