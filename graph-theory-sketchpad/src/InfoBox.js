import React from "react";
import './InfoBox.css'

function InfoBox(props) {
    const {numVertices, numEdges, numComponents} = props
    return (
      <div className='InfoBox'>
          <div>n: <strong>{numVertices}</strong></div>
          <div>m: <strong>{numEdges}</strong></div>
          <div>k: <strong>{numComponents}</strong></div>
      </div>
    );
}

export default InfoBox;