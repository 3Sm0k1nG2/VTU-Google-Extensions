// May be changed later
const SEMESTER_PANEL_ID = 'ContentPlaceHolder2_Panel7';
const SEMESTER_BUTTON_ID = 'ContentPlaceHolder2_dd_zl';
const STUDENT_GROUP_LABEL_ID = 'fv_studinfo_grupaLabel';
const STUDENT_FACULTY_NUMBER_ID = 'fv_studinfo_fnLabel';
const FACULTY_NUMBER_THRESHOLD = 2109011056;

const WINTER = 'winter';
const DEFAULT_COLOR = 'white';
const SELECT_COLOR = 'gold';

const trSelector = 'fieldset table>tbody>tr';
const tdSelector = trSelector + '>td:nth-of-type(n+3):nth-of-type(-n+4)';

let selectElement = document.getElementById(SEMESTER_BUTTON_ID);

// 1 = summer, 0 = winter | current season is summer, so we write 1. No idea how to automate this proccess
console.warn('Automatic change of season in not implemented yet.\n'
    , 'When next semester starts, the dev must update the value of \'isLoaded\'.');
let isLoaded = selectElement.options.selectedIndex === 0;

injector();

// Functions

function injector() {
    // sets semester automatically, prone to bugs
    // let semesterSeason = getSemesterSeason();
    // setSemesterSeason(semesterSeason);

    filterSubjects();
    // changeSchoolSubject(3, 1, '14.15-16.00');

    createAndAppendNewButtons();
};

function filterSubjects(groupNumberLab = getGroupNumberLab(), groupNumberSem = getGroupNumberSem(), weekNumber = getWeekNumber()) {
    let filteredSubjects = getFilterSubjectsByGroup(groupNumberLab, groupNumberSem, weekNumber);
    filteredSubjects = Array.from(filteredSubjects).map((td) => td.parentElement);

    clearBGColor();
    changeBGColor(filteredSubjects, SELECT_COLOR);
}

function createAndAppendNewButtons() {
    appendButtonToDiv(createChooseLabSelect());
    appendButtonToDiv(createChooseSemSelect());
    appendButtonToDiv(createChooseWeekSelect());
}

function appendButtonToDiv(buttonElement) {
    console.log(buttonElement);
    const divElement = document.getElementById(SEMESTER_PANEL_ID).children[0];

    let lastChildElement = divElement.children[divElement.children.length - 1];
    divElement.appendChild(buttonElement);
    divElement.appendChild(lastChildElement);
}

function createChooseWeekSelect() {
    const newSelectElement = document.createElement('select');
    newSelectElement.id = 'week-btn';

    let newOptionElement = document.createElement('option');
    newSelectElement.appendChild(newOptionElement);
    newOptionElement.value = 'odd';
    newOptionElement.textContent = '1,3 седмица';

    newOptionElement = document.createElement('option');
    newSelectElement.appendChild(newOptionElement);
    newOptionElement.value = 'even';
    newOptionElement.textContent = '2,4 седмица';

    newSelectElement.selectedIndex = getWeekNumber() % 2;
    console.log((getWeekNumber() + 1) % 2);

    newSelectElement.addEventListener('change', (e) => {
        filterSubjects(document.getElementById('lab-btn').options.selectedIndex + 1
            , document.getElementById('sem-btn').options.selectedIndex + 1
            , e.target.options.selectedIndex);
    });

    return newSelectElement;
}

function createChooseLabSelect() {
    const newSelectElement = document.createElement('select');
    newSelectElement.id = 'lab-btn';

    for (let i = 1; i <= 3; i++) {
        let newOptionElement = document.createElement('option');
        newSelectElement.appendChild(newOptionElement);
        newOptionElement.value = `${i} лаб`;
        newOptionElement.textContent = `${i} лаб`;
    }

    newSelectElement.addEventListener('change', (e) => {
        let indexSem = e.target.options.selectedIndex + 1;

        getFilterSubjectsByGroup(indexSem);
        filterSubjects(indexSem);

        let newSelectElement = document.getElementById('sem-btn');
        newSelectElement.hidden = indexSem === 2 ? false : true;
    })

    return newSelectElement;
}

function createChooseSemSelect() {

    const newSelectElement = document.createElement('select');
    newSelectElement.id = 'sem-btn';
    newSelectElement.hidden = true;

    for (let i = 1; i <= 2; i++) {
        let newOptionElement = document.createElement('option');
        newSelectElement.appendChild(newOptionElement);
        newOptionElement.value = `${i} сем`;
        newOptionElement.textContent = `${i} сем`;
    }

    newSelectElement.addEventListener('change', (e) => {
        // console.log(document.getElementById('lab-btn'));
        // console.log(e.target.options.selectedIndex + 1);
        filterSubjects(document.getElementById('lab-btn').options.selectedIndex + 1, e.target.options.selectedIndex + 1);
    })

    return newSelectElement;
}

function clearBGColor() {
    let elements = document.querySelectorAll(tdSelector);
    elements = Array.from(elements).map((el) => el.parentElement);

    elements.forEach((el) => {
        el.style.backgroundColor = DEFAULT_COLOR;
    });
}

function changeBGColor(elements, color) {
    elements.forEach((el) => {
        el.style.backgroundColor = color;
    });
}

function getFilterSubjectsByGroup(groupNumberLab = getGroupNumberLab(), groupNumberSem = getGroupNumberSem(), weekNumber = getWeekNumber()) {
    if (!(groupNumberLab >= 1 && groupNumberLab <= 3))
        throw new Error('Wrong parameters received.\n groupNumberLab should be (>= 1 && <= 3), groupNumberSem should be (1 || 2)');

    switch (groupNumberLab) {
        case 1: groupNumberSem = 1; break;
        case 3: groupNumberSem = 2; break;
    }

    let tdElements = document.querySelectorAll(tdSelector);

    console.log(tdElements);
    console.log(weekNumber);
    console.log(weekNumber % 2 ? '2,4' : '1,3');

    // Filter by Group
    const filteredSubjects = Array.from(tdElements)
        .filter((td) =>
            td.innerHTML === '&nbsp;'
            || td.innerText === groupNumberLab + ' лаб'
            || td.innerText === groupNumberSem + ' сем'
        );

    // Filter by Week
    return filteredSubjects.filter((td) => {
        console.log('--------------------------------');
        console.dir(td);
        console.dir(td.previousElementSibling);
        console.log(td.previousElementSibling.innerText === 'всяка'
            || td.previousElementSibling.innerText === (weekNumber % 2 ? '2,4' : '1,3'))
        console.log('--------------------------------');

        return td.previousElementSibling.innerText === 'всяка'
            || td.previousElementSibling.innerText === (weekNumber % 2 ? '2,4' : '1,3')
    });
}

function getFacultyNumber() {

    return Number(document.getElementById(STUDENT_FACULTY_NUMBER_ID).textContent);
}

function getGroupNumberLab() {
    return Number(document.getElementById(STUDENT_GROUP_LABEL_ID).textContent);
}

function getGroupNumberSem(groupNumberSem) {
    const facultyNumber = getFacultyNumber();

    return groupNumberSem || (facultyNumber <= FACULTY_NUMBER_THRESHOLD ? 1 : 2);
}

function getSemesterSeason() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // January = 1 (0), December = 12 (11)


    // Winter semester 27.09 - 13.02
    // Summer semester 14.02 - 26.06
    const semesters = {
        // {day}.{month}
        winter: {
            start: {
                day: 12,
                month: 9
            },
            end: {
                day: 13,
                month: 02
            }
        },
        summer: {
            start: {
                day: 14,
                month: 2
            },
            end: {
                day: 26,
                month: 06
            }
        }
    }

    for (let semesterName in semesters) {
        semester = semesters[semesterName];

        if (month > semester.start.month && month < semester.end.month)
            return semesterName;

        if (month === semester.start.month)
            if (day >= semester.start.day)
                return semesterName;

        if (month === semester.end.month)
            if (day <= semester.end.day)
                return semesterName;
    }

    // First check semesters ranges. Today may be out of bounds.
    throw new Error(`Could not get semester season. Today is not in semester range.`);
}

function getWeekNumber() {
    // Not sure if needed, if not - remove consts
    const THURSDAY_NUMBER = 4;
    const SUNDAY_NUMBER = 0;

    // Do NOT DELETE
    let currentdate = new Date();

    // Debugging correct date, remove following code after fix
    console.log('DATE_FULL: ' + currentdate.toString())
    console.log('DATE: ' + currentdate.getDate());
    currentdate.setDate(currentdate.getDate() + 5);
    console.log('DATE: ' + currentdate.getDate());
    console.log('DATE_FULL: ' + currentdate.toString())

    // Do NOT DELETE
    let oneJan = new Date(currentdate.getFullYear(), 0, 1);
    let days = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000)); // day = hours * minutes * seconds * miliseconds
    let weekNumber = Math.ceil(days / 7);

    // Week does not respond to date number
    // Jan in 2022 starts in 6 (Saturday) => Day > 0 && Day < 4  => week is 52, instead of 1, because staring day is lower than the previous month days in that week.
    let oneJanWeekDayNumber = oneJan.getDay();
    // if(oneJanWeekDayNumber < THURSDAY_NUMBER && oneJanWeekDayNumber !== SUNDAY_NUMBER) // 4 stands for Thursday, 0 stands for Sunday
    //     weekNumber--;

    // Debugging correct date, remove following code after fix
    console.log('onejan: ' + oneJan);
    console.log('Number Of days: ' + days);
    console.log('WEEK: ' + weekNumber);

    return weekNumber;
}

// function setSemesterSeason(season) {
//     const selectElement = document.getElementById(SEMESTER_BUTTON_ID);
//     const onchangeEvent = new Event('change', {});

//     selectElement.options.selectedIndex = season === WINTER ? 0 : 1;

//     if (isLoaded)
//         return;

//     isLoaded = true;
//     selectElement.dispatchEvent(onchangeEvent);
// }

// function changeSchoolSubject(rowId, cellId, newData) {
//     const trElement = document.querySelector(`${trSelector}:nth-of-type(${rowId + 1})`);

//     trElement.cells[cellId].textContent = newData;
// }