import React, { Fragment, useState, useEffect, useContext } from "react";
import { Table, Card, notification, Button } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons';

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

    const onCreateCategory = (type) => {
        setCurrentCategory({name : "", type: type, orderNumber: 99});
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

        if (!category.lines || category.lines.length === 0) {
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
                title: <EditMenu onEditClick={() => {onEditCategory(category)}} onDeleteClick={() => {onDeleteCategory(category)}}/>,
                width: 50,
                render: () => ""
            },
            { 
                title: category.orderNumber.toString().padStart(3, "0"),
                align: 'left',
                colSpan: 2,
                width: 50,
                render: (line) =>(<EditMenu onEditClick={() => {onEditLine(category.id, line)}} onDeleteClick={() => {onDeleteLine(line)}}/> )
            },
            {
                title: "",
                colSpan: 0,
                width: '20%',
                render: (line) => line.orderNumber.toString().padStart(3, "0")
            },
            {
                title: category.name,
                align: 'left',
                width: '30%',
                render: (line) => line.name
            },
            {
                title: "",
                width: '30%',
                render: (line) => line.description
            },
            {
                title: category.type === "revenue" ? 
                    Number(totalEstimate).toFixed(2) : 
                    "( " + Number(totalEstimate).toFixed(2) + " )",
                width: '20%',
                render: (line) => category.type === "revenue" ? 
                    Number(line.estimate).toFixed(2) : 
                    "( " + Number(line.estimate).toFixed(2) + " )"
            },
            {
                title: <Button icon={<PlusOutlined/>} onClick={() => {onCreateLine(category.id)}}/>,
                width: 50,
                render:() => ""
            }
        ]
    };



    const renderCategories = (categories, type, title) => {
        return <Card title={ <h2>{title}</h2> } 
            extra={<Button icon={<PlusOutlined/>} onClick={() => {onCreateCategory(type)}}/>}>
                    {
                    categories
                    .filter(cat => cat.type === type)
                    .sort(function (a, b){
                        return a.orderNumber > b.orderNumber;
                    })
                    .map((category) => 
                        <Fragment key={category.id}>
                            {  
                                category.lines && 
                                <Table tableLayout="fixed" 
                                    className="no-paging" 
                                    size="small" 
                                    key={category.id} 
                                    columns={buildColumns(category)} 
                                    dataSource={category.lines.sort(function (a,b){
                                        return a.orderNumber > b.orderNumber;
                                    })}/> 
                            }
                        </Fragment>
                    )                        
                    }    
                </Card>
    }

    return (
        <Fragment>
            <BudgetHeader />
            <h1 className="logo">Lignes et catégories</h1>
            {
                categories &&
                <Fragment>
                    <CreateCategory visible={createOrEditCategoryModalIsVisible} onCancel={onCreateOrEditCategoryModalCancel} initialCategory={currentCategory}/>
                    <CreateLine visible={createOrEditLineModalIsVisible} onCancel={onCreateOrEditLineModalCancel} initialLine={currentLine} categoryId={createOrEditLineAssociatedCategory} />
                    {
                        renderCategories(categories, "expense", "Dépenses")
                    } 
                    {
                        renderCategories(categories, "revenue", "Revenus")
                    } 
                </Fragment>
            }
        </Fragment>
    );
};

export default Categories;