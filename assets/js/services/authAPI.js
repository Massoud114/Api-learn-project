import axios from "axios"
import jwtDecode from "jwt-decode"

/**
 * Déconnexion : Suppression token localStorage and AXIOS
 */
function logout() {
	window.localStorage.removeItem("authToken")
	delete axios.defaults.headers["Authorization"]
}

/**
 * Requete HTTP d'authentification et stockage de token
 * @param {object} credentials
 * @returns {Promise<void>}
 */
function authenticate(credentials) {
	return axios.post("http://localhost:8000/api/login_check", credentials)
		.then(response => response.data.token)
		.then(token => {
			// Stockage du token dans le localS
			// torage
			window.localStorage.setItem("authToken", token)
			// Prévention axios : ajout de header par défaut sur les futures requetes
			setAxiosToken(token)
		})
}

/**
 * Ajout du token dans les headers par défaut de AXIOS
 * @param {string} token token JWT
 */
function setAxiosToken(token) {
	axios.defaults.headers["Authorization"] = "Bearer " + token
}


/**
 * Mise en place lors du chargement
 */
function setup() {
	// Vérification de présence de token
	const token = window.localStorage.getItem("authToken")

	// Si on a token
	if (token) {
		const {exp: expiration} = jwtDecode(token)
		if (expiration * 1000 > new Date().getTime()) {
			setAxiosToken(token)
		}
	}
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns {boolean}
 */
function isAuthenticated() {
	// Vérification de présence de token
	const token = window.localStorage.getItem("authToken")

	if (token) {
		const {exp: expiration} = jwtDecode(token)
		return expiration * 1000 > new Date().getTime();
	}
	return false
}

export default {
	authenticate,
	logout,
	setup,
	 isAuthenticated
}
