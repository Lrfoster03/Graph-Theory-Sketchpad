import React from 'react';
import './SideBar.css'
import SideBarButton from "./SideBarButton";
import ClickAction from "./ClickAction";
import {SketchPicker} from "react-color";

function SideBar(props) {
    const {clickAction, setClickAction, color, setColor} = props

    const makeButton = ({name, onClickAction}) => {
        return (
            <SideBarButton
                name={name}
                clickAction={clickAction}
                onClickAction={onClickAction}
                setClickAction={setClickAction}
                key={onClickAction}
            />
        )
    }

    const buttonData = [
        {name: 'Select', onClickAction: ClickAction.SELECT},
        {name: 'New Vertex', onClickAction: ClickAction.ADD_VERTEX},
        {name: 'New Edge', onClickAction: ClickAction.ADD_EDGE},
        {name: 'New Directed Edge', onClickAction: ClickAction.ADD_DIRECTED_EDGE},
        {name: 'Delete', onClickAction: ClickAction.DELETE},
        {name: 'Color', onClickAction: ClickAction.COLOR}
    ]

    return (
        <div className="SideBar">
            {buttonData.map(element => makeButton(element))}
            <SketchPicker
                color={color}
                onChange={(color, event) => setColor(color.hex)}
                width='91%'/>
        </div>
    );
}

export default SideBar;