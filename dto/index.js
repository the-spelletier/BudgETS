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
  if (typeof user.activeBudgetId != 'undefined') {
    u.activeBudgetId = user.activeBudgetId;
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
  if (typeof budget.userId != 'undefined') {
    b.userId = budget.userId;
  }
  if (typeof budget.revenue != 'undefined') {
    b.revenue = budget.revenue;
  }
  if (typeof budget.expense != 'undefined') {
    b.expense = budget.expense;
  }
  if (typeof budget.edit != 'undefined') {
    b.edit = budget.edit;
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
  if (typeof category.orderNumber != 'undefined') {
    c.orderNumber = category.orderNumber;
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
  if (typeof category.type != 'undefined' && typeof category.orderNumber != 'undefined' && typeof category.name != 'undefined') {
    c.displayName = (category.type === 'expense' ? 'D - ' : 'R - ') + category.orderNumber.toString().padStart(3, "0") + ' - ' + category.name;
  }
  if (typeof category.Lines != 'undefined') {
    c.lines = [];
    category.Lines.forEach(l => {
      c.lines.push(lineDTO(l));
    });
  }
  if (typeof category.Cashflows != 'undefined') {
    c.cashflows = [];
    category.Cashflows.forEach(cf => {
      c.cashflows.push(cashflowDTO(cf));
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
  if (typeof line.orderNumber != 'undefined') {
    l.orderNumber = line.orderNumber;
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
  if (typeof line.orderNumber != 'undefined' && typeof line.name != 'undefined') {
    l.displayName = line.orderNumber.toString().padStart(3, "0") + ' - ' + line.name;
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
      e.lineName = entry.Line.orderNumber.toString().padStart(3, "0") + " - " + entry.Line.name;
    }
    if (typeof entry.Line.Category != 'undefined' && typeof entry.Line.Category.name != 'undefined') {
      e.categoryName = entry.Line.Category.orderNumber.toString().padStart(3, "0") + " - " + entry.Line.Category.name;
      if (typeof entry.Line.Category.type != 'undefined') {
        e.receiptCode = (entry.Line.Category.type === 'expense' ? 'D-' : 'R-') + 
          entry.Line.Category.orderNumber.toString().padStart(3, "0") + '.' + entry.Line.orderNumber.toString().padStart(3, "0") + '-' + 
          entry.description;
        e.type = entry.Line.Category.type;
      }
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
  if (typeof member.active != 'undefined') {
    m.active = member.active;
  }
  if (typeof member.notify != 'undefined') {
    m.notify = member.notify;
  }
  if (typeof member.deleted != 'undefined') {
    m.deleted = member.deleted;
  }
  return m;
};

const entryStatusDTO = (status, s = {}) => {
  if (typeof status.id != 'undefined') {
    s.id = status.id;
  }
  if (typeof status.name != 'undefined') {
    s.name = status.name;
  }
  if (typeof status.position != 'undefined') {
    s.position = status.position;
    if (typeof status.name != 'undefined') {
      s.displayName = status.position + " - " + status.name;
    }
  }
  return s;
};

const cashflowDTO = (cashflow, c = {}) => {
  if (typeof cashflow.id != 'undefined') {
    c.id = cashflow.id;
  }
  if (typeof cashflow.year != 'undefined') {
    c.year = cashflow.year;
  }
  if (typeof cashflow.month != 'undefined') {
    c.month = cashflow.month;
  }
  if (typeof cashflow.estimate != 'undefined') {
    c.estimate = cashflow.estimate;
  }
  if (typeof cashflow.real != 'undefined') {
    c.real = cashflow.real;
  }
  return c;
}

const accessDTO = (access, a = {}) => {
  if (typeof access.budgetId != 'undefined') {
    a.budgetId = access.budgetId;
  }
  if (typeof access.userId != 'undefined') {
    a.userId = access.userId;
  }
  return a;
}

module.exports = {
  userDTO,
  budgetDTO,
  categoryDTO,
  lineDTO,
  entryDTO,
  entryStatusDTO,
  memberDTO,
  cashflowDTO,
  accessDTO,
}