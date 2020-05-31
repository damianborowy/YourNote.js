import React, { FunctionComponent, useEffect } from "react";
import useLocalStorage from "../utils/useLocalStorage";
import { useTranslation } from "react-i18next";

const LanguageWrapper: FunctionComponent = ({ children }) => {
    const [lang] = useLocalStorage("lang", "en"),
        { i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang, i18n]);

    return <>{children}</>;
};

export default LanguageWrapper;
