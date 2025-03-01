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

    if(currentClassroom.schedule.length > 0) {
        const btn = document.getElementById("calendar-button");
        // Remove the display none (you can also remove the whole style attribute)
        btn.style.display = "inline-block"; // or "block", as preferred


    }

    document.getElementById('classroom-title').textContent = currentClassroom.title;
    
    const lessonsList = document.getElementById('lessons-list');
    currentClassroom.lessons.forEach(lesson => {
        lessonsList.appendChild(createLessonItem(lesson));
    });
    if (currentClassroom.onlineMeetingLink) {
        
        const zoomBtn = document.getElementById("zoom-join-button");
    // Remove the display none (you can also remove the whole style attribute)
    zoomBtn.style.display = "inline-block"; // or "block", as preferred
    
    // Set the value attribute of the button
    zoomBtn.value = currentClassroom.onlineMeetingLink; // replace wi

    }
    // Load the first lesson by default
    if (currentClassroom.lessons.length > 0) {
        loadLesson(currentClassroom.lessons[0]);
        lessonsList.firstChild.classList.add('active');
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeClassroomPage);

function formatTime(time24) {
    let [hours, minutes] = time24.split(':');
    let date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true });
}



const modal = document.getElementById("myModal");
const btn = document.getElementById("calendar-button");
const closeBtn = document.getElementsByClassName("close")[0];
const tableBody = document.getElementById("scheduleTable");
// عند النقر على زر الفتح، تظهر النافذة
btn.addEventListener("click", function() {
    const schedule = currentClassroom.schedule;
    let counter = 1;

    tableBody.innerHTML = "";

    // إضافة البيانات إلى الجدول
    schedule.forEach(entry => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${counter}</td><td>${entry.day}</td><td>${entry.time} - (${formatTime(entry.time)})</td>`;
            tableBody.appendChild(row);
      counter++;
    });

  modal.style.display = "block";
});

// عند النقر على زر الإغلاق، تغلق النافذة
closeBtn.addEventListener("click", function() {
  modal.style.display = "none";
});

// إغلاق النافذة عند النقر خارج محتواها
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});