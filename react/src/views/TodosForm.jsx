import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Form, Button, Spinner } from 'react-bootstrap';

export default function TodoForm({ todoId, onTodoSaved, userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (todoId) {
      setLoading(true);
      axiosClient.get(`/todos/${todoId}`)
        .then(({ data }) => {
            console.log(data);
          setTitle(data.title);
          setDescription(data.description);
          setStatus(data.status);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [todoId]);

  const saveTodo = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    try {
      const todoData = { title, description, status ,  user_id: userId };
      if (todoId) {
        await axiosClient.put(`/update/${todoId}`, todoData);
      } else {
        await axiosClient.post('/addtodos', todoData);
      }
      onTodoSaved();
    } catch (error) {
      console.error("Error saving todo", error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      <h1>{todoId ? 'Update Todo' : 'Add Todo'}</h1>
      <Form onSubmit={saveTodo}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <textarea
            as="textarea"
            rows={3}
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
            className="text252"
          />
        </Form.Group>

        <Form.Group controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pending">Pending</option>
            <option value="completed">completed</option>
            <option value="completed">Canceled</option>
          </Form.Control>
        </Form.Group>
<br />
        <Button variant="primary" type="submit" disabled={formLoading}>
          {formLoading ? <Spinner as="span" animation="border" size="lg" /> : (todoId ? 'Update Todo' : 'Add Todo')}
        </Button>
      </Form>
    </div>
  );
}
