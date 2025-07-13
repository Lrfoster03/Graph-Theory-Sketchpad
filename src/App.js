// ...existing code...
import React, {useState} from 'react';

import './App.css';
import Field from './Field';
import SideBar from "./SideBar";
import ClickAction from "./ClickAction";

function parseGraphState(json) {
    try {
        const data = JSON.parse(json);
        if (Array.isArray(data.vertices) && Array.isArray(data.edges)) {
            const vertices = data.vertices.map(v => ({
                position: [v.x, v.y],
                color: v.color
            }));
            const edges = data.edges.map(e => ({
                endpoints: [vertices[e.from], vertices[e.to]],
                color: e.color,
                directedBool: e.directed
            }));
            return { vertices, edges };
        }
    } catch (e) {}
    return { vertices: [], edges: [] };
}

function App() {
  const [clickAction, setClickAction] = useState(ClickAction.SELECT)
  const [color, setColor] = useState('#000000');
  const stored = localStorage.getItem('graphData');
  const initial = stored ? parseGraphState(stored) : { vertices: [], edges: [] };

  const [vertices, setVertices] = useState(initial.vertices);
  const [edges, setEdges] = useState(initial.edges);

  return (
    <div className="App">
      <SideBar
        clickAction={clickAction}
        setClickAction={setClickAction}
        color={color}
        setColor={setColor}
        vertices={vertices}
        edges={edges}
        setVertices={setVertices}
        setEdges={setEdges}
      />
      <Field
        clickAction={clickAction}
        color={color}
        vertices={vertices}
        setVertices={setVertices}
        edges={edges}
        setEdges={setEdges}
      />
    </div>
  );
}

export default App;