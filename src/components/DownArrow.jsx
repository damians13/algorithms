import "../styles/DownArrow.css"

function DownArrow(props) {
	return (
		<div id={props.id} className="down-arrow">
			<p className="down-arrow-text">{props.text}</p>
			<div className="down-arrow-arrow">
				<div className="down-arrow-left" />
				<div className="down-arrow-middle" />
				<div className="down-arrow-right" />
			</div>
		</div>
	)
}

export default DownArrow
