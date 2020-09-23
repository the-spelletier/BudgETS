const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://user:pass@example.com:3306/dbname');

const ClubMember = sequelize.define('clubMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  permanentCode: DataTypes.STRING,
  isActive: DataTypes.BOOLEAN
});

const Club = sequelize.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  clubName: DataTypes.STRING,
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  isAdmin: DataTypes.BOOLEAN
});

const ReadAccess = sequelize.define('readAccess', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  }
});

const Budget = sequelize.define('budget', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: DataTypes.STRING,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE
});

const BudgetCategory = sequelize.define('category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: DataTypes.STRING,
  isRevenue: DataTypes.BOOLEAN
});

const BudgetLine = sequelize.define('budgetLine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  expenseEstimate: DataTypes.DECIMAL(10,2),
});

const Entry = sequelize.define('entry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  amount: DataTypes.DECIMAL(10,2),
  date: DataTypes.DATE,
  memberName: DataTypes.STRING,
  description: DataTypes.STRING,
  // status: DataTypes.ENUM('À traiter', 'Envoyé', 'Traité'),
  isRevenue: DataTypes.BOOLEAN
});

const Status = sequelize.define('status', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: DataTypes.STRING,
  position: DataTypes.INTEGER,
});

const Receipt = sequelize.define('receipt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING
});

//Club
Club.hasMany(ClubMember);
Club.hasMany(Budget);
Club.hasMany(ReadAccess);

//ReadAccess
ReadAccess.belongsTo(Club);
ReadAccess.belongsTo(Budget);

//ClubMember
ClubMember.belongsTo(Club);
ClubMember.belongsToMany(Entry);

//Budget
Budget.belongsTo(Club);
Budget.hasMany(BudgetCategory);
Budget.hasMany(ReadAccess);

//BudgetCategory
BudgetCategory.belongsTo(Budget);
BudgetCategory.hasMany(BudgetLine);

//BudgetLine
BudgetLine.belongsTo(BudgetCategory);
BudgetLine.hasMany(Entry);

//Entry
Entry.belongsTo(BudgetLine);
Entry.hasOne(ClubMember);
Entry.hasOne(Receipt);
Entry.hasOne(Status);

//Receipt
Receipt.belongsTo(Entry);

//Status
Status.belongsToMany(Entry);