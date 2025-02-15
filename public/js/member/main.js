// Sample classroom data٫


 console.log(membersData)
const classrooms = membersData;
// [
//     {
//         id: 1,
//         title: 'الرياضيات للصف العاشر',
//         description: 'دروس شاملة في الرياضيات للصف العاشر',
//         subscriptionEnd: '2024-06-30'
//     },
//     {
//         id: 2,
//         title: 'الفيزياء للصف الحادي عشر',
//         description: 'شرح مفصل لمنهج الفيزياء',
//         subscriptionEnd: '2024-05-15'
//     },
//     {
//         id: 3,
//         title: 'الكيمياء للصف الثاني عشر',
//         description: 'دروس متقدمة في الكيمياء',
//         subscriptionEnd: '2024-07-01'
//     }
// ];

// Function to format date in Arabic
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// Function to calculate days remaining
function getDaysRemaining(dateString) {
    const today = new Date();
    const endDate = new Date(dateString);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Function to get subscription status class
function getSubscriptionStatusClass(daysRemaining) {
    if (daysRemaining <= 0) return 'expired';
    if (daysRemaining <= 7) return 'expiring-soon';
    return 'active';
}

// Function to create classroom cards
function createClassroomCard(classroom) {
    const daysRemaining = getDaysRemaining(classroom.subscriptionEnd);
    const statusClass = getSubscriptionStatusClass(daysRemaining);
    
    const card = document.createElement('div');
    card.className = 'classroom-card';
    card.innerHTML = `
        <h2>${classroom.title}</h2>
        <p>${classroom.description}</p>
          <div class="lesson-badges">
         <span class="badge  ${classroom.type === "حضوري"? "live" : "recorded"}">${classroom.type}</span>
        </div>
    

        <div class="subscription-info ${statusClass}">
            <p>ينتهي الاشتراك في: ${formatDate(classroom.subscriptionEnd)}</p>
            <p class="days-remaining">
                ${daysRemaining > 0 
                    ? `متبقي ${daysRemaining} يوم${daysRemaining === 1 ? '' : 'اً'}`
                    : 'انتهى الاشتراك'}
            </p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `classroom/${classroom.id}`;
    });
    
    return card;
}

// Initialize the page
function initializePage() {
    const classroomsContainer = document.getElementById('classrooms');
    classrooms.forEach(classroom => {
        classroomsContainer.appendChild(createClassroomCard(classroom));
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);