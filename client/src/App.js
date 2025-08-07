import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import CreateTodo from './components/CreateTodo';
import EditTodo from './components/EditTodo';
import TodoList from './components/TodoList';
import Clock from './components/Clock';
import AuthPage from './components/AuthPage';

function App() {
  const [session, setSession] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    const { data, error } = await supabase.from('todos').select('*');
    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!session) return;

    fetchTodos();

    const subscription = supabase
      .channel('todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, fetchTodos)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [session]);

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="container">
      <ToastContainer />
      <nav className="navbar navbar-expand-lg navbar-dark">
        <Link to="/" className="navbar-brand">MERN-Stack Todo App</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">Todos</Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link">Create Todo</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="navbar-item">
              <button className="btn btn-link nav-link" onClick={() => supabase.auth.signOut()}>Logout</button>
            </li>
          </ul>
        </div>
        <Clock />
      </nav>
      <br />
      <Route path="/" exact>
        <TodoList todos={todos} loading={loading} fetchTodos={fetchTodos} />
      </Route>
      <Route path="/edit/:id" component={EditTodo} />
      <Route path="/create" component={CreateTodo} />
    </div>
  );
}

// Wrap App in Router to use useLocation hook
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
