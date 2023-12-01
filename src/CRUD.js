import React, { useState, useEffect, Fragment } from 'react'
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const CRUD = () => {
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);

    // For New Employee
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [isActive, setIsActive] = useState(0);

    // For Editing Employee
    const [editId, setEditId] = useState()
    const [editName, setEditName] = useState("");
    const [editAge, setEditAge] = useState("");
    const [editIsActive, setEditIsActive] = useState(0);



    // handles for show or hide Modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleIsActiveChange = (e) => {
        if (e.target.checked) {
            setIsActive(1);
        }
        else {
            setIsActive(0);
        }
    }
    const handleEditIsActiveChange = (e) => {
        if (e.target.checked) {
            setEditIsActive(1);
        }
        else {
            setEditIsActive(0);
        }
    }

    const handleEdit = (id) => {
        axios.get(`https://localhost:7182/api/Employee/${id}`).then((result) =>{
            setEditName(result.data.name);
            setEditAge(result.data.age);
            setEditIsActive(result.data.isActive);
            setEditId(id);
        }).catch((error) =>{
            console.log(error);
        })
        handleShow();
    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure, you want to delete this employee") === true) {
            axios.delete(`https://localhost:7182/api/Employee/${id}`).then((result) => {
                getData();
                toast.success("Employee has been deleted !");
            }).catch((error) => {
                toast.success("Internal Server Error !");
                console.log(error);
            });
        }
    }
    const handleUpdate = () => {
        const url = `https://localhost:7182/api/Employee/${editId}`
        const data = {
            id : editId, 
            name : editName,
            age : editAge,
            isActive : isActive
        }
        axios.put(url, data).then((result) => {
            toast.success("Employee has been updated!");
            getData();
        }).catch((error) => {
            toast.error("Internal Server Error!");
            console.log(error)
        })
        handleClose();
    }
    const handleSave = () => {
        const url = 'https://localhost:7182/api/Employee';
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }
        axios.post(url, data).then((result) => {
            getData();
            clearAllFields();
            toast.success('Employee has been added !')
        }).catch((error) => {
            toast.success("Internal Server Error!");
            console.log(error);
        })
    }

    const clearAllFields = () => {
        setName("");
        setAge("");
        setIsActive(0);
        setEditName("")
        setEditAge("");
        setEditIsActive(0);
        setEditId("");
    }

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios.get('https://localhost:7182/api/Employee').then((result) => {
            setData(result.data);
        }).catch((error) => {
            console.log(error);
            alert("Could not load Employee!");
        })
    }




    return (
        <Fragment>
            <ToastContainer />
            {/* Form Tag Start */}
            <Container className='my-3'>
                <Row>
                    <Col>
                        <input type="text" className='form-control' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className='form-control' placeholder='Enter Age' value={age} onChange={(e) => setAge(e.target.value)} />
                    </Col>
                    <Col className='my-2'>
                        <input type="checkbox" id='IsActive' checked={isActive === 1 ? true : false}
                            onChange={(e) => handleIsActiveChange(e)} value={isActive} /> &nbsp;
                        <label htmlFor="IsActive">Is Active</label>
                    </Col>
                    <Col>
                        <button className='btn btn-primary' onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>

            {/* table Tag Starts */}
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>IsActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ?
                        data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>{item.isActive}</td>
                                    <td colSpan={2}>
                                        <button className="btn btn-info" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                        <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            )
                        }) : <tr><td colSpan={6}>No Records to display !</td></tr>
                    }
                </tbody>
            </Table>

            {/* Modal Tag Starts */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify/Update Employee Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Row>
                        <Col>
                            <input type="text" className='form-control' placeholder='Enter Name' value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" className='form-control' placeholder='Enter Age' value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                        </Col>
                        <Col className='my-2'>
                            <input type="checkbox" id='EditIsActive' checked={editIsActive === 1 ? true : false}
                                onChange={(e) => handleEditIsActiveChange(e)} value={editIsActive} /> &nbsp;
                            <label htmlFor="EditIsActive">Is Active</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default CRUD
