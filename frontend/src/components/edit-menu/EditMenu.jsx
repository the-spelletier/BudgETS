import React, { Fragment } from "react";

import { Popover, Button, Popconfirm } from "antd";

import { SettingOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const EditMenu = ({onEditClick, onDeleteClick, onDeleteMessage, disabled}) => {

    const popoverContent = (
        <Fragment>
            <Button icon={<EditOutlined/>} disabled={disabled} onClick={onEditClick}/>
            <Popconfirm disabled={disabled} title={onDeleteMessage} okText="Oui" cancelText="Non" onConfirm={onDeleteClick}>
                <Button icon={<DeleteOutlined/>} disabled={disabled}/>
            </Popconfirm>
        </Fragment>
    );

    return (
        <Popover disabled={disabled} content={popoverContent} placement="left" trigger="click">
            <Button disabled={disabled}
                shape="circle" 
                icon={<SettingOutlined />} 
                onClick={() => ""} />
        </Popover>
    );
};

export default EditMenu;