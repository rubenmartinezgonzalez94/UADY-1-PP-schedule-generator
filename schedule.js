//test commit ruben
// Clase Asignatura
class Subject {
    constructor(name, professor, duration, frequency) {
        this.name = name;
        this.professor = professor;
        this.duration = duration;
        this.frequency = frequency;
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
    generateOptimalSchedule() {
        const timetable = [];
        const sortedSubjects = this.schedule.sort((a, b) => b.duration - a.duration);

        sortedSubjects.forEach(subject => {
            const slot = this.findAvailableSlot(timetable, subject);
            if (slot !== -1) {
                this.scheduleClass(timetable, subject, slot);
            }
        });

        displayOptimalSchedule(timetable);
    }

// Método para encontrar un espacio disponible en el horario para una asignatura (Orientado a Objetos)
    findAvailableSlot(timetable, subject) {
        for (let day = 0; day < 5; day++) { // Supongamos una semana de lunes a viernes
            let dailyClasses = 0; // Contador para el número diario de clases
            for (let hour = 8; hour < 17 - subject.duration + 1; hour++) { // Modificamos el límite a 5 PM
                if (!this.isSlotOccupied(timetable, day, hour, subject.duration, subject.frequency)) {
                    dailyClasses++;
                    if (dailyClasses === 2) { // Limitar a 2 clases por día
                        const slot = { day, hour };
                        this.scheduleClass(timetable, subject, slot);
                        return slot;
                    }
                }
            }
        }
        return -1;
    }

// Método para verificar si un espacio en el horario está ocupado
    isSlotOccupied(timetable, day, hour, duration, frequency) {
        for (let i = 0; i < duration; i++) {
            for (let j = 0; j < frequency; j++) {
                if (timetable[day + j] && timetable[day + j][hour + i] && (hour + i >= 8 && hour + i < 17)) {
                    return true;
                }
            }
        }
        return false;
    }


    // Método para programar una asignatura en el horario
    scheduleClass(timetable, subject, slot) {
        const { day, hour } = slot;
        for (let i = 0; i < subject.frequency; i++) {
            if (!timetable[day + i]) {
                timetable[day + i] = [];
            }
            for (let j = 0; j < subject.duration; j++) {
                timetable[day + i][hour + j] = subject.name;
            }
        }
    }
}

// Función para agregar una asignatura al horario (Paradigma Funcional)
function addSubject() {
    const subjectInput = document.getElementById('subject');
    const professorInput = document.getElementById('professor');
    const durationInput = document.getElementById('duration');
    const frequencyInput = document.getElementById('frequency');

    const name = subjectInput.value;
    const professor = professorInput.value;
    const duration = parseInt(durationInput.value);
    const frequency = parseInt(frequencyInput.value);

    const newSubject = new Subject(name, professor, duration, frequency);

    scheduleGenerator.addSubject(newSubject);
}

// Función para mostrar la asignatura en el horario (Paradigma Funcional)
function displaySubject(subject) {
    const scheduleList = document.getElementById('scheduleList');
    const listItem = document.createElement('li');
    listItem.textContent = `${subject.name} - Profesor: ${subject.professor} - Duración: ${subject.duration} horas - Frecuencia: ${subject.frequency} veces por semana`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
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
    scheduleGenerator.generateOptimalSchedule();
}

// Función para mostrar el horario óptimo en la interfaz (Paradigma Funcional)
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

// Ejemplo de uso
const scheduleGenerator = new ScheduleGenerator();
console.log("Debugeando")
