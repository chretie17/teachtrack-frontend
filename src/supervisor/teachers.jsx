import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';

const apiService = {
  getBaseURL: () => 'http://localhost:5000', // Replace with your actual base URL
};

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      message.error('Error fetching teachers');
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingTeacher) {
        await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers/${editingTeacher.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('Teacher updated successfully');
      } else {
        await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        message.success('Teacher added successfully');
      }
      setModalVisible(false);
      fetchTeachers();
    } catch (error) {
      message.error('Error saving teacher');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    form.setFieldsValue(teacher);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers/${id}`, {
        method: 'DELETE',
      });
      message.success('Teacher deleted successfully');
      fetchTeachers();
    } catch (error) {
      message.error('Error deleting teacher');
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this teacher?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="manage-teachers">
      <div className="container">
        <div className="header">
          <h1>Manage Teachers</h1>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setEditingTeacher(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Add Teacher
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={teachers}
          rowKey="id"
          loading={loading}
        />
      </div>

      <Modal
        title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input the username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTeacher ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .manage-teachers {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f0f4f8;
          min-height: 100vh;
          padding: 2rem;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #00447b;
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 500;
        }
        .ant-table-wrapper {
          padding: 1.5rem;
        }
        .ant-table-thead > tr > th {
          background-color: #f0f4f8;
        }
        .ant-btn-primary {
          background-color: #00447b;
          border-color: #00447b;
        }
        .ant-btn-primary:hover {
          background-color: #40a9ff;
          border-color: #40a9ff;
        }
        .ant-modal-header {
          background-color: #1890ff;
          border-bottom: none;
        }
        .ant-modal-title {
          color: white;
        }
        .ant-modal-close-x {
          color: white;
        }
        .ant-form-item-label > label {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default ManageTeachers;