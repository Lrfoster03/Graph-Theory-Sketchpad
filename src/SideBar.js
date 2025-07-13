// ...existing code...
import React from 'react';
import './SideBar.css'
import SideBarButton from "./SideBarButton";
import ClickAction from "./ClickAction";
import {SketchPicker} from "react-color";

function SideBar(props) {
    const {clickAction, setClickAction, color, setColor, vertices, edges, setVertices, setEdges} = props

    const [showImportPopup, setShowImportPopup] = React.useState(false);
    const [importData, setImportData] = React.useState('');

    const makeButton = ({name, onClickAction}) => {
        if (onClickAction === 'EXPORT') {
            return (
                <SideBarButton
                    name={name}
                    clickAction={clickAction}
                    onClickAction={handleExport}
                    setClickAction={setClickAction}
                    key={onClickAction}
                />
            );
        }
        if (onClickAction === 'IMPORT') {
            return (
                <SideBarButton
                    name={name}
                    clickAction={clickAction}
                    onClickAction={openImportPopup}
                    setClickAction={setClickAction}
                    key={onClickAction}
                />
            );
        }
        return (
            <SideBarButton
                name={name}
                clickAction={clickAction}
                onClickAction={onClickAction}
                setClickAction={setClickAction}
                key={onClickAction}
            />
        );
    };

    const buttonData = [
        {name: 'Select', onClickAction: ClickAction.SELECT},
        {name: 'New Vertex', onClickAction: ClickAction.ADD_VERTEX},
        {name: 'New Edge', onClickAction: ClickAction.ADD_EDGE},
        {name: 'New Directed Edge', onClickAction: ClickAction.ADD_DIRECTED_EDGE},
        {name: 'Delete', onClickAction: ClickAction.DELETE},
        {name: 'Color', onClickAction: ClickAction.COLOR},
        {name: 'Export', onClickAction: 'EXPORT'},
        {name: 'Import', onClickAction: 'IMPORT'}
    ];

    // Popup state
    const [showExportPopup, setShowExportPopup] = React.useState(false);
    const [exportData, setExportData] = React.useState('');

    // Export handler
    const handleExport = () => {
        const data = {
            vertices: vertices.map((v, i) => ({
                id: i,
                x: v.position[0],
                y: v.position[1],
                color: v.color
            })),
            edges: edges.map((e, i) => ({
                id: i,
                from: vertices.indexOf(e.endpoints[0]),
                to: vertices.indexOf(e.endpoints[1]),
                directed: e.directedBool,
                color: e.color
            }))
        };
        setExportData(JSON.stringify(data, null, 2));
        setShowExportPopup(true);
    };

    // Copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(exportData);
    };

    // Close popup
    const handleClose = () => {
        setShowExportPopup(false);
    };

    // Import handler
    const handleImport = () => {
        try {
            const data = JSON.parse(importData);
            if (Array.isArray(data.vertices) && Array.isArray(data.edges)) {
                // Reconstruct vertices and edges
                const newVertices = data.vertices.map(v => ({
                    position: [v.x, v.y],
                    color: v.color
                }));
                const newEdges = data.edges.map(e => ({
                    endpoints: [newVertices[e.from], newVertices[e.to]],
                    color: e.color,
                    directedBool: e.directed
                }));
                setVertices(newVertices);
                setEdges(newEdges);
                setShowImportPopup(false);
            } else {
                alert("Invalid JSON format.");
            }
        } catch (err) {
            alert("Error parsing JSON.");
        }
    };

    // Open import popup
    const openImportPopup = () => {
        setImportData('');
        setShowImportPopup(true);
    };

return (
        <div className="SideBar">
            {buttonData.map(element => makeButton(element))}
            <SketchPicker
                color={color}
                onChange={(color, event) => setColor(color.hex)}
                width='91%'/>
            {showExportPopup && (
                <div style={{
                    position: 'fixed',
                    top: '20%',
                    left: '40%',
                    width: '20%',
                    background: 'white',
                    border: '2px solid black',
                    padding: '1rem',
                    zIndex: 1000
                }}>
                    <h3>Export Graph JSON</h3>
                    <textarea
                        style={{width: '100%', height: '200px'}}
                        value={exportData}
                        readOnly
                    />
                    <div style={{marginTop: '1rem'}}>
                        <button onClick={handleCopy}>Copy</button>
                        <button onClick={handleClose} style={{marginLeft: '1rem'}}>Close</button>
                    </div>
                </div>
            )}
            {showImportPopup && (
                <div style={{
                    position: 'fixed',
                    top: '20%',
                    left: '40%',
                    width: '20%',
                    background: 'white',
                    border: '2px solid black',
                    padding: '1rem',
                    zIndex: 1000
                }}>
                    <h3>Import Graph JSON</h3>
                    <textarea
                        style={{width: '100%', height: '200px'}}
                        value={importData}
                        onChange={e => setImportData(e.target.value)}
                        placeholder="Paste your graph JSON here"
                    />
                    <div style={{marginTop: '1rem'}}>
                        <button onClick={handleImport}>Import</button>
                        <button onClick={() => setShowImportPopup(false)} style={{marginLeft: '1rem'}}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SideBar;