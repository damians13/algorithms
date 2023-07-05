import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/index.css"
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<React.StrictMode>
		<link rel="stylesheet" href="./prism.css" />
		<script src="./prism.js" />
		<App />
	</React.StrictMode>
)
