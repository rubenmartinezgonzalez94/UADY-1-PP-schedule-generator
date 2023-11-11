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
            for (let hour = 8; hour < 18 - subject.duration + 1; hour++) { // Solo de 8 AM a 6 PM
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
                if (timetable[day + j] && timetable[day + j][hour + i]) {
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
    scheduleList.appendChild(listItem);
}

// Función para generar el horario óptimo (Paradigma Funcional)
function generateOptimalSchedule() {
    scheduleGenerator.generateOptimalSchedule();
}

// Función para mostrar el horario óptimo en la interfaz (Paradigma Funcional)
function displayOptimalSchedule(timetable) {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = "";

    timetable.forEach((day, dayIndex) => {
        day.forEach((subject, hourIndex) => {
            if (subject) {
                const listItem = document.createElement('li');
                listItem.textContent = `${subject} - Día: ${dayIndex + 1}, Hora: ${hourIndex + 8}`;
                scheduleList.appendChild(listItem);
            }
        });
    });
}

// Ejemplo de uso
const scheduleGenerator = new ScheduleGenerator();
console.log("Debugeando")
