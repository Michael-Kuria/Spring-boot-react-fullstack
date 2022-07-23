import {Drawer, Input, Col, Select, Form, Row, Button,Spin} from 'antd';
import { addNewStudent } from './client';
import {LoadingOutlined} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { successNotification, errorNotification } from './Notification';

const {Option} = Select;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


function StudentDrawerForm({showDrawer, setShowDrawer,fetchStudents,setEditStudent,editStudent}) {
    const [form] = Form.useForm();
    
    /**useEffect(() => {
        if(editStudent!= null){
        form.setFieldsValue({id: `${editStudent.id}`, name: `${editStudent.name}`, gender: `${editStudent.gender}`, email: `${editStudent.email}` });
    }else {
        form.setFieldsValue({id: null, name: null, gender: null, email: null });
    }}, editStudent); **/
    useEffect(() => {
        if(editStudent!= null){
        form.setFieldsValue(editStudent);
    }else {
        form.setFieldsValue({id: null, name: null, gender: null, email: null });
    }}, editStudent);

    const onCLose = () => {setShowDrawer(false)
    setEditStudent(null)};
    const [submitting, setSubmitting] = useState(false);

    const onFinish = student => {
        console.log(JSON.stringify(student, null, 2));
        setSubmitting(true);
        addNewStudent(student)
            .then(() => {
                console.log("Student added")
                onCLose();
                successNotification("Student added successfully", `${student.name} added successfully`);
                setEditStudent(null);
                fetchStudents();
            }).catch( err => {
                err.response.json().then(res => {
                    console.log(res)
                    errorNotification("There was an issue", `${res.error} : ${res.message}`, "bottomLeft");
            })}).finally(() => {
                setSubmitting(false);
                setEditStudent(null);
            })
    };

    const onFinishFailed = errorInfo => {
        alert(JSON.stringify(errorInfo, null, 2));
    };

    return <Drawer
        title={editStudent == null? "Create new student": "Edit Student"}
        width={720}
        onClose={onCLose}
        visible={showDrawer}
        bodyStyle={{paddingBottom: 80}}
        footer={
            <div
                style={{
                    textAlign: 'right',
                }}
            >
                <Button onClick={onCLose} style={{marginRight: 8}}>
                    Cancel
                </Button>
            </div>
        }
    >
        <Form layout="vertical"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              initialValues = {editStudent}
              form = {form}
              hideRequiredMark>

                <Form.Item
                        name="id"
                        label="id"
                        hidden = "true"
                    >
                    </Form.Item>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{required: true, message: 'Please enter student name'}]}
                    >
                        <Input placeholder="Please enter student name"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{required: true, message: 'Please enter student email'}]}
                
                    >
                        
                        <Input placeholder="Please enter student email"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="gender"
                        rules={[{required: true, message: 'Please select a gender'}]}
                    >
                        <Select>
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                            <Option value="OTHER">OTHER</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                {submitting && <Spin indicator={antIcon} />}
            </Row>

        </Form>
    </Drawer>
}

export default StudentDrawerForm;