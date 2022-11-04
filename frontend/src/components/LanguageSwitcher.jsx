import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import Select from 'react-select'
import { supportedLanguages } from '../constants';

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [options, setOptions] = useState([]);

    useEffect(() => {
        setOptions(i18n.options.supportedLngs.filter(lng => lng !== 'cimode').map(lng => ({ value: lng, label: supportedLanguages[lng] })));
    }, []);

    return (
        <div className="lang-select">
            <Select
                value={options.find(option => option.value === i18n.language)}
                defaultValue={i18n.language}
                onChange={(e) => {
                    i18n.changeLanguage(e.value);
                    localStorage.setItem('language', e.value);
                }}
                options={options}
                isSearchable={false}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: '#6F2CFF',
                    },
                })}
            />
        </div>
    )
}
