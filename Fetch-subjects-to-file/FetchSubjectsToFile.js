const URL = "https://est.uni-vt.bg/student/spr/grzan.aspx";
const SUBJECTS_BUTTON_LABEL = 'График на занятията';
const ERR_MSG =
    `Wrong url!`
    + `\nPlease click the button with label: "${SUBJECTS_BUTTON_LABEL}",`
    + `\nor check the console(F12 or CTRL+SHIFT+I) for the url`
    + `\nand then run the script again.`

if (window.location.href !== URL) {
    alert(ERR_MSG);
    console.warn(`Please navigate to: "${URL}"`);
} else {
    main();
}

function main() {
    const FILENAME = 'subjects.txt';

    const TABLE_ID = '#ContentPlaceHolder2_gv_grzan';
    const TBODY_SELECTOR = TABLE_ID + '>tbody';
    const TROW_SELECTOR = TBODY_SELECTOR + '>tr';

    const TROW_COLUMN_NAMES_ID = 1;
    const TROW_COLUMN_NAMES_SELECTOR = TROW_SELECTOR + `:nth-child(-n+${TROW_COLUMN_NAMES_ID})`;
    const TROW_SUBJECTS_SELECTOR = TROW_SELECTOR + `:nth-child(n+${TROW_COLUMN_NAMES_ID + 1})`;

    const ROW_COLUMN_NAMES_ELEMENT = document.querySelector(TROW_COLUMN_NAMES_SELECTOR);
    const ROW_SUBJECTS_ELEMENTS = document.querySelectorAll(TROW_SUBJECTS_SELECTOR);

    let data = '';

    // "Ден\tЧас\tСедмица\tГрупа\tЗала\tСграда\tЛ/У\tДисциплина\tПреподавател"
    const groupNames = ROW_COLUMN_NAMES_ELEMENT;
    console.log(data = groupNames.innerText + '\n');

    // "Вторник\t8.15-10.00\t2,4\t \t501\tКорпус 4\tЛ\tPHP базирани работни рамки\tдоц. д-р Тодор Йорданов Тодоров"
    const subjects = ROW_SUBJECTS_ELEMENTS;
    subjects.forEach(s => console.log(data += s.innerText + '\n'));

    saveAs(data, FILENAME);
}

function saveAs(data, filename) {
    let a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));
    a.download = filename;
    a.click();
}
