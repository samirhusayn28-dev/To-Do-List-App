import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('react-todo') || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try { localStorage.setItem('react-todo', JSON.stringify(tasks)); } catch {}
  }, [tasks]);

  function addTask() {
    const text = input.trim();
    if (!text) return;
    setTasks(prev => [{ id: Date.now(), text, done: false }, ...prev]);
    setInput('');
  }

  function toggle(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function remove(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function clearDone() {
    setTasks(prev => prev.filter(t => !t.done));
  }

  const remaining = tasks.filter(t => !t.done).length;
  const doneCount = tasks.filter(t => t.done).length;

  const visible = tasks.filter(t =>
    filter === 'all' ? true : filter === 'done' ? t.done : !t.done
  );

  return (
    <div className="app">
      <h1 className="title">My Tasks <span className="badge">{tasks.length}</span></h1>
      <p className="subtitle">{remaining === 0 ? 'All done!' : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`}</p>

      <div className="input-row">
        <input
          className="task-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
          maxLength={120}
        />
        <button className="add-btn" onClick={addTask}>+ Add</button>
      </div>

      <div className="filters">
        {['all', 'active', 'done'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'done' && doneCount > 0 && <span className="badge">{doneCount}</span>}
          </button>
        ))}
      </div>

      <div className="task-list">
        {visible.length === 0 ? (
          <div className="empty">
            {filter === 'done' ? 'No completed tasks yet' : filter === 'active' ? 'No active tasks' : 'Add your first task above'}
          </div>
        ) : visible.map(task => (
          <div key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
            <div
              className={`check-box ${task.done ? 'checked' : ''}`}
              onClick={() => toggle(task.id)}
              role="checkbox"
              aria-checked={task.done}
              tabIndex={0}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle(task.id)}
            >
              {task.done && '✓'}
            </div>
            <span className="task-label">{task.text}</span>
            <button className="del-btn" onClick={() => remove(task.id)} aria-label="Delete task">🗑</button>
          </div>
        ))}
      </div>

      {doneCount > 0 && (
        <button className="clear-btn" onClick={clearDone}>
          Clear {doneCount} completed
        </button>
      )}
    </div>
  );
}

export default App;