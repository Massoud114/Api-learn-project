import React, {useEffect, useState} from "react";
import Pagination from "../components/pagination";
import moment from "moment"
import InvoicesAPI from "../services/invoicesAPI"
import {Link} from "react-router-dom";

const STATUS_CLASSES = {
	PAID: "success",
	SENT: "primary",
	CANCELED: "danger"
}

const STATUS_LABELS = {
	PAID: "Payée",
	SENT: "Envoyée",
	CANCELED: "Annulée"
}

const InvoicesPage = (props) => {

	const [invoices, setInvoices] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [search, setSearch] = useState('')
	const itemsPerPage = 10

	const fetchInvoices = async () => {
		try {
			const data = await InvoicesAPI.findAll()
			setInvoices(data)
		} catch (error) {
			console.log(error.response)
		}
	}

	useEffect(() => {
		fetchInvoices()
	}, [])

	const handleChangePage = page => setCurrentPage(page)

	const handleSearch = ({currentTarget}) => {
		setSearch(currentTarget.value)
		setCurrentPage(1)
	}

	const handleDelete = async (id) => {
		const originalInvoices = [...invoices]

		setInvoices(invoices.filter(invoice => invoice.id !== id))

		try {
			await InvoicesAPI.delete(id)
		} catch (error) {
			console.log(error.response)
			setInvoices(originalInvoices)
		}
	}


	const filteredInvoices = invoices.filter(
		i => i.customer.firstname.toLowerCase().includes(search.toLowerCase()) ||
			i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
			i.amount.toString().startsWith(search.toLowerCase()) ||
			STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
	)

	const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage)

	const formatDate = (str) => moment(str).format("DD/MM/YYYY")

	return (
		<>
			<div className="d-flex justify-content-between align-items-center">
				<h1>Liste des factures</h1>
				<Link to="/invoices/new" className="btn btn-primary">Créer une facture </Link>

			</div>

			<div className="form-group">
				<input type="text" onChange={handleSearch} value={search} className="form-control"
					   placeholder="Rechercher..."/>
			</div>

			<table className="table table-hover">
				<thead>
				<tr>
					<th>Numéro</th>
					<th>Client</th>
					<th className="text-center">Date d'envoie</th>
					<th className="text-center">Statut</th>
					<th className="text-center">Montant</th>
					<th>Actions</th>
				</tr>
				</thead>
				<tbody>
				{paginatedInvoices.map(invoice => <tr key={invoice.id}>
					<td>{invoice.id}</td>
					<td>
						<a href="#">{invoice.customer.firstname} {invoice.customer.lastname}</a>
					</td>
					<td className="text-center">{formatDate(invoice.sentAt)}</td>
					<td className="text-center">
						<span
							className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
					</td>
					<td className="text-center">{invoice.amount.toLocaleString()} £</td>
					<td>
						<Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-2">Editer</Link>
						<button onClick={() => handleDelete(invoice.id)} className="btn btn-sm btn-danger">Supprimer
						</button>
					</td>
				</tr>)}
				</tbody>
			</table>
			<Pagination
				currentPage={currentPage}
				itemsPerPage={itemsPerPage}
				onPageChanged={handleChangePage}
				length={filteredInvoices.length}
			/>
		</>
	)
}

export default InvoicesPage
