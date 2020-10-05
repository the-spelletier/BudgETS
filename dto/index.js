const userDTO = (user, u = {}) => {
  if (typeof user.id != 'undefined') {
    u.id = user.id;
  }
  if (typeof user.username != 'undefined') {
    u.username = user.username;
  }
  if (typeof user.isAdmin != 'undefined') {
    u.isAdmin = user.isAdmin === true;
  }
  return u;
};

const budgetDTO = (budget, b = {}) => {
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
  if (typeof budget.userId != 'undefined') {
    b.userId = budget.userId;
  }
  return b;
};

const categoryDTO = (category, c = {}) => {
  if (typeof category.id != 'undefined') {
    c.id = category.id;
  }
  if (typeof category.name != 'undefined') {
    c.name = category.name;
  }
  if (typeof category.type != 'undefined') {
    c.type = category.type;
  }
  if (typeof category.budgetId != 'undefined') {
    c.budgetId = category.budgetId;
  }
  if (typeof category.Lines != 'undefined') {
    c.Lines = category.Lines;
  }
  return c;
};

const lineDTO = (line, l = {}) => {
  if (typeof line.id != 'undefined') {
    l.id = line.id;
  }
  if (typeof line.name != 'undefined') {
    l.name = line.name;
  }
  if (typeof line.description != 'undefined') {
    l.description = line.description;
  }
  if (typeof line.expenseEstimate != 'undefined') {
    l.expenseEstimate = line.expenseEstimate;
  }
  if (typeof line.categoryId != 'undefined') {
    l.categoryId = line.categoryId;
  }
  return l;
};

module.exports = {
  userDTO,
  budgetDTO,
  categoryDTO,
  lineDTO
}