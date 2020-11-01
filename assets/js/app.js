import React from 'react';
import ReactDom from 'react-dom'
import '../css/app.css';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";

const App = () => {
	return <HashRouter>
		<Navbar/>

		<main className="container pt-5">
			<Switch>
				<Route path="/invoices" component={InvoicesPage}/>
				<Route path="/customers" component={CustomersPage}/>
				<Route path="/" component={HomePage}/>
			</Switch>
		</main>
	</HashRouter>
};

const rootElement = document.getElementById('app')

ReactDom.render(<App/>, rootElement)
