// Constants

// Basic user information (may be changed later)
const SEMESTER_PANEL_ID = 'ContentPlaceHolder2_Panel7';
const SEMESTER_BUTTON_ID = 'ContentPlaceHolder2_dd_zl';
const STUDENT_GROUP_LABEL_ID = 'fv_studinfo_grupaLabel';
const STUDENT_FACULTY_NUMBER_ID = 'fv_studinfo_fnLabel';
const FACULTY_NUMBER_THRESHOLD = 2109011056;

// Table colors
const WINTER = 'winter';
const DEFAULT_COLOR = 'white';
const SELECT_COLOR = 'gold';

// Table record selectors
const trSelector = 'fieldset table>tbody>tr';
const tdSelector = trSelector + '>td:nth-of-type(n+3):nth-of-type(-n+4)';

// HTML Selects (may be changed later)
const SEASON_SELECT_ID = 'ContentPlaceHolder2_dd_zl';
// Injected HTML Selects
const LAB_SELECT_ID = 'lab-btn';
const SEM_SELECT_ID = 'sem-btn';
const WEEK_SELECT_ID = 'week-btn';

// Semester Seasons
const WINTER_INDEX = 0;
const SUMMER_INDEX = 1;

// Window loading
const DOCUMENT_READY_STATE_IS_LOADING = 'loading';

// getWeekNumber()
const SUNDAY_DATE_NUMBER = 0;
const SUNDAY_NUMBER = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000; // hours, minutes, seconds, miliseconds 

// Main
updateSeason();

createAndAppendNewSelectElements();
const labSelectElement = document.getElementById(LAB_SELECT_ID);
const semSelectElement = document.getElementById(SEM_SELECT_ID);
const weekSelectElement = document.getElementById(WEEK_SELECT_ID);

filterSubjects();

// Functions

function createAndAppendNewSelectElements() {
    appendElementToDiv(createChooseLabSelect());
    appendElementToDiv(createChooseSemSelect());
    appendElementToDiv(createChooseWeekSelect());
}

function appendElementToDiv(buttonElement) {
    const divElement = document.getElementById(SEMESTER_PANEL_ID).children[0];

    let lastChildElement = divElement.children[divElement.children.length - 1];
    divElement.appendChild(buttonElement);
    divElement.appendChild(lastChildElement);
}

function updateSeason(){
    const seasonElement = document.getElementById(SEASON_SELECT_ID);
    const semesterSeasonIndex = Number(getSemesterSeason());

    if(seasonElement.selectedIndex == semesterSeasonIndex)
        return;

    seasonElement.selectedIndex = semesterSeasonIndex;
    seasonElement.dispatchEvent(new Event('change'));
}

function filterSubjects(groupNumberLab = getGroupNumberLab(), groupNumberSem = getGroupNumberSem(), weekNumber = getWeekNumber()) {
    let filteredSubjects = getFilteredSubjects(groupNumberLab, groupNumberSem, weekNumber);
    filteredSubjects = Array.from(filteredSubjects).map((td) => td.parentElement);

    clearBGColor();
    changeBGColor(filteredSubjects, SELECT_COLOR);
}

function createChooseLabSelect() {
    const newSelectElement = createDOMElement('select', { id: LAB_SELECT_ID });

    for (let i = 1; i <= 3; i++) {
        let newOptionElement = createDOMElement('option', { value: `${i} лаб`, textContent: `${i} лаб` })
        newSelectElement.appendChild(newOptionElement);
    }

    newSelectElement.addEventListener('change', (e) => {
        const selectedIndex = e.target.selectedIndex + 1
        filterSubjects(selectedIndex);

        semSelectElement.hidden = selectedIndex === 2 ? false : true;
    })

    return newSelectElement;
}

function createChooseSemSelect() {
    const newSelectElement = createDOMElement('select', { id: SEM_SELECT_ID, hidden: true });

    for (let i = 1; i <= 2; i++) {
        let newOptionElement = createDOMElement('option', { value: `${i} сем`, textContent: `${i} сем` });
        newSelectElement.appendChild(newOptionElement);
    }

    newSelectElement.addEventListener('change', (e) => {
        filterSubjects(labSelectElement.selectedIndex + 1, e.target.selectedIndex + 1);
    })

    return newSelectElement;
}

// 0 - odd, 1 - even, 2 - all
function createChooseWeekSelect() {
    const newSelectElement = createDOMElement('select', { id: 'week-btn' });

    let newOptionElement = createDOMElement('option', { value: '1,3', textContent: '1,3 седмица' });
    newSelectElement.appendChild(newOptionElement);

    newOptionElement = createDOMElement('option', { value: '2,4', textContent: '2,4 седмица' });
    newSelectElement.appendChild(newOptionElement);

    newOptionElement = createDOMElement('option', { value: 'all', textContent: 'всяка' });
    newSelectElement.appendChild(newOptionElement);

    newSelectElement.selectedIndex = getWeekNumber() % 2;

    newSelectElement.addEventListener('change', (e) => {
        filterSubjects(labSelectElement.selectedIndex + 1
            , semSelectElement.selectedIndex + 1
            , e.target.selectedIndex === 2 ? -1 : e.target.selectedIndex);
    });

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

function getFilteredSubjects(groupIndexLab, groupIndexSem, weekNumber) {
    if (!(groupIndexLab >= 1 && groupIndexLab <= 3))
        throw new Error('Wrong parameters received.\n groupIndexLab should be (>= 1 && <= 3), groupIndexSem should be (1 || 2)');

    switch (groupIndexLab) {
        case 1: groupIndexSem = 1; break;
        case 3: groupIndexSem = 2; break;
    }

    let tdElements = document.querySelectorAll(tdSelector);

    // Filter by Group
    let filteredSubjects = Array.from(tdElements)
        .filter((td) =>
            td.innerHTML === '&nbsp;'
            || td.innerText === groupIndexLab + ' лаб'
            || td.innerText === groupIndexSem + ' сем'
        );

    // Filter by Week
    if (weekNumber > -1) {
        filteredSubjects = filteredSubjects.filter((td) =>
            td.previousElementSibling.innerText === 'всяка'
            || td.previousElementSibling.innerText === (weekNumber % 2 ? '2,4' : '1,3')
        );
    }

    return filteredSubjects;
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
        [WINTER_INDEX]: {
            start: {
                day: 12,
                month: 9
            },
            end: {
                day: 13,
                month: 02
            }
        },
        [SUMMER_INDEX]: {
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
    const currentDate = new Date();
    const oneJan = new Date(currentDate.getFullYear(), 0, 1);

    let daysToEqualizeWeek = oneJan.getDay() - 1;
    if (daysToEqualizeWeek === SUNDAY_DATE_NUMBER) {
        daysToEqualizeWeek = SUNDAY_NUMBER - 1;
    }

    const absoluteDayInTheYear = Math.floor((currentDate - oneJan) / MS_PER_DAY);
    const weekNumber = Math.floor((absoluteDayInTheYear + daysToEqualizeWeek) / 7);

    return weekNumber;
}

function createDOMElement(tagName, options) {
    const newOptionElement = document.createElement(tagName);

    for (let key in options)
        newOptionElement[key] = options[key];

    return newOptionElement;
}

// function changeSchoolSubject(rowId, cellId, newData) {
//     const trElement = document.querySelector(`${trSelector}:nth-of-type(${rowId + 1})`);

//     trElement.cells[cellId].textContent = newData;
// }