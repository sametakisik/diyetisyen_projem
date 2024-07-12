import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Typography, Input, Button, Form, Row, Col, Modal, Select } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;
let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
const USERS_LINK = LINK+ "users"

const Profile = () => {
    document.title = "Profil"
    const location = useLocation();
    const navigate = useNavigate();  // Hook for navigation
    const { users } = location.state || {};  // Add a default value to avoid undefined

    const [editable, setEditable] = useState(false);
    const [formValues, setFormValues] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(USERS_LINK);
                const filteredUser = response.data.data.find(
                    (item) => item.email === users.email
                );
                if (filteredUser) {
                    setUser(filteredUser);
                    setFormValues(filteredUser);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (users?.email) {
            fetchData();
        }
    }, [users?.email]);

    const handleEdit = () => {
        setEditable(true);
    };

    const handleSave = async () => {
        try {
            const updatedUser = {
                ...user,
                ...formValues,
            };
            await axios.put(USERS_LINK, updatedUser);

            console.log('Güncellenmiş bilgiler:', formValues);
            setUser(updatedUser); // Güncellenen kullanıcı verilerini state'e kaydedin
            setEditable(false);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleGenderChange = (value) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            gender: value,
        }));
    };

    const showLogoutConfirm = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        navigate('/login');
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Function to navigate back to the previous page
    const handleNavigateBack = () => {
        navigate(-1);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#eafaf1' }}>
            <div style={{ backgroundColor: '#4caf50', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: 0 }}>diyetisyenim.com</h1>
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', fontSize: 20 }}
                        onClick={handleNavigateBack}  // Added onClick event handler
                    >
                        Diyetisyenler
                    </Button>
                    <Button danger onClick={showLogoutConfirm}>Çıkış Yap</Button>
                </Row>
            </div>
            
            <Card
                title={<Title level={2}>Profil Bilgileri</Title>}
                style={{ width: 600, margin: '0 auto' }}
                actions={[
                    editable ? <Button type="primary" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} onClick={handleSave}>Kaydet</Button> : <Button type="default" style={{ color: "#4caf50", borderColor: "#4caf50" }} onClick={handleEdit}>Düzenle</Button>
                ]}
            >
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Adınız:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Input
                                        name="name"
                                        value={formValues.name}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Text>{formValues.name}</Text>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Soyadınız:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Input
                                        name="surname"
                                        value={formValues.surname}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Text>{formValues.surname}</Text>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>E-posta adresiniz:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Input
                                        name="email"
                                        value={formValues.email}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Text>{formValues.email}</Text>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Şifreniz:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Input.Password
                                        name="password"
                                        value={formValues.password}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Text>********</Text>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Boyunuz:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Input
                                        name="height"
                                        value={formValues.height}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Text>{formValues.height}</Text>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Kilonuz:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Input
                                        name="weight"
                                        value={formValues.weight}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Text>{formValues.weight}</Text>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Yaşınız:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Input
                                        name="age"
                                        value={formValues.age}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Text>{formValues.age}</Text>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={<strong>Cinsiyetiniz:</strong>}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                {editable ? (
                                    <Select
                                        placeholder="Cinsiyetiniz"
                                        value={formValues.gender}
                                        onChange={handleGenderChange} // Update gender value
                                    >
                                        <Option value="Erkek">Erkek</Option>
                                        <Option value="Kadın">Kadın</Option>
                                    </Select>
                                ) : (
                                    <Text>{formValues.gender}</Text>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Modal
                title="Çıkış Yap"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Evet"
                cancelText="Hayır"
                okButtonProps={{ style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' } }}
                cancelButtonProps={{ style: { backgroundColor: '#fff', borderColor: '#4CAF50', color: "#4CAF50" } }}
            >
                <p>Çıkış yapmak istediğinize emin misiniz?</p>
            </Modal>
        </div>
    );
};

export default Profile;
