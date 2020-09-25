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

const categoryDTO = user => {
  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };
};

module.exports = {
  userDTO,
  budgetDTO
}