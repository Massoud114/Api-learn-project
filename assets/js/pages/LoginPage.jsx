import React, {useState, useContext} from "react"
import AuthAPI from "../services/authAPI"
import AuthContext from "../contexts/AuthContext";


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
				<div className="form-group">
					<label htmlFor="username">Adresse email</label>
					<input value={credentials.username} onChange={handleChange} type="email" placeholder="Email" className={"form-control" + (error ? " is-invalid" : "")} name="username"/>
					{error && <p className="invalid-feedback">{error}</p>}
				</div>
				<div className="form-group">
					<label htmlFor="password">Mot de passe</label>
					<input type="password" onChange={handleChange} value={credentials.password} placeholder="Mot de passe" className="form-control" name="password"/>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-success">Connexion</button>
				</div>
			</form>
		</>
	)
}

export  default LoginPage
