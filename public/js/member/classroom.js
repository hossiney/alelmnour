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
    
    const quizButtonContainer = document.querySelector('.quiz-button-container');
    quizButtonContainer.innerHTML = ''; // مسح الأزرار السابقة
    
    if (lesson.quizUrl && lesson.quizUrl.length > 0) {
        lesson.quizUrl.forEach((link, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-button';
            button.textContent = `اختبار ${index + 1}`;
            button.style.margin = '5px'; // إضافة مسافات بين الأزرار

            button.onclick = () => window.open(link, '_blank');
            quizButtonContainer.appendChild(button);
        });
    }
}

// Function to initialize the classroom page
function initializeClassroomPage() {
    const classroomId = window.location.href.split('/member/classroom/')[1];

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