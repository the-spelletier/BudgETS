const userDTO = user => {
  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };
};

const budgetDTO = budget => {
  let b = {};
  if (typeof budget.id != 'undefined') {
    b.id = budget.id;
  }
  if (typeof budget.name != 'undefined') {
    b.name = budget.name;
  }
  if (typeof budget.startDate != 'undefined') {
    b.startDate = budget.startDate;
  }
  if (typeof budget.endDate != 'undefined') {
    b.endDate = budget.endDate;
  }
  if (typeof budget.isActive != 'undefined') {
    b.isActive = budget.isActive;
  }
  return b;
};

const categoryDTO = category => {
  return {
    id: category.id,
    name: category.name,
    type: category.type
  };
};

const lineDTO = line => {
  return {
    id: line.id,
    name: line.name,
    description: line.description,
    estimate: line.expenseEstimate
  };
};

module.exports = {
  userDTO,
  budgetDTO,
  categoryDTO,
  lineDTO
}