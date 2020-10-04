const userDTO = user => {
  let u = {};
  if (typeof user.id != 'undefined') {
    u.id = user.id;
  }
  if (typeof user.username != 'undefined') {
    u.username = user.username;
  }
  if (typeof user.isAdmin != 'undefined') {
    u.isAdmin = user.isAdmin;
  }
  return u;
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
  let c = {};
  if (typeof category.id != 'undefined') {
    c.id = category.id;
  }
  if (typeof category.name != 'undefined') {
    c.name = category.name;
  }
  if (typeof category.type != 'undefined') {
    c.type = category.type;
  }
  if (typeof category.Lines != 'undefined') {
    c.Lines = category.Lines;
  }
  return c;
};

const lineDTO = line => {
  let l = {};
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
  return l;
};

module.exports = {
  userDTO,
  budgetDTO,
  categoryDTO,
  lineDTO
}