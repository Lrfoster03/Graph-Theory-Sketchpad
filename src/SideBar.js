import React from 'react';
import './SideBar.css'
import SideBarButton from "./SideBarButton";
import ClickAction from "./ClickAction";
import {SketchPicker} from "react-color";

function SideBar(props) {
    const {clickAction, setClickAction, color, setColor, vertices, edges, setVertices, setEdges} = props
    const [showImportPopup, setShowImportPopup] = React.useState(false);
    const [importData, setImportData] = React.useState('');
    const [showExportPopup, setShowExportPopup] = React.useState(false);
    const [exportData, setExportData] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('JSON'); // 'JSON' or 'Matrix'

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
        {name: 'Export', onClickAction: 'EXPORT'},
        {name: 'Import', onClickAction: 'IMPORT'},
        {name: 'Color', onClickAction: ClickAction.COLOR}
    ];

    // --- Adjacency Matrix helpers ---
    const graphToAdjacencyMatrix = React.useCallback(() => {
        const size = vertices.length;
        const matrix = Array.from({length: size}, () => Array(size).fill(0));
        edges.forEach(edge => {
            const from = vertices.indexOf(edge.endpoints[0]);
            const to = vertices.indexOf(edge.endpoints[1]);
            if (edge.directedBool) {
                matrix[from][to] += 1; // Only one direction
            } else {
                matrix[from][to] += 1;
                matrix[to][from] += 1; // Both directions for undirected
            }
        });
        return matrix.map(row => row.join(' ')).join('\n');
    }, [vertices, edges]);

    const adjacencyMatrixToGraph = (matrixStr) => {
        const rows = matrixStr.trim().split('\n');
        const size = rows.length;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const radius = Math.min(centerX, centerY) / 2.5;
        const newVertices = Array.from({length: size}, (_, i) => {
            const angle = (2 * Math.PI * i) / size;
            return {
                position: [
                    centerX + radius * Math.cos(angle),
                    centerY + radius * Math.sin(angle)
                ],
                color: '#000000'
            };
        });
        const newEdges = [];
        rows.forEach((row, i) => {
            row.trim().split(/\s+/).forEach((val, j) => {
                const count = parseInt(val, 10);
                for (let k = 0; k < count; k++) {
                    if (count > 0) {
                        newEdges.push({
                            endpoints: [newVertices[i], newVertices[j]],
                            color: '#000000',
                            directedBool: i !== j // treat all as directed except self-loops
                        });
                    }
                }
            });
        });
        setVertices(newVertices);
        setEdges(newEdges);
    };

    // --- Export handler ---
    const handleExport = () => {
        setShowExportPopup(true);
    };

    // Update exportData when tab, vertices, edges, or popup changes
    React.useEffect(() => {
        if (showExportPopup) {
            if (activeTab === 'JSON') {
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
            } else {
                setExportData(graphToAdjacencyMatrix());
            }
        }
    }, [activeTab, vertices, edges, showExportPopup, graphToAdjacencyMatrix]);

    // Save graph data to localStorage whenever vertices or edges change
    React.useEffect(() => {
        const data = {
            vertices: vertices.map((v) => ({
                x: v.position[0],
                y: v.position[1],
                color: v.color
            })),
            edges: edges.map((e) => ({
                from: vertices.indexOf(e.endpoints[0]),
                to: vertices.indexOf(e.endpoints[1]),
                directed: e.directedBool,
                color: e.color
            }))
        };
        localStorage.setItem('graphData', JSON.stringify(data));
    }, [vertices, edges]);

    // Copy to clipboard
    const handleCopy = () => {
        navigator.clipboard.writeText(exportData);
    };

    // Close popup
    const handleClose = () => {
        setShowExportPopup(false);
    };

    // --- Import handler ---
    const handleImport = () => {
        try {
            if (activeTab === 'JSON') {
                const data = JSON.parse(importData);
                if (Array.isArray(data.vertices) && Array.isArray(data.edges)) {
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
            } else {
                adjacencyMatrixToGraph(importData);
                setShowImportPopup(false);
            }
        } catch (err) {
            alert("Error parsing input.");
        }
    };

    // Open import popup
    const openImportPopup = () => {
        setImportData('');
        setShowImportPopup(true);
    };

    // --- Tabs UI ---
    const renderTabs = () => (
        <div style={{display: 'flex', marginBottom: '1rem'}}>
            <button
                style={{flex: 1, background: activeTab === 'JSON' ? '#ddd' : '#fff'}}
                onClick={() => setActiveTab('JSON')}
            >JSON</button>
            <button
                style={{flex: 1, background: activeTab === 'Matrix' ? '#ddd' : '#fff'}}
                onClick={() => setActiveTab('Matrix')}
            >Adjacency Matrix</button>
        </div>
    );

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
                    <h3>Export Graph</h3>
                    {renderTabs()}
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
                    <h3>Import Graph</h3>
                    {renderTabs()}
                    <textarea
                        style={{width: '100%', height: '200px'}}
                        value={importData}
                        onChange={e => setImportData(e.target.value)}
                        placeholder={activeTab === 'JSON' ? "Paste your graph JSON here" : "Paste adjacency matrix here"}
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