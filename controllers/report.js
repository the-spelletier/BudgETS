const ExcelJS = require('exceljs');
const { entryDTO } = require('../dto');
const budgetService = require('../services/budget');
const categoryService = require('../services/category');
const entryService = require('../services/entry');
const { getBudgetSummaries } = require('../controllers/budget');

const headersFont = {
    name: 'Tahoma',
    size: 20,
    bold: true
};
const defaultFont = {
    name: 'Tahoma',
    size: 16
};
const catHeaderFont = {
    name: 'Tahoma',
    size: 16,
    bold: true
};
const catSubHeaderFont = {
    name: 'Tahoma',
    size: 12,
    bold: true
};
const catDefaultFont = {
    name: 'Tahoma',
    size: 12
};
const centerAlign = { vertical: 'middle', horizontal: 'center' };
const rightAlign = { vertical: 'middle', horizontal: 'right' };
const leftAlign = { vertical: 'middle', horizontal: 'left' };
const colorFill = {
    type: 'pattern',
    pattern:'solid',
    fgColor:{argb:'FFF5A37A'}
};
const grayFill = {
    type: 'pattern',
    pattern:'solid',
    fgColor:{argb:'FF808080'}
}

function generateReport(req, res) {
    if (req.params.budgetId) {
        budgetService.getLastBudgetsFromDate(req.params.budgetId, 3).then(budgets => {
            if (!budgets) { return res.status(404).send({ message: "Budget Not Found" }); }

            const workbook = initWorkbook(res);
            Promise.all([
                getBudgetSummaries(budgets),
                entryService.getEntries(budgets.currentBudget.id)
            ]).then((responses) => {
                initWorkbook(res);
                return Promise.all([
                    generateSummarySheet(budgets, workbook),
                    generateCategorySheets(budgets.currentBudget, responses[0], workbook),
                    generateEntrySheet(budgets.currentBudget, responses[1], workbook)
                ]);
            }).then(() => {
                workbook.xlsx.write(res).then(() => {
                    res.end();
                }).catch(err => {
                     res.status(404).send({ message: 'Error writing report' });
                });
            }).catch(err => {
                console.log(err);
                res.status(404).send({ message: 'Budget Not Found' });
            });
        }).catch(err => {
            res.status(500).send({ message: 'An unexpected error occurred' });
        });
    } else {
        res.status(400).send({ message: 'Invalid parameters' });
    }
}

function initWorkbook(res) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'BudgETS';
    workbook.lastModifiedBy = 'BudgETS';
    workbook.created = new Date();
    workbook.modified = new Date();
    res.attachment("BudgETS_Rapport.xlsx");

    return workbook;
}

function generateSummarySheet(budgets, workbook) {
    let sheet = workbook.addWorksheet('Sommaire');
    sheet.properties.defaultColWidth = 29;

    // First column
    sheet.mergeCells('A1:A2');
    sheet.getCell('A1').value = 'Résultat';
    sheet.getCell('A1').alignment = centerAlign;
    sheet.getCell('A1').fill = colorFill;
    sheet.getCell('A1').font = headersFont;
    sheet.getCell('A4').fill = colorFill;
    sheet.getCell('A5').fill = colorFill;
    sheet.getCell('A6').value = 'Total des revenus';
    sheet.getCell('A6').font = defaultFont;
    sheet.getCell('A6').alignment = rightAlign
    sheet.getCell('A7').value = 'Total des dépenses';
    sheet.getCell('A7').font = defaultFont;
    sheet.getCell('A7').alignment = rightAlign
    sheet.getCell('A9').value = 'Total($)';
    sheet.getCell('A9').font = defaultFont;
    sheet.getCell('A9').alignment = rightAlign
    sheet.getCell('A9').fill = colorFill;
    sheet.getCell('A11').value = 'Dépassement(%)';
    sheet.getCell('A11').font = defaultFont;
    sheet.getCell('A11').alignment = rightAlign
    sheet.getCell('A11').fill = colorFill;

    // Middle columns
    sheet.mergeCells('B1:E2');
    sheet.getCell('B1').value = budgets.currentBudget.name;
    sheet.getCell('B1').alignment = centerAlign;
    sheet.getCell('B1').fill = colorFill;
    sheet.getCell('B1').font = headersFont;

    //Last column
    sheet.mergeCells('F1:F2');
    sheet.getCell('F1').value = new Date();
    sheet.getCell('F1').alignment = centerAlign;
    sheet.getCell('F1').fill = colorFill;
    sheet.getCell('F1').font = headersFont;

    // Data
    fillBudgetSummary(sheet, 'B', budgets.currentBudget.name, budgets.currentBudget.revenue.real, budgets.currentBudget.expense.real, 'R-');
    fillBudgetSummary(sheet, 'C', budgets.currentBudget.name, budgets.currentBudget.revenue.estimate, budgets.currentBudget.expense.estimate, 'P-', 'Prévision');
    let cols = ['D', 'E', 'F'];
    budgets.previousBudgets.forEach((b, i, arr) => {
        fillBudgetSummary(sheet, cols[i], b.name, b.revenue.real, b.expense.real);
    });

    return Promise.resolve();
}

function fillBudgetSummary(sheet, column, name, revenue, expense, prefix = '', type = 'Réel') {
    sheet.getCell(column + '4').value = type;
    sheet.getCell(column + '4').alignment = centerAlign;
    sheet.getCell(column + '4').fill = colorFill;
    sheet.getCell(column + '5').value = prefix + name;
    sheet.getCell(column + '5').alignment = centerAlign;
    sheet.getCell(column + '5').fill = colorFill;
    sheet.getCell(column + '6').value = Number(revenue);
    sheet.getCell(column + '6').numFmt = '#,##0.00 $';
    sheet.getCell(column + '6').alignment = rightAlign;
    sheet.getCell(column + '7').value = Number(expense);
    sheet.getCell(column + '7').numFmt = '#,##0.00 $';
    sheet.getCell(column + '7').alignment = rightAlign;
    sheet.getCell(column + '9').value = Number(revenue-expense);
    sheet.getCell(column + '9').numFmt = '#,##0.00 $';
    sheet.getCell(column + '9').alignment = rightAlign;
    sheet.getCell(column + '9').fill = colorFill;
    if (revenue > 0) {
        sheet.getCell(column + '11').value = -(revenue-expense)/revenue;
        sheet.getCell(column + '11').numFmt = '0.00%';
    } else {
        sheet.getCell(column + '11').value = 'N/A';
    }
    sheet.getCell(column + '11').fill = colorFill;
    sheet.getCell(column + '11').alignment = rightAlign;
}

function generateCategorySheets(budget, categories, workbook) {
    [{
        name: 'Dépense',
        catType: 'expense'
    }, 
    {
        name: 'Revenu',
        catType: 'revenue'
    }].forEach(sheetInfo => {
        let sheet = workbook.addWorksheet(sheetInfo.name);

        // Column widths
        sheet.getColumn('A').width = 5;
        sheet.getColumn('B').width = 5;
        sheet.getColumn('C').width = 5;
        sheet.getColumn('D').width = 10;
        sheet.getColumn('E').width = 50;
        sheet.getColumn('F').width = 50;
        sheet.getColumn('G').width = 20;
        sheet.getColumn('H').width = 20;
        sheet.getColumn('I').width = 20;

        // First Row
        sheet.mergeCells('A1:B1');
        sheet.getCell('A1').value = sheetInfo.name.charAt(0);
        sheet.getCell('A1').alignment = centerAlign;
        sheet.getCell('A1').fill = colorFill;
        sheet.getCell('A1').font = catHeaderFont;

        sheet.mergeCells('C1:E1');
        sheet.getCell('C1').value = sheetInfo.name;
        sheet.getCell('C1').alignment = leftAlign;
        sheet.getCell('C1').fill = colorFill;
        sheet.getCell('C1').font = catHeaderFont;

        sheet.getCell('F1').value = budget.name;
        sheet.getCell('F1').alignment = leftAlign;
        sheet.getCell('F1').fill = colorFill;
        sheet.getCell('F1').font = catHeaderFont;

        sheet.mergeCells('G1:I1');
        sheet.getCell('G1').fill = colorFill;

        // Second Row
        sheet.getCell('A2').value = '0';
        sheet.getCell('A2').alignment = centerAlign;
        sheet.getCell('A2').fill = colorFill;
        sheet.getCell('A2').font = catSubHeaderFont;

        sheet.mergeCells('B2:F2');
        sheet.getCell('B2').fill = colorFill;

        sheet.getCell('G2').value = 'Prévision';
        sheet.getCell('G2').alignment = centerAlign;
        sheet.getCell('G2').fill = colorFill;
        sheet.getCell('G2').font = catSubHeaderFont;

        sheet.getCell('H2').value = 'Réel';
        sheet.getCell('H2').alignment = centerAlign;
        sheet.getCell('H2').fill = colorFill;
        sheet.getCell('H2').font = catSubHeaderFont;

        sheet.getCell('I2').value = 'Reste';
        sheet.getCell('I2').alignment = centerAlign;
        sheet.getCell('I2').fill = colorFill;
        sheet.getCell('I2').font = catSubHeaderFont;

        // Third Row
        sheet.getCell('G3').value = Number(budget[sheetInfo.catType].estimate);
        sheet.getCell('G3').numFmt = '#,##0.00 $';
        sheet.getCell('G3').alignment = centerAlign;
        sheet.getCell('G3').font = defaultFont; 

        sheet.getCell('H3').value = Number(budget[sheetInfo.catType].real);
        sheet.getCell('H3').numFmt = '#,##0.00 $';
        sheet.getCell('H3').alignment = centerAlign;
        sheet.getCell('H3').font = defaultFont;

        sheet.getCell('I3').value = Number(budget[sheetInfo.catType].estimate - budget[sheetInfo.catType].real);
        sheet.getCell('I3').numFmt = '#,##0.00 $';
        sheet.getCell('I3').alignment = centerAlign;
        sheet.getCell('I3').font = defaultFont;

        //Categories
        let catRow = 5;
        categories.forEach((c, i, arr) => {
            if (sheetInfo.name === 'Dépense' && c.type == 'revenue' || sheetInfo.name === 'Revenu' && c.type == 'expense') { return; }
            sheet.getCell('A' + catRow).value = c.orderNumber.toString().padStart(2, "0");
            sheet.getCell('A' + catRow).alignment = centerAlign;
            sheet.getCell('A' + catRow).fill = colorFill;
            sheet.getCell('A' + catRow).font = catSubHeaderFont;

            sheet.mergeCells('B'+catRow+':E'+catRow);
            sheet.getCell('B' + catRow).value = c.name,
            sheet.getCell('B' + catRow).alignment = leftAlign;
            sheet.getCell('B' + catRow).fill = colorFill;
            sheet.getCell('B' + catRow).font = catSubHeaderFont;

            sheet.getCell('F' + catRow).value = 'Explication',
            sheet.getCell('F' + catRow).alignment = centerAlign;
            sheet.getCell('F' + catRow).fill = colorFill;
            sheet.getCell('F' + catRow).font = catSubHeaderFont;

            sheet.getCell('G' + catRow).value = 'Prévision';
            sheet.getCell('G' + catRow).alignment = centerAlign;
            sheet.getCell('G' + catRow).fill = colorFill;
            sheet.getCell('G' + catRow).font = catSubHeaderFont;

            sheet.getCell('H' + catRow).value = 'Réel';
            sheet.getCell('H' + catRow).alignment = centerAlign;
            sheet.getCell('H' + catRow).fill = colorFill;
            sheet.getCell('H' + catRow).font = catSubHeaderFont;

            sheet.getCell('I' + catRow).value = 'Reste';
            sheet.getCell('I' + catRow).alignment = centerAlign;
            sheet.getCell('I' + catRow).fill = colorFill;
            sheet.getCell('I' + catRow).font = catSubHeaderFont;

            c.real = 0;
            c.estimate = 0;

            // Lines
            c.Lines.forEach((l, ii, arrr) => {
                catRow++
                let real = Number(l.get('estimate'));
                let estimate = Number(l.get('estimate'));
                c.real += real;
                c.estimate += estimate;

                fillCatLine(sheet, catRow, l, real, estimate)
            });

            //Total line
            catRow++;
            let totalLine = {
                orderNumber: 999,
                name: 'Total',
                description: '',
                estimate: c.real,
                real: c.estimate
            };
            fillCatLine(sheet, catRow, totalLine, totalLine.real, totalLine.estimate);
            ['B', 'C', 'F', 'G', 'H', 'I'].forEach(col => {
                sheet.getCell(col + catRow).fill = grayFill;
            });

            //Blank line
            catRow+=2;
        });
    });

    return Promise.resolve();
}

function fillCatLine(sheet, rowNum, line, real, estimate) {
    let reste = estimate - real;

    sheet.getCell('B' + rowNum).value = line.orderNumber.toString().padStart(3, "0");
    sheet.getCell('B' + rowNum).alignment = rightAlign;
    sheet.getCell('B' + rowNum).font = catDefaultFont;

    sheet.mergeCells('C'+rowNum+':E'+rowNum);
    sheet.getCell('C' + rowNum).value = line.name,
    sheet.getCell('C' + rowNum).alignment = leftAlign;
    sheet.getCell('C' + rowNum).font = catDefaultFont;

    sheet.getCell('F' + rowNum).value = line.description,
    sheet.getCell('F' + rowNum).alignment = leftAlign;
    sheet.getCell('F' + rowNum).font = catDefaultFont;

    sheet.getCell('G' + rowNum).value = estimate;
    sheet.getCell('G' + rowNum).numFmt = '#,##0.00 $';
    sheet.getCell('G' + rowNum).alignment = rightAlign;
    sheet.getCell('G' + rowNum).font = catDefaultFont;

    sheet.getCell('H' + rowNum).value = real;
    sheet.getCell('H' + rowNum).numFmt = '#,##0.00 $';
    sheet.getCell('H' + rowNum).alignment = rightAlign;
    sheet.getCell('H' + rowNum).font = catDefaultFont;

    sheet.getCell('I' + rowNum).value = estimate - real;
    sheet.getCell('I' + rowNum).numFmt = '#,##0.00 $';
    sheet.getCell('I' + rowNum).alignment = rightAlign;
    sheet.getCell('I' + rowNum).font = catDefaultFont;
}

function generateEntrySheet(budget, entries, workbook) {
    console.log(budget);
    console.log(entries);
    let entrySheet = workbook.addWorksheet('Entrées Budgétaires');

    // Column widths
    entrySheet.getColumn('A').width = 40;
    entrySheet.getColumn('B').width = 35;
    entrySheet.getColumn('C').width = 35;
    entrySheet.getColumn('D').width = 50;
    entrySheet.getColumn('E').width = 30;
    entrySheet.getColumn('F').width = 15;
    entrySheet.getColumn('G').width = 15;
    entrySheet.getColumn('H').width = 20;

    // First Row
    entrySheet.mergeCells('A1:B2');
    entrySheet.getCell('A1').value = 'Entrées Budgétaires';
    entrySheet.getCell('A1').alignment = centerAlign;
    entrySheet.getCell('A1').fill = colorFill;
    entrySheet.getCell('A1').font = headersFont;

    entrySheet.mergeCells('C1:F2');
    entrySheet.getCell('C1').value = budget.name;
    entrySheet.getCell('C1').alignment = centerAlign;
    entrySheet.getCell('C1').fill = colorFill;
    entrySheet.getCell('C1').font = headersFont;

    entrySheet.mergeCells('G1:H2');
    entrySheet.getCell('G1').value = new Date();
    entrySheet.getCell('G1').alignment = centerAlign;
    entrySheet.getCell('G1').fill = colorFill;
    entrySheet.getCell('G1').font = headersFont;

    // Second Row
    entrySheet.getCell('A4').value = '# Facture';
    entrySheet.getCell('A4').alignment = centerAlign;
    entrySheet.getCell('A4').fill = colorFill;
    entrySheet.getCell('A4').font = catSubHeaderFont;

    entrySheet.getCell('B4').value = 'Catégorie';
    entrySheet.getCell('B4').alignment = centerAlign;
    entrySheet.getCell('B4').fill = colorFill;
    entrySheet.getCell('B4').font = catSubHeaderFont;

    entrySheet.getCell('C4').value = 'Ligne';
    entrySheet.getCell('C4').alignment = centerAlign;
    entrySheet.getCell('C4').fill = colorFill;
    entrySheet.getCell('C4').font = catSubHeaderFont;

    entrySheet.getCell('D4').value = 'Description';
    entrySheet.getCell('D4').alignment = centerAlign;
    entrySheet.getCell('D4').fill = colorFill;
    entrySheet.getCell('D4').font = catSubHeaderFont;

    entrySheet.getCell('E4').value = 'Membre';
    entrySheet.getCell('E4').alignment = centerAlign;
    entrySheet.getCell('E4').fill = colorFill;
    entrySheet.getCell('E4').font = catSubHeaderFont;

    entrySheet.getCell('F4').value = 'Montant';
    entrySheet.getCell('F4').alignment = centerAlign;
    entrySheet.getCell('F4').fill = colorFill;
    entrySheet.getCell('F4').font = catSubHeaderFont;

    entrySheet.getCell('G4').value = 'Date';
    entrySheet.getCell('G4').alignment = centerAlign;
    entrySheet.getCell('G4').fill = colorFill;
    entrySheet.getCell('G4').font = catSubHeaderFont;

    entrySheet.getCell('H4').value = 'Statut';
    entrySheet.getCell('H4').alignment = centerAlign;
    entrySheet.getCell('H4').fill = colorFill;
    entrySheet.getCell('H4').font = catSubHeaderFont;

    //Categories
    let currentEntry;
    let catRow = 5;
    entries.forEach((e, i, arr) => {
        currentEntry = entryDTO(e);
        entrySheet.getCell('A' + catRow).value = currentEntry.receiptCode;
        entrySheet.getCell('A' + catRow).alignment = leftAlign;
        entrySheet.getCell('A' + catRow).font = catDefaultFont;

        entrySheet.getCell('B' + catRow).value = currentEntry.categoryName;
        entrySheet.getCell('B' + catRow).alignment = leftAlign;
        entrySheet.getCell('B' + catRow).font = catDefaultFont;
        
        entrySheet.getCell('C' + catRow).value = currentEntry.lineName;
        entrySheet.getCell('C' + catRow).alignment = leftAlign;
        entrySheet.getCell('C' + catRow).font = catDefaultFont;

        entrySheet.getCell('D' + catRow).value = currentEntry.description;
        entrySheet.getCell('D' + catRow).alignment = leftAlign;
        entrySheet.getCell('D' + catRow).font = catDefaultFont;

        entrySheet.getCell('E' + catRow).value = currentEntry.memberName;
        entrySheet.getCell('E' + catRow).alignment = leftAlign;
        entrySheet.getCell('E' + catRow).font = catDefaultFont;

        entrySheet.getCell('F' + catRow).value = Number(currentEntry.amount);
        entrySheet.getCell('F' + catRow).numFmt = '#,##0.00 $';
        entrySheet.getCell('F' + catRow).alignment = leftAlign;
        entrySheet.getCell('F' + catRow).font = catDefaultFont;

        entrySheet.getCell('G' + catRow).value = currentEntry.date;
        entrySheet.getCell('G' + catRow).alignment = leftAlign;
        entrySheet.getCell('G' + catRow).font = catDefaultFont;

        entrySheet.getCell('H' + catRow).value = currentEntry.entryStatusName;
        entrySheet.getCell('H' + catRow).alignment = leftAlign;
        entrySheet.getCell('H' + catRow).font = catDefaultFont;
        catRow++;
    });

    return Promise.resolve();
}

module.exports = {
    generateReport
};