module.exports = {
    useTranslation: () => {
        return {
            t: key => key,
            i18n: {
                changeLanguage: () => new Promise(() => { }),
            },
        };
    },
    initReactI18next: {
        type: "3rdParty",
        init: jest.fn(),
    },
};
