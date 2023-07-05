import "../styles/UpArrow.css"

function UpArrow(props) {
	return (
		<div id={props.id} className="up-arrow">
			<div className="up-arrow-arrow">
				<div className="up-arrow-left" />
				<div className="up-arrow-middle" />
				<div className="up-arrow-right" />
			</div>
			<p className="up-arrow-text">{props.text}</p>
		</div>
	)
}

export default UpArrow
