import React, { Fragment, useState } from "react";

import { Popover, Button } from "antd";

import { SettingOutlined, DeleteOutlined, PlusOutlined, CheckOutlined, EditOutlined } from '@ant-design/icons';

const EditMenu = ({onEditSaveClick, onEditParentClick, onDeleteClick, onNewClick}) => {
    const [editMode, setEditMode] = useState(false);

    const onEditClick = () => {
        onEditParentClick();
        setEditMode(!editMode);
    };

    const popoverContent = (
        <Fragment>
            <Button icon={<PlusOutlined/>} onClick={onNewClick}/>
            <Button icon={<EditOutlined/>} onClick={onEditClick}/>
            <Button icon={<DeleteOutlined/>} onClick={onDeleteClick}/>
        </Fragment>
    );

    return (
        <Popover content={popoverContent} placement="left" trigger="click">
            <Button shape="circle" 
                icon={editMode == true ? <CheckOutlined /> : <SettingOutlined />} 
                onClick={editMode == true ? onEditSaveClick : () => ""} />
        </Popover>
    );
};

export default EditMenu;