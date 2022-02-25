let selectElement = document.getElementById('ctl00_ContentPlaceHolder2_dd_zl');

// 1 = summer, 0 = winter | current season is summer, so we write 1. No idea how to automate this proccess
let isLoaded = selectElement.options.selectedIndex === 1;
injector();

<<<<<<< HEAD

=======
>>>>>>> b6a09fada7c85d7965e10ee862b2f3b029b123ac
// let newBtnElement = document.createElement('button');
// const divElement = document.getElementById('ctl00_ContentPlaceHolder2_Panel7').children[0];
// divElement.append(newBtnElement);
// newBtnElement.addEventListener('click', injector());

<<<<<<< HEAD
=======
function getCurrentSeason(){

}

>>>>>>> b6a09fada7c85d7965e10ee862b2f3b029b123ac
function injector() {
    //alert("It works!");

    // TODO:
    // 1. Auto change season - DONE
    // 2.
    // Add a button to choose which 'лаб' u want to be shown.
    // Get subject selected from the button option.
    // 3.
    // Add another button to choose which 'сем' u want to be shown.

    // createButton;

    let semesterSeason = getSemesterSeason();
    setSemesterSeason(semesterSeason);

    let filteredSubjects = getFilterSubjectsByGroup();
    filteredSubjects = Array.from(filteredSubjects).map((td) => td.parentElement);
    changeBGColor(filteredSubjects, 'gold');

};

function changeBGColor(elements, color) {

    elements.forEach((el) => {
        el.style.backgroundColor = color;
        console.dir(el.style);
    });
}

function getFilterSubjectsByGroup(groupNumberLab = getGroupNumberLab()) {

    if(!(groupNumberLab >= 1 && groupNumberLab <= 3))
        throw new Error('Wrong parameters received.\n groupNumberLab should be (>= 1 && <= 3), groupNumberSem should be (1 || 2)');

    let groupNumberSem;

    switch(groupNumberLab){
        case 1: groupNumberSem = 1; break;
        case 2: getGroupNumberSem(); break;
        case 3: groupNumberSem = 2; break;
    }

    const selector = 'tr>td:nth-of-type(4)';
    let tdElements = document.querySelectorAll(selector);

    return Array.from(tdElements).filter((td) => td.innerHTML === '&nbsp;'
        || td.innerText === groupNumberLab + ' лаб'
        || td.innerText === groupNumberSem + ' сем');

}

function getFacultyNumber() {
    return Number(document.getElementById('ctl00_fv_studinfo_fnLabel').textContent);
}

function getGroupNumberLab() {
    return Number(document.getElementById('ctl00_fv_studinfo_grupaLabel').textContent);
}

function getGroupNumberSem(){
    const FACULTY_NUMBER_THRESHOLD = 2109011056;
    const facultyNumber = getFacultyNumber();

    return facultyNumber <= FACULTY_NUMBER_THRESHOLD ? 1 : 2
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
                day: 27,
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

    console.log(day, month);

    for (let semesterName in semesters) {
        semester = semesters[semesterName];
        console.log(semesterName);
        console.log(`${semester.start.month} <= ${month} <= ${semester.end.month}`);
        console.log(`${semester.start.day} <= ${day} <= ${semester.end.day}`);

        if ((semester.start.month <= month && month <= semester.end.month) && (semester.start.day <= day && day <= semester.end.day))
            return semesterName;
    }

    throw new Error('Could not get semester season.');
}

function setSemesterSeason(season) {
    
    const WINTER = 'winter';

    const selectElement = document.getElementById('ctl00_ContentPlaceHolder2_dd_zl');
    const onchangeEvent = new Event('change', { });

    selectElement.options.selectedIndex = season === WINTER ? 0 : 1;

    if(isLoaded)
        return;
    
<<<<<<< HEAD
    isLoaded = true;
    selectElement.dispatchEvent(onchangeEvent);
=======
    selectElement.dispatchEvent(onchangeEvent);
    isLoaded = true;
>>>>>>> b6a09fada7c85d7965e10ee862b2f3b029b123ac
}