import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function CreateTodo() {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const history = useHistory();

  async function onSubmit(e) {
    e.preventDefault();

    if (!description.trim()) {
      alert('Todo description cannot be empty!');
      return;
    }

    const newTodo = {
      description,
      due_date: dueDate,
      priority,
      completed: false,
    };

    try {
      const response = await fetch('http://localhost:5000/todos/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      alert('Todo created successfully!');
      history.push('/');

    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Failed to create todo. Please check the console for more details.');
    }
  }

  return (
    <div>
      <h3>Create New Todo</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter your todo description..."
          />
        </div>
        <div className="form-group">
          <label>Due Date: </label>
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Priority: </label>
          <select
            name="priority"
            className="form-control"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="form-group">
          <input type="submit" value="Create Todo" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}