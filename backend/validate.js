const db = require('./db');

const validate = async (props, neededProps) => {
    const missing = neededProps.filter(prop => !props[prop] && (prop !== 'rating' || props.rating != 0));
    
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
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!regex.test(props.email)) {
            return "Wrong email format";
        }
    }

    if (neededProps.indexOf('cities') !== -1) {
        const cities = await db.query('SELECT * FROM city');
        const noCities = props.cities.filter(ca => !(cities.rows.find(c => c.id === ca)));
        
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
        const date = props.date.split('-')
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
        const city = await db.query('SELECT * FROM city WHERE id=$1', [props.cityId]);
        if(city.rows.length === 0) {
            return "No such city";
        }
    }

    if (neededProps.indexOf('masterId') !== -1) {
        if(isNaN(props.masterId)) {
            return "'masterId' must be 'integer'";
        }
        const master = await db.query('SELECT * FROM master WHERE id=$1', [props.masterId]);
        if(master.rows.length === 0) {
            return "No such master";
        }
    }

    if (neededProps.indexOf('clientId') !== -1) {
        if(isNaN(props.clientId)) {
            return "'clientId' must be 'integer'";
        }
        const client = await db.query('SELECT * FROM client WHERE id=$1', [props.clientId]);
        if(client.rows.length === 0) {
            return "No such client";
        }
    }

    if (neededProps.indexOf('statusId') !== -1) {
        if(isNaN(props.statusId)) {
            return "'statusId' must be 'integer'";
        }
        const status = await db.query('SELECT * FROM status WHERE id=$1', [props.statusId]);
        if(status.rows.length === 0) {
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

module.exports = validate;
