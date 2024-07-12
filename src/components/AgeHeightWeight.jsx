import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Form, Input, Button, Select, Typography, message as antdMessage, Card, Row, Col } from 'antd';

const { Title } = Typography;
const { Option } = Select;

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
let USERS_LINK = LINK+"users";
const AgeHeightWeight = () => {
  document.title = "Kayıt ol"
  const location = useLocation();
  const { email, password, name, surName } = location.state;
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState(null);

  const handleSubmit = async (values) => {
    const { age, height, weight, gender } = values;
    const data = [[email, password, name, surName, age, height, weight, gender]];

    try {
      const response = await axios.post(
        USERS_LINK,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(response.data);
      antdMessage.success('Bilgiler başarıyla kaydedildi!');
    } catch (error) {
      console.error('Kayıt sırasında hata oluştu:', error);
      antdMessage.error('Kayıt sırasında hata oluştu.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#eafaf1' }}>
    <div style={{ backgroundColor: '#4CAF50', padding: '10px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
      <Title level={2} style={{ color: '#ffffff', margin: 0 , textAlign:"center"}}>diyetisyenim.com</Title>
    </div>
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card>
          <h1 style={{textAlign:'center', color: "#508D4E"}}>Seni yakından tanıyalım {name}</h1>
            <Form
              name="age_height_weight_form"
              onFinish={handleSubmit}
              layout="vertical"
              style={{ marginTop: 24 }}
            >
              <Form.Item
                name="age"
                rules={[{ required: true, message: 'Lütfen yaşınızı girin!' }]}
              >
                <Input
                  type="number"
                  placeholder="Yaşınızı girin"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item
                name="height"
                rules={[{ required: true, message: 'Lütfen boyunuzu girin (cm)!' }]}
              >
                <Input
                  type="number"
                  placeholder="Boyunuzu girin (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item
                name="gender"
                rules={[{ required: true, message: 'Lütfen cinsiyetinizi seçin!' }]}
              >
                <Select
                  placeholder="Cinsiyetiniz"
                  value={gender}
                  onChange={(value) => setGender(value)}
                  style={{ borderColor: '#4CAF50' }}
                >
                  <Option value="Erkek">Erkek</Option>
                  <Option value="Kadın">Kadın</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="weight"
                rules={[{ required: true, message: 'Lütfen kilonuzu girin (kg)!' }]}
              >
                <Input
                  type="number"
                  placeholder="Kilonuzu girin (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}  
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: "#4CAF50" }}>
                  Kaydet
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      /</div>
  );
};

export default AgeHeightWeight;
