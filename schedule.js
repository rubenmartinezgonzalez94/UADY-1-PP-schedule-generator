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

    addRestrictions(restriction){
        return this.restrictions;
    }
}

class SubjectWithDayRestriction extends Subject {
    constructor(name, professor, duration, frequency) {
        super(name, professor, duration, frequency);
        this.restrictionType = 'Day'
        this.restrictions = []
    }

    addRestrictions(restriction){
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
            if(frequency == subject.frequency) break;
            if(subject.restrictions && subject.restrictions.includes(day)) continue; //Verifica si el dia se encuentra restringido
            if(classPerDay[day] && classPerDay[day] >= maximumDailyClasses) continue; // Verifica cuantas clases hay en el dia
            for (let hour = 8; hour < 17 - subject.duration + 1; hour++) { // Modificamos el límite a 5 PM
                if (!this.isSlotOccupied(timetable, day, hour, subject.duration)) {
                    frequency++;
                    scheduleDay.push([day, hour])
                    break;
                }
            }
        }

        if(frequency == subject.frequency){
            for(let i = 0; i < scheduleDay.length; i++){
                this.scheduleClass(timetable, classPerDay, subject, scheduleDay[i][0], scheduleDay[i][1]);
            }
            
            return scheduleDay;
        } else{
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
            timetable[day][hour + j] = subject.name;
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

    const name = subjectInput.value;
    const professor = professorInput.value;
    const duration = parseInt(durationInput.value);
    const frequency = parseInt(frequencyInput.value);

    let newSubject;
    if(dayRestritionInput.length > 0){
        newSubject = new SubjectWithDayRestriction(name, professor, duration, frequency);
        for(let i = 0; i < dayRestritionInput.length; i++){
            newSubject.addRestrictions(parseInt(dayRestritionInput[i].value))
        }  
    } else {
        newSubject = new Subject(name, professor, duration, frequency); 
    }

    scheduleGenerator.addSubject(newSubject);
}

// Función para mostrar la asignatura en el horario (Paradigma Funcional)
function displaySubject(subject) {
    const scheduleList = document.getElementById('scheduleList');
    const listItem = document.createElement('li');
    listItem.textContent = `${subject.name} - Profesor: ${subject.professor} - Duración: ${subject.duration} horas - Frecuencia: ${subject.frequency} veces por semana`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    //class="btn btn-primary mb-3" in DOMTokenList
    deleteButton.className = 'btn btn-primary mb-3 mx-2';

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
    for (let hour = 8; hour <= 17; hour++) {
        let row = `<tr><td>${hour}:00</td>`;
        for (let day = 0; day < 5; day++) {
            if (timetable[day] && timetable[day][hour]) {
                const subject = timetable[day][hour];
                row += `<td>${subject}</td>`;
            } else {
                row += '<td></td>';
            }
        }
        row += '</tr>';
        table.innerHTML += row;
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

    let newPerson;

    if (personType === 'professor') {
        const categoryInput = document.getElementById('category');
        const category = categoryInput.value;
        newPerson = new Professor(name, sex, age, category);
        displayPerson(newPerson, 'professorsList');
    } else if (personType === 'student') {
        const averageInput = document.getElementById('average');
        const average = parseFloat(averageInput.value);
        newPerson = new Student(name, sex, age, average);
        displayPerson(newPerson, 'studentsList');
    }
}

function displayPerson(person, listId) {
    const peopleList = document.getElementById(listId);
    const listItem = document.createElement('li');
    let additionalInfo = '';

    listItem.textContent = `Nombre: ${person.name} - Edad: ${person.age} - Sexo: ${person.sex}`;

    if (person instanceof Professor) {
        additionalInfo += ` - Profesor - Categoría: ${person.category}`;
    } else if (person instanceof Student) {
        additionalInfo += ` - Estudiante - Promedio: ${person.average}`;
    }

    listItem.textContent += additionalInfo;
    peopleList.appendChild(listItem);
}



// Ejemplo de uso
const scheduleGenerator = new ScheduleGenerator();
console.log("Debugeando")
