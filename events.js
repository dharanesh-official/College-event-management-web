const ADMIN_CREDENTIALS = {
    userId: "admin",
    password: "admin123"
};



// Handle login modal for landing page
window.addEventListener('DOMContentLoaded', function() {
    // Modal open
    const openBtn = document.getElementById('loginModalOpen');
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            document.getElementById('loginModal').classList.remove('hidden');
            const errorDiv = document.getElementById('loginError');
            if (errorDiv) errorDiv.classList.add('hidden');
        });
    }
    // Modal close
    const closeBtn = document.getElementById('loginModalClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('loginModal').classList.add('hidden');
            const errorDiv = document.getElementById('loginError');
            if (errorDiv) errorDiv.classList.add('hidden');
        });
    }
    // Login form submit
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userId = document.getElementById('userId').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');
            if (userId === ADMIN_CREDENTIALS.userId && password === ADMIN_CREDENTIALS.password) {
                if (errorDiv) errorDiv.classList.add('hidden');
                document.getElementById('loginModal').classList.add('hidden');
                window.location.href = 'addevent.html';
            } else {
                if (errorDiv) {
                    errorDiv.textContent = 'Invalid User ID or Password!';
                    errorDiv.classList.remove('hidden');
                }
            }
        });
    }
});

// Handle event add
document.getElementById('eventForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const rules = document.getElementById('eventRules').value;
    const imageInput = document.getElementById('eventImage');
    const file = imageInput.files[0];

    // Read image as base64
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageData = event.target.result;
        const eventData = { title, description, rules, image: imageData };
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        events.push(eventData);
        localStorage.setItem('events', JSON.stringify(events));
        window.location.href = 'main.html';
    };
    if(file) {
        reader.readAsDataURL(file);
    }
});

// Delete event
function deleteEvent(index) {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.splice(index, 1);
    localStorage.setItem('events', JSON.stringify(events));
    displayEvents();
}

// Display events
function displayEvents() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    alert('displayEvents called: ' + events.length + ' events');
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    let html = '<h3>Existing Events</h3>';
    events.forEach((event, index) => {
        html += `
            <div class="event-item">
                <h4>${event.title}</h4>
                <img src="${event.image}" alt="Event Image" style="max-width:100px;max-height:100px;">
                <p><strong>Description:</strong> ${event.description}</p>
                <p><strong>Rules:</strong> ${event.rules}</p>
                <button onclick="deleteEvent(${index})">Delete</button>
            </div>
        `;
    });
    eventList.innerHTML = html;
}

// For main.html: dynamically render events
function renderEventsOnMain() {
    console.log('renderEventsOnMain invoked, events:', localStorage.getItem('events'));
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    // Remove old dynamic cards
    grid.querySelectorAll('.dynamic-event-card').forEach(el => el.remove());
    // Remove existing user-event heading
    const oldCount = document.getElementById('dynamicEventCount');
    if (oldCount) oldCount.remove();
    // Add subheading above grid
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const countDiv = document.createElement('h3');
    countDiv.id = 'dynamicEventCount';
    countDiv.className = 'text-2xl font-semibold text-green-400 mb-6 text-center';
    countDiv.textContent = `Your Events (${events.length})`;
    grid.parentNode.insertBefore(countDiv, grid);
    // Render each event
    events.forEach(({ title, description, image, rules }) => {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-br from-indigo-900 via-gray-900 to-black rounded-2xl shadow-xl border border-indigo-700/40 flex flex-col items-center p-0 overflow-hidden dynamic-event-card';
        card.innerHTML = `
          <div class="w-full h-56 bg-gray-900 rounded-t-2xl overflow-hidden flex items-center justify-center">
            <img src="${image}" alt="${title}" class="w-4/5 h-4/5 object-contain object-center rounded-t-2xl" />
          </div>
          <div class="flex-1 w-full flex flex-col justify-between p-6">
            <h3 class="text-xl md:text-2xl font-bold text-center text-indigo-200 mb-4">${title}</h3>
            <div class="flex justify-center gap-4 mt-4">
              <button type="button" class="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold px-6 py-2 rounded-full shadow transition-all" data-event="${title}">Description</button>
              <button type="button" class="bg-purple-400 hover:bg-purple-500 text-black font-semibold px-6 py-2 rounded-full shadow transition-all" data-event="${title}">Rules</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
    });
    // Add event listeners to description and rules buttons
    const descriptionButtons = grid.querySelectorAll('[data-event]');
    descriptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const title = button.getAttribute('data-event');
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            const event = events.find(event => event.title === title);
            if (event) {
                if (button.textContent === 'Description') {
                    showEventRules(title, event.description);
                } else {
                    showEventRules(title, event.rules);
                }
            }
        });
    });
}

// Helper for rules modal
function showEventRules(title, rules) {
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    document.getElementById('modal-title').innerText = title + ' Rules';
    document.getElementById('modal-body').innerText = rules;
    modal.classList.remove('hidden');
}

// Close event modal
if (document.getElementById('modal-close')) {
    document.getElementById('modal-close').onclick = function() {
        document.getElementById('event-modal').classList.add('hidden');
    }
}

// Immediately initialize based on page elements (scripts at body end)
if (typeof displayEvents === 'function' && document.getElementById('eventList')) {
    displayEvents();
}
if (typeof renderEventsOnMain === 'function' && document.getElementById('eventsGrid')) {
    renderEventsOnMain();
}