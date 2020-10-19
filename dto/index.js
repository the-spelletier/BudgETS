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
  if (typeof line.get('real') != 'undefined') {
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
  if (typeof entry.member != 'undefined') {
    e.member = entry.member;
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

  //Line entity or lineId
  if (typeof entry.Line != 'undefined') {
    if (typeof entry.Line.get('lineName') != 'undefined') {
      e.lineName = entry.Line.get('lineName');
      if (typeof entry.Line.Category != 'undefined') {
        e.categoryName = entry.Line.Category.get('categoryName');
      }
    } else {
      e.categoryId = entry.Line.get('categoryId');
    }
  } else if (typeof entry.lineId != 'undefined') {
    e.lineId = entry.lineId;
  }

  //EntryStatus entity or entryStatusId
  if (typeof entry.EntryStatus != 'undefined') {
    e.entryStatusName = entry.EntryStatus.get('name');
  } else if (typeof entry.entryStatusId != 'undefined') {
    e.entryStatusId = entry.entryStatusId;
  }
  return e;
};

module.exports = {
  userDTO,
  budgetDTO,
  categoryDTO,
  lineDTO,
  entryDTO
}