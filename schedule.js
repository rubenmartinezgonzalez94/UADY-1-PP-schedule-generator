//--------------------------------------------------------------------------------------(Paradigma Orientado a Objetos)
// Clase Asignatura (Orientado a Objetos)
class Person {
    constructor(name, sex, age) {
        this.name = name;
        this.sex = sex;
        this.age = age;
    }
}

class Professor extends Person {
    constructor(name, sex, age, category) {
        super(name, sex, age);
        this.category = category;
    }
}

class Student extends Person {
    constructor(name, sex, age, average) {
        super(name, sex, age);
        this.average = average;
    }
}

class Subject {
    constructor(name, professor, duration, frequency) {
        this.name = name;
        this.professor = professor;
        this.duration = duration;
        this.frequency = frequency;
        this.students = [];
        this.restrictionType = 'None'
        this.restrictions = null
    }

    addStudent(student) {
        this.students.push(student);
    }

    addRestrictions(restriction) {
        return this.restrictions;
    }
}

class SubjectWithDayRestriction extends Subject {
    constructor(name, professor, duration, frequency) {
        super(name, professor, duration, frequency);
        this.restrictionType = 'Day'
        this.restrictions = []
    }

    addRestrictions(restriction) {
        this.restrictions.push(restriction);
        return this.restrictions;
    }
}

// Clase Generador de Horario
class ScheduleGenerator {
    constructor() {
        this.schedule = [];
    }

    // Método para agregar una asignatura al horario (Orientado a Objetos)
    addSubject(subject) {
        this.schedule.push(subject);
        displaySubject(subject);
    }

    // Método para generar el horario óptimo (Orientado a Objetos)
    generateSchedule() {
        const timetable = [];
        const classPerDay = [];
        const sortedSubjects = this.schedule.sort((a, b) => b.duration - a.duration);

        sortedSubjects.forEach(subject => {
            const scheduleDay = this.findAvailableSlot(timetable, classPerDay, subject);
        });

        displayOptimalSchedule(timetable);
    }

    // Método para encontrar un espacio disponible en el horario para una asignatura (Orientado a Objetos)
    findAvailableSlot(timetable, classPerDay, subject) {
        let scheduleDay = []
        let frequency = 0
        let maximumDailyClasses = 2;
        console.log(classPerDay);
        for (let day = 0; day < 5; day++) { // Supongamos una semana de lunes a viernes
            if (frequency === subject.frequency) break;
            if (subject.restrictions && subject.restrictions.includes(day)) continue; //Verifica si el dia se encuentra restringido
            if (classPerDay[day] && classPerDay[day] >= maximumDailyClasses) continue; // Verifica cuantas clases hay en el dia
            for (let hour = 8; hour < 17 - subject.duration + 1; hour++) { // Modificamos el límite a 5 PM
                if (!this.isSlotOccupied(timetable, day, hour, subject.duration)) {
                    frequency++;
                    scheduleDay.push([day, hour])
                    break;
                }
            }
        }

        if (frequency === subject.frequency) {
            for (let i = 0; i < scheduleDay.length; i++) {
                this.scheduleClass(timetable, classPerDay, subject, scheduleDay[i][0], scheduleDay[i][1]);
            }

            return scheduleDay;
        } else {
            return -1;
        }
    }

// Método para verificar si un espacio en el horario está ocupado
    isSlotOccupied(timetable, day, hour, duration) {
        for (let i = 0; i < duration; i++) {
            if (timetable[day] && timetable[day][hour + i] && (hour + i >= 8 && hour + i < 17)) {
                return true;
            }
        }
        return false;
    }


    // Método para programar una asignatura en el horario
    scheduleClass(timetable, classPerDay, subject, day, hour) {
        if (!timetable[day]) {
            timetable[day] = [];
        }

        if (!classPerDay[day]) {
            classPerDay[day] = 0;
        }

        classPerDay[day] = classPerDay[day] + 1;

        for (let j = 0; j < subject.duration; j++) {
            timetable[day][hour + j] = subject;
        }
    }
}

//--------------------------------------------------------------------------------------------(Paradigma Funcional)
// Función para agregar una asignatura al horario (Paradigma Funcional)
function addSubject() {
    const subjectInput = document.getElementById('subject');
    const professorInput = document.getElementById('professor');
    const durationInput = document.getElementById('duration');
    const frequencyInput = document.getElementById('frequency');
    const dayRestritionInput = document.querySelectorAll('.dayRestriction:checked');
    const professorSelect = document.getElementById('professorSelect');
    const studentsSelect = document.querySelectorAll('.studentCheckbox:checked');

    const name = subjectInput.value;
    const duration = parseInt(durationInput.value);
    const frequency = parseInt(frequencyInput.value);
    const selectedProfessor = professorSelect.value; // Obtiene el valor del profesor seleccionado
    
    if (name === '') {
        alert('Nombre requerido');
        return;
    }
    if (isNaN(duration)) {
        alert('Duración requerida');
        return;
    }
    if (isNaN(frequency)) {
        alert('Frecuencia requerida');
        return;
    }
    if (selectedProfessor === '') {
        alert('Profesor requerido');
        return;
    }

    if(studentsSelect.length == 0){
        alert('Estudiantes requeridos');
        return;
    }

    let newSubject;
    if (dayRestritionInput.length > 0) {
        newSubject = new SubjectWithDayRestriction(name, selectedProfessor, duration, frequency);
        for (let i = 0; i < dayRestritionInput.length; i++) {
            newSubject.addRestrictions(parseInt(dayRestritionInput[i].value));
        }
    } else {
        newSubject = new Subject(name, selectedProfessor, duration, frequency);
    }

    studentsSelect.forEach(student => {
        id = student.parentNode.id.split('-')[1];
        newSubject.addStudent(studentsList[id]); // Agrega cada estudiante seleccionado a la asignatura
    });

    scheduleGenerator.addSubject(newSubject);
}

// Función para mostrar la asignatura en el horario (Paradigma Funcional)
function displaySubject(subject) {
    const scheduleList = document.getElementById('scheduleList');
    const listItem = document.createElement('li');
    listItem.textContent = `${subject.name} - Profesor: ${subject.professor} - Duración: ${subject.duration} horas - Frecuencia: ${subject.frequency} veces por semana`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'btn btn-link ml-2';
    deleteButton.setAttribute('data-toggle', 'tooltip');
    deleteButton.setAttribute('data-placement', 'top');
    deleteButton.setAttribute('title', 'Eliminar');

    deleteButton.onclick = function () {
        // Lógica para eliminar la asignatura
        const index = scheduleGenerator.schedule.indexOf(subject);
        if (index !== -1) {
            scheduleGenerator.schedule.splice(index, 1);
            listItem.remove();
        }
    };

    listItem.appendChild(deleteButton);
    scheduleList.appendChild(listItem);
}

// Función para generar el horario óptimo (Paradigma Funcional)
function generateOptimalSchedule() {
    scheduleGenerator.generateSchedule();
}

// Función para mostrar el horario óptimo en la interfaz (Paradigma Funcional)
function displayOptimalSchedule(timetable) {
    const scheduleList = document.getElementById('scheduleList');
    const timetableChart = document.getElementById('timetableChart');
    timetableChart.innerHTML = ""; // Limpiamos el contenido anterior

    // Crea una tabla para representar el horario como un diagrama de Gantt
    const table = document.createElement('table');
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']; // Puedes extender para más días

    // Crea la primera fila con los días de la semana
    let headerRow = '<tr><th></th>';
    daysOfWeek.forEach(day => {
        headerRow += `<th>${day}</th>`;
    });
    headerRow += '</tr>';
    table.innerHTML += headerRow;

    // Crea las filas para cada hora y asignatura en el horario
    let row, col;
    for (let hour = 8; hour <= 17; hour++) {
        row = document.createElement('tr');
        col = document.createElement('td');
        col.innerHTML = `${hour}:00`;
        row.appendChild(col);
        for (let day = 0; day < 5; day++) {
            if (timetable[day] && timetable[day][hour]) {
                const subject = timetable[day][hour];
                col = document.createElement('td');
                col.innerHTML = subject.name;

                col.onclick = function(){
                    $('#modalStudent').modal('toggle');
                    $('#modalStudentTitle').html(`Estudiantes de ${subject.name}`);
                    $('#modalStudent .modal-body table tbody').html('');
                    subject.students.forEach(student => {
                        html = $('#modalStudent .modal-body table tbody').html();
                        html += `<tr>
                                    <td>${student.name}</td>
                                    <td>${student.sex}</td>
                                    <td>${student.age}</td>
                                    <td>${student.average}</td>
                                 </tr>`;
                        $('#modalStudent .modal-body table tbody').html(html)
                    });
                }

                row.appendChild(col);
            } else {
                col = document.createElement('td');
                row.appendChild(col);
            }
        }
        table.appendChild(row);
    }

    // Agrega la tabla al contenedor del diagrama de Gantt
    timetableChart.appendChild(table);
}

function toggleFields() {
    const personType = document.getElementById('personType').value;
    const professorFields = document.getElementById('professorFields');
    const studentFields = document.getElementById('studentFields');

    if (personType === 'professor') {
        professorFields.style.display = 'block';
        studentFields.style.display = 'none';
    } else if (personType === 'student') {
        professorFields.style.display = 'none';
        studentFields.style.display = 'block';
    }
}

function addPerson() {
    const personNameInput = document.getElementById('personName');
    const personSexInput = document.getElementById('personSex');
    const personAgeInput = document.getElementById('personAge');
    const personType = document.getElementById('personType').value;

    const name = personNameInput.value;
    const sex = personSexInput.value;
    const age = parseInt(personAgeInput.value);
    if (name === '') {
        alert('Nombre requerido');
        return;
    }
    if (sex === '') {
        alert('Sexo requerido');
        return;
    }
    if (isNaN(age)) {
        alert('Edad requerida');
        return;
    }
    let newPerson;
    if (personType === 'professor') {
        const categoryInput = document.getElementById('category');
        const category = categoryInput.value;
        if (category === '') {
            alert('Categoría requerida');
            return;
        }
        newPerson = new Professor(name, sex, age, category);
        displayPerson(newPerson, 'professorsList');
        addProfessorToSelect(newPerson); // Agregar el nuevo profesor a la lista de opciones
        profesorIdentificator += 1;
    } else if (personType === 'student') {
        const averageInput = document.getElementById('average');
        const average = parseFloat(averageInput.value);
        if (isNaN(average)) {
            alert('Promedio requerido');
            return;
        }
        newPerson = new Student(name, sex, age, average);
        displayPerson(newPerson, 'studentsList');
        addStudentToSelect(newPerson); // Agregar el nuevo estudiante a la lista de opciones
        studentIdentificator += 1;
    }
}

function displayPerson(person, listId) {
    const peopleList = document.getElementById(listId);
    const listItem = document.createElement('li');
    let additionalInfo = '';

    
    listItem.textContent = `Nombre: ${person.name} - Edad: ${person.age} - Sexo: ${person.sex}`;

    if (person instanceof Professor) {
        listItem.id = 'display-professor-' + profesorIdentificator;
        additionalInfo += ` - Profesor - Categoría: ${person.category}`;
    } else if (person instanceof Student) {
        listItem.id = 'display-student-' + studentIdentificator;
        additionalInfo += ` - Estudiante - Promedio: ${person.average}`;
    }

    listItem.textContent += additionalInfo;

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'btn btn-link ml-2';
    deleteButton.setAttribute('data-toggle', 'tooltip');
    deleteButton.setAttribute('data-placement', 'top');
    deleteButton.setAttribute('title', 'Eliminar');

    deleteButton.onclick = function () {
        // Lógica para eliminar la persona
        const list = this.parentNode.parentNode;
        const idSlices = this.parentNode.id.split('-');

        personId = idSlices[1] + '-' + idSlices[2];
        document.getElementById(personId).remove()

        list.removeChild(this.parentNode);  
    };

    listItem.appendChild(deleteButton);
    peopleList.appendChild(listItem);
}

// Función para agregar un profesor a la lista de opciones
function addProfessorToSelect(professor) {
    const professorSelect = document.getElementById('professorSelect');
    const option = document.createElement('option');
    option.value = professor.name;
    option.textContent = professor.name;
    option.id = 'professor-' + profesorIdentificator;
    professorSelect.appendChild(option);
}

// Función para agregar un estudiante a la lista de opciones
function addStudentToSelect(student) {
    const studentsPicker = document.getElementById('studentsPicker');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.value = student.name;
    checkbox.type = 'checkbox';
    checkbox.className = 'studentCheckbox';
    label.appendChild(checkbox);
    label.innerHTML += ' ' + student.name;
    label.className = 'w-100 pl-4';
    label.id = 'student-' + studentIdentificator;
    studentsPicker.appendChild(label);
    studentsList[studentIdentificator] = student;
 }

// Inicializacion
const scheduleGenerator = new ScheduleGenerator();
let studentIdentificator = 0
let profesorIdentificator = 0;
let studentsList = {};
