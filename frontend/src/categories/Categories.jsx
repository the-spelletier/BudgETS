import React, { Fragment, useState, useEffect, useContext } from "react";
import { Table, Card, notification, Button} from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import EditableTable from "../components/editable-table/EditableTable";
import EditMenu from "../components/edit-menu/EditMenu";
import BudgetHeader from "../budget/header/BudgetHeader";
import CreateCategory from "./create/CreateCategorie";
import CreateLine from "./lines/create/CreateLine";
import { CategoryClient } from "../clients/CategoryClient";
import { LineClient } from "../clients/LineClient";
import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";

import "./categories.scss";

const Categories = () => {
    const categoryClient = new CategoryClient();
    const lineClient = new LineClient();

    const {budget} = useContext(BudgetContext);
    const {user} = useContext(UserContext)

    // TODO : find a cleaner way 
    const [refreshCategories, setRefreshCategories] = useState(false);

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

    // Delete category
    const onDeleteCategory = (category) => {
        const deleteCategory = async() => {
            try {
                await categoryClient.delete(user.token, category.id);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "La catégorie a été supprimée avec succès",
                    });
            }
            catch (e) {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en supprimant la catégorie",
                    });
            }
        };

        if (!category.Lines || category.Lines.length === 0) {
            deleteCategory();

            var newCategories = categories.filter((c) => c.id !== category.id);
            setCategories(newCategories);

        }
        else {
            notification.open({
                message: "Erreur",
                icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                description:
                  "Impossible de supprimer la catégorie : des lignes lui sont associées!",
                });
        }
    }

    // Create line
    const [createOrEditLineModalIsVisible, setCreateOrEditLineModalIsVisible] = useState(false);
    const [createOrEditLineAssociatedCategory, setCreateLineAssociatedCategory] = useState(null);
    const [currentLine, setCurrentLine] = useState(null);

    const onEditLine = (categoryId, line) => {
        setCurrentLine(line);
        setCreateLineAssociatedCategory(categoryId);
        setCreateOrEditLineModalIsVisible(true);
    }

    const onCreateLine = (categoryId) => {
        setCreateLineAssociatedCategory(categoryId);
        setCreateOrEditLineModalIsVisible(true);
    };

    const onCreateOrEditLineModalCancel = () => {
        setCreateLineAssociatedCategory(null);
        setCreateOrEditLineModalIsVisible(false);
        setCurrentLine(null);
    };

    const onDeleteLine = (line) => {
        const deleteLine = async() => {
            try {
                await lineClient.delete(user.token, line.id);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "La ligne a été supprimée avec succès",
                    });
                setRefreshCategories(true);
            }
            catch (e) {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en supprimant la ligne",
                    });
            }
        };

        deleteLine();
    };

    // General usage
    const [categories, setCategories] = useState(null);
    const [headerData, setHeaderData] = useState({total: "Total", estimateTotal: 0, realTotal: 0});

    const getCategories = async() => {
        var response = await categoryClient.getList(user.token, budget.id);
        setCategories(response.data);
    };
    
    useEffect(() => {
        if (user.token && budget.id) {
            getCategories();
            setRefreshCategories(false);
        }
    }, [user.token, budget.id, createOrEditCategoryModalIsVisible, createOrEditLineModalIsVisible, refreshCategories]);

    const buildColumns = (category) => {
        var totalEstimate = 0;
        category.lines.forEach((line) => totalEstimate += Number(line.estimate));

        return [
            {
                title: <EditMenu onNewClick={onCreateCategory} onEditClick={() => {onEditCategory(category)}} onDeleteClick={() => {onDeleteCategory(category)}}/>,
                render: () => ""
            },
            { 
                title: category.id,
                render: (line) => <EditMenu onNewClick={() => {onCreateLine(category.id)}} onEditClick={() => {onEditLine(category.id, line)}} onDeleteClick={() => {onDeleteLine(line)}}/> 
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
                title: totalEstimate.toFixed(2),
                render: (line) => category.type === "revenue" ? 
                    Number(line.estimate).toFixed(2) : 
                    "( " + Number(line.estimate).toFixed(2) + " )"
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
                    <CreateLine visible={createOrEditLineModalIsVisible} onCancel={onCreateOrEditLineModalCancel} initialLine={currentLine} categoryId={createOrEditLineAssociatedCategory} />
                    <Card>
                        <Table columns={headerColumns} dataSource={[headerData]} className="no-paging"/>
                        {
                            categories.map((category) => 
                                <Fragment key={category.id}>
                                    {  
                                        category.lines && <EditableTable columns={buildColumns(category)} values={category.lines}/> 
                                    }
                                    { 
                                        category.lines && category.lines.length === 0 && 
                                        <Button onClick={() => {onCreateLine(category.id)}}>Ajouter une ligne</Button>
                                    }
                                </Fragment>
                            )
                        }    
                    </Card>
                </Fragment>
            }
        </Fragment>
    );
};

export default Categories;