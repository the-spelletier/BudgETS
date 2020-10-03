import React from "react";
import {Table} from "antd";

import "./editable-table.scss";

const EditableTable = ({columns, values}) => {
    return (
        <Table 
            className="no-paging"
            columns={columns} 
            dataSource={values} />
    );
};

export default EditableTable;