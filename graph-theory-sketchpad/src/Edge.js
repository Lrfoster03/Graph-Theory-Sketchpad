import React from "react";
import './Edge.css'

function Edge(props) {
    const {edge, onMouseDown, offsetLeft, multiplicity} = props
    const [start, end] = edge.endpoints
    const isLoop = start === end;
    const [x1, y1] = [start.position[0] - offsetLeft, start.position[1]] //Starting Vertex
    const [x2, y2] = [end.position[0] - offsetLeft, end.position[1]]     //Ending Vertex
    const color = edge.color
    const directedBool = edge.directedBool


    let d;
    if (isLoop) {
        const radius = 35 + (multiplicity * 10);
        const far = Math.sqrt(2) * radius
        d = `M ${x1} ${y1}
             a ${radius},${radius} 0 0 1 ${-far},${-far}
             a ${radius},${radius} 0 1 1 ${far},${far}`
    } else {
        const magnitude = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
        const [vx, vy] = [(y2-y1) / magnitude, -(x2-x1) / magnitude]
        const distance = 25 * Math.ceil(multiplicity / 2)
        const direction = Math.pow(-1, multiplicity) * (vx >= vy ? (vx === vy ? (x1 > x2 ? 1 : -1) : 1) : -1)
        const [midX, midY] = [(x1 + x2)/2, (y1 + y2)/2]
        const [x3, y3] = [midX + (distance * direction * vx), midY + (distance * direction * vy)]

        d = `M ${x1} ${y1}
             Q ${x3} ${y3} ${x2} ${y2}`
    }


    if (directedBool)
    {
        return (
            <svg>
                <marker id="arrow" markerWidth="10" markerHeight="7" refX="9.5" refY="2.625" orient="auto">
                        <polygon onMouseDown={onMouseDown} stroke={color} strokeWidth='0' fill={color} points='0 0, 7.5 2.625, 0 5.25' />
                </marker>
                <path
                    marker-end='url(#arrow)'
                    onMouseDown={onMouseDown}
                    className='Edge-Path'
                    fill={color}
                    stroke={color}
                    strokeWidth='3'
                    d={d}
                    />
            </svg>
        )
    }
    else
    {
        return (
            <path
                onMouseDown={onMouseDown}
                className='Edge-Path'
                fill='transparent'
                stroke={color}
                strokeWidth='3'
                d={d}
            />
        )
    }




}

export default Edge;