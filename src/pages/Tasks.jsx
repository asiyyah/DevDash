import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, X } from 'lucide-react';
import { STORAGE_KEYS } from '../constants';

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState({ text: '', dueDate: '' });
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const addTaskButtonRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const modal = modalRef.current;
    const trigger = addTaskButtonRef.current;
    const focusableElements = modal?.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    firstElement?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        return;
      }

      if (event.key !== 'Tab' || !firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      trigger?.focus();
    };
  }, [isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    
    setTasks([...tasks, { 
      id: Date.now(), 
      text: formData.text.trim(), 
      dueDate: formData.dueDate,
      completed: false 
    }]);
    
    setFormData({ text: '', dueDate: '' });
    setIsModalOpen(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="fade-in">
      <h1 className="page-title">Personal Tasks</h1>
      <p className="page-subtitle">Manage your daily workflow and track milestones.</p>
      
      <div className="tasks-layout card">
        <div className="tasks-header">
          <button 
            ref={addTaskButtonRef}
            className="btn btn-primary add-task-btn" 
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            <span>Add New Task</span>
          </button>
          
          <div className="task-filters">
            {['all', 'pending', 'completed'].map(f => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-backdrop" onMouseDown={() => setIsModalOpen(false)}>
            <div
              ref={modalRef}
              className="modal-content card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="task-modal-title"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 id="task-modal-title" className="modal-title">Create New Task</h2>
                <button className="close-btn" onClick={() => setIsModalOpen(false)} aria-label="Close task dialog">
                  <X size={24} />
                </button>
              </div>
              
              <form className="task-modal-form" onSubmit={addTask}>
                <div className="modal-body">
                  <div className="input-field">
                    <label htmlFor="task-description">Task Description</label>
                    <input
                      id="task-description"
                      type="text"
                      name="text"
                      className="input"
                      placeholder="What needs to be done?"
                      value={formData.text}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="input-field">
                    <label htmlFor="task-due-date">Due Date</label>
                    <div className="date-input-wrapper">
                      <Calendar size={18} color="white" />
                      <input
                        id="task-due-date"
                        type="date"
                        name="dueDate"
                        className="input date-input"
                        value={formData.dueDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <p className="empty-state">No tasks found. Time to relax or add a new goal!</p>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <button
                  className="toggle-btn"
                  onClick={() => toggleTask(task.id)}
                  aria-label={`${task.completed ? 'Mark as pending' : 'Mark as completed'}: ${task.text}`}
                >
                  {task.completed ? <CheckCircle2 className="accent-emerald" size={20} /> : <Circle size={20} />}
                </button>
                <div className="task-content">
                  <span className="task-text">{task.text}</span>
                  {task.dueDate && (
                    <span className="task-date">
                      <Calendar size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button className="delete-btn" onClick={() => deleteTask(task.id)} aria-label={`Delete task: ${task.text}`}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


export default Tasks;
