import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useHistory, useParams } from 'react-router-dom';

export default function EditTodo() {
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    async function fetchTodo() {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching todo:', error);
      } else if (data) {
        setDescription(data.description || '');
        setCompleted(data.completed || false);
        setDueDate(data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : '');
        setPriority(data.priority || 'Medium');
      }
    }
    fetchTodo();
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();
    await supabase
      .from('todos')
      .update({ description, completed, due_date: dueDate, priority })
      .eq('id', id);
    history.push('/');
  }

  return (
    <div>
      <h3 align="center">Update Todo</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
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
        <div className="form-check">
          <input
            className="form-check-input"
            id="completedCheckbox"
            type="checkbox"
            name="completed"
            onChange={e => setCompleted(e.target.checked)}
            checked={completed}
          />
          <label className="form-check-label" htmlFor="completedCheckbox">
            Completed
          </label>
        </div>

        <br />

        <div className="form-group">
          <input type="submit" value="Update Todo" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}