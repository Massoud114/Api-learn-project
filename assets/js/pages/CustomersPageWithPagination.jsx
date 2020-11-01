import React, { useEffect, useState } from "react";
import axios from 'axios'
import Pagination from "../components/pagination";

const CustomersPageWithPagination = (props) => {

	const [customers, setCustomers] = useState([])
	const [totalItems, setTotalItems] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	useEffect(() => {
		axios.get(`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
			.then(response => {
				setCustomers(response.data["hydra:member"]);
				setTotalItems(response.data["hydra:totalItems"]);
			})
			.catch(error => console.log(error.response))
	}, [currentPage])

	const handleDelete = (id) => {

		const originalCustomers = [...customers]
		setCustomers(customers.filter(customer => customer.id !== id))

		axios
			.delete("http://localhost:8000/api/customers/" + id)
			.catch(error => {
				setCustomers(originalCustomers)
				console.log(error.response)
			})
	}

	const handleChangePage = (page) => {
		setCustomers([])
		setCurrentPage(page)
	}

	const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage)
	return <>
		<h1>Liste des clients Paginées</h1>
		<table className="table table-hover">
			<thead>
			<tr>
				<th>Id.</th>
				<th>Client</th>
				<th>Email</th>
				<th>Entreprise</th>
				<th className="text-center">Factures</th>
				<th className="text-center">Montant total</th>
				<th/>
			</tr>
			</thead>
			<tbody>
			{customers.length === 0 && (
				<tr>
					<td>Chargement ...</td>
				</tr>
			)}
			{customers.map(customer => <tr key={customer.id}>
				<td>{customer.id}</td>
				<td><a href="#">{customer.firstname} {customer.lastname}</a></td>
				<td>{customer.email}</td>
				<td>{customer.company}</td>
				<td className="text-center">
					<span className="badge badge-primary">{customer.invoices.length}</span>
				</td>
				<td className="text-center">{customer.totalAmount.toLocaleString()} £</td>
				<td>
					<button onClick={() => handleDelete(customer.id)} disabled={customer.invoices.length > 0} className="btn btn-sm btn-danger">Supprimer</button>
				</td>
			</tr>)}
			</tbody>
		</table>
		<Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handleChangePage} />
	</> ;
}

export default CustomersPageWithPagination;
