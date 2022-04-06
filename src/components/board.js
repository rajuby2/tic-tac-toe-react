import React from "react";
import Block from "./block";

const style =(level) => ({
	width: "500px",
	height: "500px",
	margin: "0 auto",
	display: "grid",
	gridTemplate: level ==="hard"? "repeat(5, 1fr) / repeat(5, 1fr)":"repeat(3, 1fr) / repeat(3, 1fr)",
});

const Board = (props) => (
    <div style={style(props.level)}>
        {[ ...Array(props.size)].map((_,i) => <Block key={i} name={i} onClick={()=>props.onClick(i)} value={props.value[i]}/>)}
    </div> 
)

export default Board