import React, {useContext} from 'react'
import AuthAPI from "../services/authAPI"
import {NavLink} from "react-router-dom";
import AuthContext from '../contexts/AuthContext'


const Navbar = ({history}) => {

	const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)

	const handleLogout = () => {
		AuthAPI.logout()
		setIsAuthenticated(false)
		history.push("/login")
	}

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
			<NavLink className="navbar-brand" to="/">SymReact !</NavLink>

			<div className="">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item">
						<NavLink className="nav-link" to="/customers">Clients</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="/invoices">Factures</NavLink>
					</li>
				</ul>
				<ul className="navbar-nav ml-auto">
					{!isAuthenticated && (<>
						<li className="nav-item"><NavLink to="/register" className="nav-link">Inscription</NavLink></li>
						<li className="nav-item"><NavLink to="/login" className="btn btn-success">Connexion</NavLink>
						</li>
					</>) ||
					(<li className="nav-item">
						<button onClick={handleLogout} className="btn btn-danger">Déconnexion</button>
					</li>)
					}
				</ul>
			</div>
		</nav>
	)
}


export default Navbar;
