import React, { Fragment, useState } from "react";

import { Popover, Button } from "antd";

import { SettingOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';

const EditMenu = ({onEditClick, onDeleteClick}) => {

    const popoverContent = (
        <Fragment>
            <Button icon={<EditOutlined/>} onClick={onEditClick}/>
            <Button icon={<DeleteOutlined/>} onClick={onDeleteClick}/>
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