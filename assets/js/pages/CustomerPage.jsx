import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/customersAPI";

const CustomerPage = ({match, history}) => {
	const {id = "new"} = match.params;

	const [customer, setCustomer] = useState({
		lastname: "",
		firstname: "",
		email: "",
		company: ""
	})

	const [errors, setErrors] = useState({
		lastname: "",
		firstname: "",
		email: "",
		company: ""
	})

	const [editing, setEditing] = useState(false)

	// récupération du customer selon l'identifiant
	const fetchCustomer = async id => {
		try {
			const {firstname, lastname, email, company} = await CustomersAPI.find(id)
			setCustomer({firstname, lastname, email, company})
		} catch (error) {
			console.log(error.response);
			// TODO : flash error
			history.replace("/customers")
		}
	}

	// Chargement de l'utilisateur ( new || id )
	useEffect(() => {
		if (id !== "new") {
			setEditing(true)
			fetchCustomer(id)
		}
	}, [id])

	// Gestion changement input
	const handleChange = ({currentTarget}) => {
		const {name, value} = currentTarget
		setCustomer({...customer, [name]: value})
	}

	// Gestion soummission input
	const handleSubmit = async (event) => {
		event.preventDefault()

		try {
			if (editing) {
				await CustomersAPI.update(id, customer)
				// TODO : flash succès
			} else {
				await CustomersAPI.create(customer)
				// TODO : flash succès
				history.replace("/customers")
			}
			setErrors({})
		} catch ({response}) {
			const {violations} = response.data
			if (violations) {
				const apiErrors = {}
				violations.forEach(({propertyPath, message}) => {
					apiErrors[propertyPath] = message
				})
				setErrors(apiErrors);
				// TODO : flash errors
			}
		}
	}

	return (<>
		{!editing && <h1>Création d'un compte</h1> || <h1>Modification du client</h1>}

		<form onSubmit={handleSubmit}>
			<Field name="lastname" label="Nom" placeholder="Nom" value={customer.lastname} onChange={handleChange}
				   error={errors.lastname}/>
			<Field name="firstname" label="Prénom" placeholder="Prénom  du client" value={customer.firstname}
				   onChange={handleChange} error={errors.firstname}/>
			<Field name="email" label="E-mail" placeholder="Adresse email" type="email" value={customer.email}
				   onChange={handleChange} error={errors.email}/>
			<Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company}
				   onChange={handleChange} error={errors.company}/>
			<div className="form-group">
				<button type="submit" className="btn btn-success">Enregistrer</button>
				<Link to="/customers" className="btn btn-link">Retour à la liste</Link>
			</div>
		</form>
	</>)
};

export default CustomerPage;
