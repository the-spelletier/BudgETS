import React, { Fragment, useState, useEffect, useContext } from "react";
import { Table, Card} from "antd";

import EditableTable from "../components/editable-table/EditableTable";
import EditMenu from "../components/edit-menu/EditMenu";
import BudgetHeader from "../budget/header/BudgetHeader";
import CreateCategory from "./create/CreateCategorie";
import CreateLine from "./lines/create/CreateLine";
import { CategoryClient } from "../clients/CategoryClient";
import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";

import "./categories.scss";

const Categories = () => {
    const categoryClient = new CategoryClient();

    const {budget} = useContext(BudgetContext);
    const {user} = useContext(UserContext)

    // Create category
    const [createOrEditCategoryModalIsVisible, setOrEditCreateCategoryModalIsVisible] = useState(false);
    
    // Edit category
    const [currentCategory, setCurrentCategory] = useState(null);
    const onEditCategory = (category) => {
        setCurrentCategory(category);
        setOrEditCreateCategoryModalIsVisible(true);
    }

    const onCreateCategory = () => {
        setOrEditCreateCategoryModalIsVisible(true);
    };

    const onCreateOrEditCategoryModalCancel = () => {
        setCurrentCategory(null);
        setOrEditCreateCategoryModalIsVisible(false);
    };

    // Create line
    const [createLineModalIsVisible, setCreateLineModalIsVisible] = useState(false);
    const [createLineAssociatedCategory, setCreateLineAssociatedCategory] = useState(null);

    const onCreateLine = (categoryId) => {
        setCreateLineAssociatedCategory(categoryId);
        setCreateLineModalIsVisible(true);
    };

    const onCreateLineModalCancel = () => {
        setCreateLineAssociatedCategory(null);
        setCreateLineModalIsVisible(false);
    };

    // General usage
    const [categories, setCategories] = useState(null);
    const [headerData, setHeaderDate] = useState({total: "Total", estimateTotal: 0, realTotal: 0});

    useEffect(() => {
        const getCategories = async() => {
            var response = await categoryClient.getList(user.token, budget.id);
            setCategories(response.data);
        };

        if (user.token && budget.id) {
            getCategories();
        }
    }, [user.token, budget.id, createOrEditCategoryModalIsVisible]);

    const buildColumns = (category) => {
        var totalEstimate = 0;
        category.Lines.forEach((line) => totalEstimate += line.estimate);

        return [
            {
                title: <EditMenu onNewClick={onCreateCategory} onEditClick={() => {onEditCategory(category)}}/>,
                render: () => ""
            },
            { 
                title: category.id,
                render: () => <EditMenu onNewClick={() => {onCreateLine(category.id)}}/> 
            },
            {
                title: category.name,
                render: () => ""
            },
            {
                title: "",
                render: (line) => line.id
            },
            {
                title: "",
                render: (line) => line.name
            },
            {
                title: "",
                render: (line) => line.description
            },
            {
                title: totalEstimate,
                render: (line) => category.type === "revenue" ? line.expenseEstimate : "( " + line.expenseEstimate + " )"
            },
            {
                title: "0", 
                render: () => 0
            }
        ]
    };

    const headerColumns = [
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: (val) => val.total
        },
        {
            title: "Prévisions",
            render: (val) => val.estimateTotal
        },
        {
            title: "Réel",
            render: (val) => val.realTotal
        }
    ];

    return (
        <Fragment>
            <BudgetHeader />
            {
                categories &&
                <Fragment>
                    <CreateCategory visible={createOrEditCategoryModalIsVisible} onCancel={onCreateOrEditCategoryModalCancel} initialCategory={currentCategory}/>
                    <CreateLine visible={createLineModalIsVisible} onCancel={onCreateLineModalCancel} categoryId={createLineAssociatedCategory} />
                    <Card>
                        <Table columns={headerColumns} dataSource={[headerData]} className="no-paging"/>
                        {
                            categories.map((category) => category.Lines && <EditableTable columns={buildColumns(category)} values={category.Lines}/>)
                        }    
                    </Card>
                </Fragment>
            }
        </Fragment>
    );
};

export default Categories;