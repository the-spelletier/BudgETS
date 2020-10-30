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
  if (typeof budget.revenue != 'undefined') {
    b.revenue = budget.revenue;
  }
  if (typeof budget.expense != 'undefined') {
    b.expense = budget.expense;
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
  if (typeof category.real != 'undefined') {
    c.real = category.real;
  }
  if (typeof category.estimate != 'undefined') {
    c.estimate = category.estimate;
  }
  if (typeof category.Lines != 'undefined') {
    c.lines = [];
    category.Lines.forEach(l => {
      c.lines.push(lineDTO(l));
    });
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
  if (typeof line.estimate != 'undefined') {
    l.estimate = line.estimate;
  }
  if (typeof line.get === 'function' && typeof line.get('real') != 'undefined') {
    l.real = line.get('real');
  }
  if (typeof line.categoryId != 'undefined') {
    l.categoryId = line.categoryId;
  }
  return l;
};

const entryDTO = (entry, e = {}) => {
  if (typeof entry.id != 'undefined') {
    e.id = entry.id;
  }
  if (typeof entry.amount != 'undefined') {
    e.amount = entry.amount;
  }
  if (typeof entry.date != 'undefined') {
    e.date = entry.date;
  }
  if (typeof entry.description != 'undefined') {
    e.description = entry.description;
  }
  if (typeof entry.type != 'undefined') {
    e.type = entry.type;
  }
  if (typeof entry.receiptCode != 'undefined') {
    e.receiptCode = entry.receiptCode;
  }
  if (typeof entry.lineId != 'undefined') {
    e.lineId = entry.lineId;
  }
  if (typeof entry.memberId != 'undefined') {
    e.memberId = entry.memberId;
  }

  if (typeof entry.Line != 'undefined') {
    if (typeof entry.Line.name != 'undefined') {
      delete e.lineId;
      e.lineName = entry.Line.name;
    }
    if (typeof entry.Line.Category != 'undefined' && typeof entry.Line.Category.name != 'undefined') {
      e.categoryName = entry.Line.Category.name;
    } else if (typeof entry.Line.categoryId != 'undefined') {
      e.categoryId = entry.Line.categoryId;
    }
  }

  if (typeof entry.EntryStatus != 'undefined' && typeof entry.EntryStatus.name != 'undefined') {
    e.entryStatusName = entry.EntryStatus.name;
  } else if (typeof entry.entryStatusId != 'undefined') {
    e.entryStatusId = entry.entryStatusId;
  }

  if (typeof entry.Member != 'undefined' && entry.Member != null && typeof entry.Member.name != 'undefined') {
    e.memberName = entry.Member.name;
  } else {
    e.memberName = "";
  }

  return e;
};

const memberDTO = (member, m = {}) => {
  if (typeof member.id != 'undefined') {
    m.id = member.id;
  }
  if (typeof member.userId != 'undefined') {
    m.userId = member.userId;
  }
  if (typeof member.name != 'undefined') {
    m.name = member.name;
  }
  if (typeof member.code != 'undefined') {
    m.code = member.code;
  }
  if (typeof member.email != 'undefined') {
    m.email = member.email;
  }
  return m;
};

module.exports = {
  userDTO,
  budgetDTO,
  categoryDTO,
  lineDTO,
  entryDTO,
  memberDTO
}