import React from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { Route, BrowserRouter } from "react-router-dom";
import NotesPage from "../pages/NotesPage";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route exact path="/" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/notes" component={NotesPage} />
            </BrowserRouter>
        );
    }
}

export default App;
