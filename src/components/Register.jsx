import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Radio, Typography, message as antdMessage, Card, Row, Col } from 'antd';

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
let DIETICIAN_LINK = LINK+ "dietician";
const { Title } = Typography;

function Register() {
  document.title = "Kayıt ol"
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surName, setSurName] = useState('');
  const [role, setRole] = useState('user'); 

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const dieticianRegister = async () => {
    const data = [[email, password, name, surName]];
    try {
      const response = await axios.post(
        DIETICIAN_LINK,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log(response.data);
      antdMessage.success('Yeni kullanıcı oluşturuldu.');
    } catch (error) {
      antdMessage.error('Kayıt sırasında bir hata oluştu.');
    }
  };

  const handleSubmit = (values) => {
    const { email, password, name, surName } = values;
    if (role === 'user') {
      navigate('/age-height-weight', { state: { email, password, name, surName } });
    } else {
      dieticianRegister();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#eafaf1' }}>
    <div style={{ backgroundColor: '#4CAF50', padding: '10px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
      <Title level={2} style={{ color: '#ffffff', margin: 0 , textAlign:"center"}}>diyetisyenim.com</Title>
    </div>
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'  }}>
            <Title level={3} style={{ textAlign: 'center', color: '#4CAF50', fontSize:35}}><b>Kayıt ol</b></Title>
            <Form
              name="register_form"
              onFinish={handleSubmit}
              layout="vertical"
              style={{ marginTop: 24}}
            >
              <Form.Item>
                <Radio.Group onChange={handleRoleChange} value={role} style={{ display: 'flex', justifyContent: 'center',}}>
                  <Radio value="user" style={{ marginRight: '16px' }}>Kullanıcı</Radio>
                  <Radio value="dietician">Diyetisyen</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item 
                name="email"
                rules={[{ required: true, message: 'E-postanızı girmelisiniz!' }]}
              >
                <Input
                  type="email"
                  placeholder="E-postanızı girin"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Şifrenizi girmelisiniz!' }]}
              >
                <Input.Password
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Adınızı girmelisiniz!' }]}
              >
                <Input
                  type="text"
                  placeholder="Adınızı yazın"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item
                name="surName"
                rules={[{ required: true, message: 'Soyadınızı girmelisiniz!' }]}
              >
                <Input
                  type="text"
                  placeholder="Soyadınızı yazın"
                  value={surName}
                  onChange={(e) => setSurName(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
                  Kayıt ol
                </Button>
              </Form.Item>

              <span style={{fontSize: 18}}>Zaten bir hesabınız var mı?  <Button type="link" onClick={() => { navigate('/login'); }} style={{ color: '#4CAF50' , fontSize: 20}}>Giriş yapın</Button></span>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
