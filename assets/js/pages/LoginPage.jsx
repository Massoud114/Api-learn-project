import React, {useState, useContext} from "react"
import AuthAPI from "../services/authAPI"
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";


const LoginPage = ({history}) => {

	const {setIsAuthenticated} = useContext(AuthContext)

	const [credentials, setCredentials] = useState({
		username : "t@t.c",
		password : "password"
	})

	const [error, setError] = useState("")

	const handleChange = ({currentTarget}) => {
		setCredentials({...credentials, [currentTarget.name]: currentTarget.value})
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			await AuthAPI.authenticate(credentials)
			setError("")
			setIsAuthenticated(true)
			history.replace("/customers")
		} catch (error) {
			setError("Info invalides")
		}
	}

	return (
		<>
			<h1>Connexion à l'application</h1>

			<form onSubmit={handleSubmit}>
				<Field name="username" label="Adresse E-mail" placeholder="Email" type="email" onChange={handleChange} value={credentials.username} error={error} />
				<Field name="password" label="Mot de passe" type="password" onChange={handleChange} value={credentials.password} error={error} />
				<div className="form-group">
					<button type="submit" className="btn btn-success">Connexion</button>
				</div>
			</form>
		</>
	)
}

export  default LoginPage
