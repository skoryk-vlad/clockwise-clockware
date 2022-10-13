import React from 'react';
import AsyncSelect from 'react-select/async';
import { throttle } from 'throttle-debounce';

const asyncThrottle = (ms, func) => {
    const throttled = throttle(ms, (resolve, reject, args) => {
        func(...args).then(resolve).catch(reject);
    });
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

export const splitBySubstring = (string, substring) => {
    if (string.toLowerCase().indexOf(substring.toLowerCase()) !== -1) {
        const startIndex = string.toLowerCase().indexOf(substring.toLowerCase());
        const endIndex = startIndex + substring.length;

        const start = string.substring(0, startIndex);
        const selected = string.substring(startIndex, endIndex);
        const end = string.substring(endIndex);
        return [start, selected, end];
    } else {
        return ['', '', string];
    }
}

export class Lookup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            selected: props.defaultValue || []
        };
    }

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    }

    handleChange = (selected) => {
        if (this.props.onChange) {
            if (Array.isArray(selected)) {
                this.props.onChange(selected.map(selected => selected.value));
            } else {
                this.props.onChange(selected.value);
            }
        };
        this.setState({ selected });
    }

    formatOptionLabel = ({ label }) => {
        return (
            this.props.formatOptionLabel ? this.props.formatOptionLabel(label, this.state.inputValue) : label
        )
    }

    loadOptions = async (inputValue) => {
        const entities = await this.props.getOptions({ ...defaultFilters, name: inputValue });
        return entities.rows.map(entity => ({ value: entity.id, label: this.props.label(entity) }));
    }

    throttle = asyncThrottle(1000, this.loadOptions)

    render() {
        return (
            <AsyncSelect {...this.props}
                formatOptionLabel={this.formatOptionLabel}
                value={Array.isArray(this.state.selected) ? this.state.selected.filter(option => this.props.value.includes(option.value)) : this.state.selected}
                loadOptions={this.throttle}
                onInputChange={this.handleInputChange}
                inputValue={this.state.inputValue}
                onChange={this.handleChange}
            />
        )
    }
}
