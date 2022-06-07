import { useEffect, useState } from "react";
import axios from "axios";

function App() {
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const { data } = await axios.get("/api/user/showMe");
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, []);

	const [user, setUser] = useState(null);

	async function githubAuth() {
		try {
			const { data } = await axios.get("/api/auth/login/github");
			console.log(data);

			setUser(data);
		} catch (error) {
			console.log(error);
		}
	}
	async function logout() {
		try {
			const { data } = await axios.delete("/api/auth/logout");
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div>
			{/* &scope=user:email */}
			{/* <button onClick={githubAuth}>Sign in with Github</button> */}
			<a href="https://github.com/login/oauth/authorize?client_id=0a35b3d63eed683d5888">
				Sign in with Github
			</a>
			<br></br>
			<br></br>
			<button onClick={logout}>Logout</button>

			<p>{user}</p>
		</div>
	);
}

export default App;
