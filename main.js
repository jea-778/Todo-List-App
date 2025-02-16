document.getElementById("fotoProfil").addEventListener("click", function() {
    const dropdown = document.getElementById("profilDropdown");
    
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    function updateDateTime() {
        const dateElement = document.getElementById('updateTanggal');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('id-ID', options);
    }
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    const taskForm = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const prioritySelect = document.getElementById('prioritySelect');
    const dateInput = document.querySelector('input[type="date"]');
    const errorMessage = document.getElementById('errorMessage');
    
    updateDateTime();
    setInterval(updateDateTime, 1000);

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = taskForm.querySelector('input');
        if (input.value.trim()) {
            const newTask = {
                id: Date.now(),
                text: input.value.trim(),
                priority: prioritySelect.value,
                date: dateInput.value || new Date().toISOString().split('T')[0],
                completed: false
            }
            tasks.push(newTask);
            saveAndRender();
            input.value = '';
            noError();
        }else {
            error()
        }
    });

    function noError() {
        errorMessage.style.display = 'none';
    }

    function error(){
        errorMessage.style.display = 'block';
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'todo') return !task.completed;
            if (filter === 'done') return task.completed;
            return true;
        });


        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task ${task.priority}`;
            li.innerHTML = `
                <label>
                    <input type="checkbox" ${task.completed ? 'checked' : ''}/>
                    <p>${task.text}</p>
                    <sp class="priority">${task.priority.toUpperCase()}</sp>
                    <span class="task-date">${task.date}</span>
                </label>
                <i class="uil uil-trash"></i>
                `;
                
                
                const checkbox = li.querySelector('input');
                
                checkbox.addEventListener('change', () => {
                    task.completed = !task.completed;
                    saveAndRender();
                });
                
                li.querySelector('i').addEventListener('click', () => {
                    tasks = tasks.filter(t => t.id !== task.id);
                    saveAndRender();
                });
                
                taskList.appendChild(li);
        });
    }

    document.querySelectorAll('.filters span').forEach(span => {
        span.addEventListener('click', () => {
            document.querySelector('.filters .active').classList.remove('active');
            span.classList.add('active');
            renderTasks(span.id);
        });
    });

    window.deleteAllTask = () => {
        tasks = [];
        saveAndRender();
    }

    function saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const currentFilter = document.querySelector('.filters .active').id;
        renderTasks(currentFilter);
    }

    renderTasks();
});