import React from "react"
import ReactDOM from "react-dom/client"
import "./styles/index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<React.StrictMode>
		<link rel="stylesheet" href="./prism.css" />
		<script src="./prism.js" />
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
)
