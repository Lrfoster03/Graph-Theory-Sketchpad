// ...existing code...
import React, {useState} from 'react';

import './App.css';
import Field from './Field';
import SideBar from "./SideBar";
import ClickAction from "./ClickAction";

function App() {
  const [clickAction, setClickAction] = useState(ClickAction.SELECT)
  const [color, setColor] = useState('#000000');
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);

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