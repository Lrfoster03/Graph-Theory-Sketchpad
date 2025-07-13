import React from "react";
import Button from 'react-bootstrap/Button';
import './SideBarButton.css'

function SideBarButton(props) {
    const {name, clickAction, onClickAction, setClickAction} = props
    return (
        <Button
            className="SideBarButton"
            variant="outline-primary"
            onClick={() => setClickAction(onClickAction)}
            active={clickAction === onClickAction}
        >
            <div className={'SideBarButton-Name'}>{name}</div>
        </Button>
    )
};

export default SideBarButton;