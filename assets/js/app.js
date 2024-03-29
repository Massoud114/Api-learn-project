import React, {useState} from 'react';
import ReactDom from 'react-dom'
import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import {HashRouter, Route, Switch, withRouter} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/authAPI"
import AuthContext from './contexts/AuthContext'
import PrivateRoute from "./components/PrivateRoute";
import CustomerPage from "./pages/CustomerPage";
import InvoicePage from "./pages/InvoicePage";
import RegisterPage from "./pages/RegisterPage";

AuthAPI.setup()

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated())

	const NavbarWithRouter = withRouter(Navbar)

	return <AuthContext.Provider value={{
		isAuthenticated,
		setIsAuthenticated
	}}>
		<HashRouter>
			<NavbarWithRouter/>

			<main className="container pt-5">
				<Switch>
					<Route path="/login" component={LoginPage}/>
					<Route path="/register" component={RegisterPage}/>
					<PrivateRoute path="/invoices/:id" component={InvoicePage}/>
					<PrivateRoute path="/invoices" component={InvoicesPage}/>
					<PrivateRoute path="/customers/:id" component={CustomerPage}/>
					<PrivateRoute path="/customers" component={CustomersPage}/>
					<Route path="/" component={HomePage}/>
				</Switch>
			</main>
		</HashRouter>
	</AuthContext.Provider>
};

const rootElement = document.getElementById('app')

ReactDom.render(<App/>, rootElement)
