import React, {useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import axios from "axios"
import UserAPI from "../services/userAPI"

const RegisterPage = ({history}) => {

	const [user, setUser] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConfirm: ""
	})

	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		passwordConfirm: ""
	})

	// Gestion changement input
	const handleChange = ({currentTarget}) => {
		const {name, value} = currentTarget
		setUser({...user, [name]: value})
	}

	const handleSubmit = async (event) => {
		event.preventDefault()

		const apiErrors = {}
		if (user.password !== user.passwordConfirm) {
			apiErrors.passwordConfirm = "Veuillez bien confirmer le mot de passe"
			setErrors(apiErrors)
			return
		}

		try {
			await UserAPI.register(user)
			setErrors({})
			// TODO : flash succès
			history.replace('/login')
		} catch ({response}) {
			const {violations} = response.data
			if (violations) {
				violations.forEach(({propertyPath, message}) => {
					apiErrors[propertyPath] = message
				})
				setErrors(apiErrors);
				// TODO : flash errors
			}
		}
	}

	return (<>
		<h1>Inscription </h1>

		<form onSubmit={handleSubmit}>
			<Field name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName} onChange={handleChange} value={user.firstName}/>
			<Field name="lastName" label="Nom" placeholder="Votre nom" error={errors.lastName} onChange={handleChange} value={user.lastName}/>
			<Field name="email" type="email" label="Adresse Email" placeholder="Votre Email" error={errors.email} onChange={handleChange} value={user.email}/>
			<Field name="password" label="Password" type="password" placeholder="Votre mot de passe" error={errors.password} onChange={handleChange} value={user.password}/>
			<Field name="passwordConfirm" label="Confirmation" type="password" placeholder="Confirmer le mot de passe" error={errors.passwordConfirm} onChange={handleChange} value={user.passwordConfirm}/>
			<div className="form-group">
				<button type="submit" className="btn btn-success">Inscription</button>
				<Link to="/login" className="btn btn-Link">J'ai  déja un compte</Link>
			</div>
		</form>
	</>)
};

export default RegisterPage;
