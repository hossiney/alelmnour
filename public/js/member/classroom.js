// Sample lessons data
const classroomsData = lessons;

let currentClassroom = null;
let currentLesson = null;

// Function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams,name);
    return urlParams.get(name);
}

// Function to create lesson items
function createLessonItem(lesson) {
    const item = document.createElement('div');
    item.className = 'lesson-item';
    item.textContent = lesson.title;
    
    item.addEventListener('click', () => {
        document.querySelectorAll('.lesson-item').forEach(item => item.classList.remove('active'));
        item.classList.add('active');
        loadLesson(lesson);
    });
    
    return item;
}

// Function to load lesson content
function loadLesson(lesson) {
    currentLesson = lesson;
    
    document.getElementById('lesson-title').textContent = lesson.title;
    
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = `
        <video controls width="100%">
            <source src="${lesson.videoUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
    
    const quizButton = document.getElementById('quiz-button');
    quizButton.style.display = 'inline-block';
    quizButton.onclick = () => window.open(lesson.quizUrl, '_blank');
}

// Function to initialize the classroom page
function initializeClassroomPage() {
    const classroomId = window.location.href.split('/member/classroom/')[1];

    console.log(classroomsData[classroomId])
    if (!classroomId || !classroomsData[classroomId]) {
        window.location.replace = '/member/dashboard';
        return;
    }
    
    currentClassroom = classroomsData[classroomId];
    
    document.getElementById('classroom-title').textContent = currentClassroom.title;
    
    const lessonsList = document.getElementById('lessons-list');
    currentClassroom.lessons.forEach(lesson => {
        lessonsList.appendChild(createLessonItem(lesson));
    });
    
    // Load the first lesson by default
    if (currentClassroom.lessons.length > 0) {
        loadLesson(currentClassroom.lessons[0]);
        lessonsList.firstChild.classList.add('active');
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeClassroomPage);