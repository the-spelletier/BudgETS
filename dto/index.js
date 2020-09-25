const userDTO = user => {
  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };
};

const budgetDTO = budget => {
  return {
    id: budget.id,
    name: budget.name,
    startDate: budget.startDate,
    endDate: budget.endDate,
    isActive: budget.isActive
  };
};

const categoryDTO = category => {
  return {
    id: category.id,
    name: category.name,
    type: category.type
  };
};

module.exports = {
  userDTO,
  budgetDTO,
  categoryDTO
}