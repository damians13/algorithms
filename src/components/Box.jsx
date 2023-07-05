import "../styles/Box.css"

export function animatedMove(id, x0, y0, x1, y1, easingFn = "cubic-bezier(0.65, 0, 0.35, 1)", duration = 500) {
	document.getElementById(id).animate([{ transform: "translate(" + x0 + ", " + y0 + ")" }, { transform: "translate(" + x1 + ", " + y1 + ")" }], {
		fill: "forwards",
		easing: easingFn,
		duration: duration,
	})
}

function Box(props) {
	return (
		<div id={props.id} className="box">
			<p className="box-text">{props.text}</p>
		</div>
	)
}

export default Box
