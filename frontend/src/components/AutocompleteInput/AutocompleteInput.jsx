import React from 'react';
import classes from './AutocompleteInput.module.css';
import AsyncSelect from 'react-select/async';

const throttle = (func, ms) => {
    let isThrottled = false, savedArgs, savedThis;

    function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }
        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
};

const asyncThrottle = (func, ms) => {
    const throttled = throttle((resolve, reject, args) => {
        func(...args).then(resolve).catch(reject);
    }, ms);
    return (...args) =>
        new Promise((resolve, reject) => {
            throttled(resolve, reject, args);
        });
};

const defaultFilters = {
    page: 1,
    limit: 10,
    sortedField: 'name',
    isDirectedASC: true
};

const WrapSubstring = ({ string, stringToWrap }) => {
    if (string.toLowerCase().indexOf(stringToWrap.toLowerCase()) !== -1) {
        const startIndex = string.toLowerCase().indexOf(stringToWrap.toLowerCase());
        const endIndex = startIndex + stringToWrap.length;

        const start = string.substring(0, startIndex);
        const selected = string.substring(startIndex, endIndex);
        const end = string.substring(endIndex);
        return (
            <>
                {start}<span className={classes.searched}>{selected}</span>{end}
            </>
        );
    } else {
        return (
            <>
                {string}
            </>
        );
    }
}

export class AutocompleteInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            selected: []
        };
    }

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    }

    handleChange = (selected) => {
        if(this.props.onChange) this.props.onChange(selected.map(selected => selected.value));
        this.setState({ selected });
    }

    formatOptionLabel = ({ value, label }) => {
        const labelArr = label.split(' ');
        return (
            <div>
                <WrapSubstring string={labelArr[0]} stringToWrap={this.state.inputValue} /> <span className={classes.email}><WrapSubstring string={labelArr[1]} stringToWrap={this.state.inputValue} /></span>
            </div>
        )
    }

    loadOptions = async (inputValue) => {
        const cities = await this.props.getOptions({ ...defaultFilters, name: inputValue });
        return cities.rows.map(city => ({ value: city.id, label: `${city.name} (${city.email})` }));
    }

    throttle = asyncThrottle(this.loadOptions, 1000)

    render() {
        return (
            <AsyncSelect {...this.props}
                formatOptionLabel={this.formatOptionLabel}
                defaultOptions
                value={this.state.selected.filter(city => this.props.value.includes(city.value))}
                loadOptions={this.throttle}
                onInputChange={this.handleInputChange}
                inputValue={this.state.inputValue}
                onChange={this.handleChange}
            />
        )
    }
}
