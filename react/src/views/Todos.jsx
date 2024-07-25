import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function Todos() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [todos, setTodos] = useState([]); 
  const [softDeletedTodos, setSoftDeletedTodos] = useState([]);
  const [todo, setTodo] = useState({
    id: null,
    title: '',
    description: '',
    status: 'Pending'
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getTodos();
    getSoftDeletedTodos();
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/todos/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setTodo(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const getTodos = () => {
    setLoading(true);
    axiosClient.get('/todos')
      .then(({ data }) => {
        setLoading(false);
        setTodos(data.data || []);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getSoftDeletedTodos = () => {
    axiosClient.get('/soft-deleted')
      .then(({ data }) => {
        setSoftDeletedTodos(data.data || []);
      })
      .catch(err => {
        console.error("Error fetching soft-deleted todos", err);
      });
  };

  const onDeleteClick = todo => {
    if (!window.confirm("Are you sure you want to delete this todo?")) {
      return;
    }
    axiosClient.delete(`/delete/${todo.id}`)
      .then(() => {
        setNotification('Todo was successfully deleted');
        getTodos();
        getSoftDeletedTodos();
      })
      .catch(err => {
        console.error("Error deleting todo", err);
      });
  };

  const onRestoreClick = todo => {
    axiosClient.post(`/restore/${todo.id}`)
      .then(() => {
        setNotification('Todo was successfully restored');
        getTodos();
        getSoftDeletedTodos();
      })
      .catch(err => {
        console.error("Error restoring todo", err);
      });
  };

  const onForceDeleteClick = todo => {
    if (!window.confirm("Are you sure you want to permanently delete this todo?")) {
      return;
    }
    axiosClient.delete(`/force-delete/${todo.id}`)
      .then(() => {
        setNotification('Todo was permanently deleted');
        getSoftDeletedTodos();
      })
      .catch(err => {
        console.error("Error permanently deleting todo", err);
      });
  };

  const onSubmit = ev => {
    ev.preventDefault();
    if (todo.id) {
      axiosClient.put(`/update/${todo.id}`, todo)
        .then(() => {
          setNotification('Todo was successfully updated');
          navigate('/todos');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/addtodos', todo)
        .then(() => {
          setNotification('Todo was successfully created');
          navigate('/todos');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>{todo.id ? `Update Todo: ${todo.title}` : 'Todos'}</h1>
        {!todo.id && <Link className="btn-add" to="/todos/new">Add new</Link>}
      </div>
      {todo.id && !loading && (
        <div className="card animated fadeInDown">
          <form onSubmit={onSubmit}>
            <input value={todo.title} onChange={ev => setTodo({ ...todo, title: ev.target.value })} placeholder="Title" />
            <textarea value={todo.description} onChange={ev => setTodo({ ...todo, description: ev.target.value })} placeholder="Description" />
            <select value={todo.status} onChange={ev => setTodo({ ...todo, status: ev.target.value })}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
            <button className="btn">Save</button>
          </form>
        </div>
      )}
      {!todo.id && (
        <div className="card animated fadeInDown">
          {loading && (
            <div className="text-center">
              Loading...
            </div>
          )}
          {errors && (
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          {!loading && (
            <>
              <h2>Active Todos</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.length > 0 ? (
                    todos.map(t => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.title}</td>
                        <td>{t.description}</td>
                        <td>{t.status}</td>
                        <td>
                          <Link className="btn-edit" to={`/todos/${t.id}`}>Edit</Link>
                          &nbsp;
                          <button className="btn-delete" onClick={() => onDeleteClick(t)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No todos available</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <h2>Soft-Deleted Todos</h2>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {softDeletedTodos.length > 0 ? (
                    softDeletedTodos.map(t => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.title}</td>
                        <td>{t.description}</td>
                        <td>{t.status}</td>
                        <td>
                          <button className="btn-restore" onClick={() => onRestoreClick(t)}>Restore</button>
                          &nbsp;
                          <button className="btn-force-delete" onClick={() => onForceDeleteClick(t)}>Force Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No soft-deleted todos</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}
