import React, { useState, useEffect } from 'react';
import { TiPlus } from "react-icons/ti";

import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  UncontrolledTooltip
} from 'reactstrap';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTask, setCurrentTask] = useState({ no: '', name: '', description: '' });
  const [errors, setErrors] = useState({ name: false, description: false });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggle = () => setModal(!modal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
    setErrors({ ...errors, [name]: value.trim() === '' });
  };

  const handleAddTask = () => {

    
    if (validateInputs()) {
      const newTask = {
        ...currentTask,
        no: tasks.length + 1,
        createdAt: new Date().toLocaleString(),
        updatedAt: '',
      };
      setTasks([...tasks, newTask]);
      setCurrentTask({ no: '', name: '', description: '' });
      toggle();
    }
  };

  const handleUpdateTask = () => {
    if (validateInputs()) {
      const updatedTasks = tasks.map((task) =>
        task.no === currentTask.no
          ? { ...task, name: currentTask.name, description: currentTask.description, updatedAt: new Date().toLocaleString() }
          : task
      );
      setTasks(updatedTasks);
      setCurrentTask({ no: '', name: '', description: '' });
      toggle();
    }
  };

  const handleDeleteTask = (no) => {
    let updatedTasks = tasks.filter((task) => task.no !== no);
    updatedTasks = updatedTasks.map((task, index) => ({
      ...task,
      no: index + 1,
    }));
    setTasks(updatedTasks);
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsEditMode(true);
    toggle();
  };

  const validateInputs = () => {
    const nameError = currentTask.name.trim() === '';
    const descriptionError = currentTask.description.trim() === '';
    setErrors({ name: nameError, description: descriptionError });
    return !nameError && !descriptionError;
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center">To-Do List</h1>
          <Button color="primary" onClick={() => { setIsEditMode(false); toggle(); }}>
            

          <TiPlus />

            Add Task
          </Button>
          <Table className="mt-4">
            <thead>
               <tr>
                 <th>No</th>
                 <th>Name</th>
                 <th>Description</th>
                 <th>Created At</th>
                 <th>Updated At</th>
                 <th>Actions</th>
               </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.no}>
                  <td>{task.no}</td>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.createdAt}</td>
                  <td>{task.updatedAt}</td>
                  <td>
                    <Button color="warning" onClick={() => openEditModal(task)}>Update</Button>
                    <Button color="danger" onClick={() => handleDeleteTask(task.no)} className="ml-2">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{isEditMode ? 'Update Task' : 'Add Task'}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={currentTask.name}
              invalid={!currentTask.name} valid={currentTask.name.length>3}
              onChange={handleInputChange}
              style={{
                borderColor: errors.name ? 'red' : currentTask.name ? 'green' : undefined,
              }}
            />
            <UncontrolledTooltip target="name">
              Error
            </UncontrolledTooltip>
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="text"
              name="description"
              id="description"
              value={currentTask.description}
              invalid={!currentTask.description} valid={currentTask.description.length>3}
              onChange={handleInputChange}
              style={{
                borderColor: errors.description ? 'red' : currentTask.description ? 'green' : undefined,
              }}
            />
            <UncontrolledTooltip  target="description">
              Error
            </UncontrolledTooltip>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={isEditMode ? handleUpdateTask : handleAddTask}>
            {isEditMode ? 'Update' : 'Add'}
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default App;






