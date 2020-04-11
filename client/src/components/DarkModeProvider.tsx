import React, { useContext } from "react";
import useLocalStorage from "../utils/useLocalStorage";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

const darkTheme = createMuiTheme({
    palette: {
        primary: blue,
        background: {
            paper: "#212121"
        },
        type: "dark"
    }
});

const lightTheme = createMuiTheme({
    palette: {
        primary: blue,
        type: "light"
    }
});

interface ContextProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

export const Context = React.createContext<ContextProps>({
    darkMode: false,
    setDarkMode: () => {}
});

interface Props {
    children?: React.ReactNode;
}

export const DarkModeProvider: React.FC<Props> = ({ children }: Props) => {
    const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

    return (
        <Context.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </Context.Provider>
    );
};

export const useStore = () => useContext(Context);

export function withProvider(Component: any) {
    return function WrapperComponent(props: any) {
        return (
            <DarkModeProvider>
                <Component {...props} />
            </DarkModeProvider>
        );
    };
}

export const useApp = () => {
    const { darkMode, setDarkMode } = useStore();
    return {
        darkMode,
        setDarkMode
    };
};

export function withThemeProvider(Component: any) {
    const WrapperComponent = ({ props }: any) => {
        const { darkMode } = useApp();
        const theme = darkMode ? darkTheme : lightTheme;
        return (
            <ThemeProvider theme={theme}>
                <Component {...props} />
            </ThemeProvider>
        );
    };
    return withProvider(WrapperComponent);
}
