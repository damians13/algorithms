import "../styles/Home.css"

function Home({ random, setPage }) {
	function handleRandomClick() {
		setPage(random())
	}

	return (
		<div className="page">
			<div id="home-box" className="fg-box">
				<div id="home-title">
					<p className="title-text">algorithm</p>
					<p id="home-title-pronounciation">[ ˈæl gəˌrɪð əm ]</p>
				</div>
				<div id="home-description">
					<p>
						<i>noun</i>
					</p>
					<li>
						<i>Mathematics</i>. a set of rules for solving a problem in a finite number of steps, such as the Euclidean algorithm for finding the greatest common
						divisor.
					</li>
					<li>
						<i>Computers</i>. an ordered set of instructions recursively applied to transform data input into processed data output, such as a mathematical solution,
						search engine result, descriptive statistics, or predictive text suggestions.
					</li>
				</div>
			</div>
			<button id="home-random" className="button" onClick={handleRandomClick}>
				<p>SHOW ME</p>
			</button>
		</div>
	)
}

export default Home
