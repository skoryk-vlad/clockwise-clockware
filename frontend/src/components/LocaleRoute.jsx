import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const getLocaleRoute = (location, i18n) => {
    const pathArray = location.pathname.split('/');
    pathArray[1] = i18n.language;
    return pathArray.join('/');
}

export const LocaleRoute = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const [currentLanguage, setCurrentLanguage] = useState('');

    useEffect(() => {
        if (i18n.language !== currentLanguage) {
            navigate(getLocaleRoute(location, i18n), { replace: true })
            setCurrentLanguage(i18n.language);
        }
    }, [i18n.language]);

    return (
        children
    )
}
