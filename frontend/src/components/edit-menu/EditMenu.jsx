import React, { Fragment } from "react";

import { Popover, Button, Popconfirm } from "antd";

import { SettingOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const EditMenu = ({onEditClick, onDeleteClick, onDeleteMessage}) => {

    const popoverContent = (
        <Fragment>
            <Button icon={<EditOutlined/>} onClick={onEditClick}/>
            <Popconfirm title={onDeleteMessage} okText="Oui" cancelText="Non" onConfirm={onDeleteClick}>
                <Button icon={<DeleteOutlined/>}/>
            </Popconfirm>
        </Fragment>
    );

    return (
        <Popover content={popoverContent} placement="left" trigger="click">
            <Button shape="circle" 
                icon={<SettingOutlined />} 
                onClick={() => ""} />
        </Popover>
    );
};

export default EditMenu;