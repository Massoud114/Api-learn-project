import React, {useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import {Link} from "react-router-dom";
import CustomerAPI from "../services/customersAPI"
import InvoicesAPI from "../services/invoicesAPI"
import axios from "axios"

const InvoicePage = ({history, match}) => {

	const {id = "new"} = match.params

	const [invoice, setInvoice] = useState({
		amount : "",
		customer: "",
		status: "SENT"
	})

	const [customers, setCustomers] = useState([])

	const [editing, setEditing] = useState(false)

	const [errors, setErrors] = useState({
		amount : "",
		customer: "",
		status: ""
	})

	// Récupération des customers
	const fetchCustomers = async () => {
		try {
			const data =  await CustomerAPI.findAll()
			setCustomers(data)
			if (!invoice.customer) setInvoice({...invoice, customer: data[0].id})
		} catch (error) {
			// TODO : flash error
			history.replace('/invoices')
		}
	}

	// Récupération d'une facture
	const fetchInvoice = async (id) => {
		try {
			const {amount, status, customer} = await InvoicesAPI.find(id)
			setInvoice({amount, status, customer: customer.id})
		} catch (error) {
			// TODO : flash error
			history.replace('/invoices')
		}
	}

	// Récupération liste des customers après chargement
	useEffect(() => {
		fetchCustomers()
	}, [])

	// récupération invoice selon id
	useEffect(() => {
		if (id !== "new") {
			setEditing(true)
			fetchInvoice(id)
		}
	}, [id])

	// Gestion changement input
	const handleChange = ({currentTarget}) => {
		const {name, value} = currentTarget
		setInvoice({...invoice, [name]: value})
	}

	// Gestion soummission formulaire
	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			if (editing) {
				await InvoicesAPI.update(id, invoice)
				// TODO: flash notif succès
			} else {
				await InvoicesAPI.create(invoice)
				// TODO: flash notif succès
				history.replace("/invoices")
			}
		} catch ({response}) {
			console.log(response);
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
		{!editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1>}
		<form onSubmit={handleSubmit}>
			<Field name="amount" type="number" placeholder="Montant de la facture" label="Montant" error={errors.amount} onChange={handleChange} value={invoice.amount}/>
			<Select name="customer" label="Client" value={invoice.customer} error={errors.customer} onChange={handleChange}>
				{customers.map(customer => (
					<option key={customer.id} value={customer.id}>
						{customer.firstname} {customer.lastname}
					</option>
				))}
			</Select>
			<Select name="status" label="label" value={invoice.status} error={errors.status} onChange={handleChange}>
				<option value="SENT">Envoyé</option>
				<option value="PAID">Payée</option>
				<option value="CANCELED">Annulée</option>
			</Select>

			<div className="form-group">
				<button type="submit" className="btn btn-success">Enregistrer</button>
				<Link to="/invoices" className="btn btn-link">Retour à la liste</Link>
			</div>
		</form>
	</>)
};

export default InvoicePage;
