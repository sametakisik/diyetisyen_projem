import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message as antdMessage } from 'antd';
import { UserContext } from './context';
import { useUserContext } from './UserContext';

const { Title } = Typography;
let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
let USERS_LINK = LINK+"users";
let DIETICIAN_LINK =LINK+ "dietician";
let RELATION_LINK = LINK + "relation"

const Login = () => {
  document.title = "Giriş yap"
  const { email, setEmail } = useUserContext();
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const { email, password } = values;

      let response = await axios.get(USERS_LINK);
      let users = response.data.data;

      let user = users.find(user => user.email === email && user.password === password);

      if (user) {
        const response = await axios.get(RELATION_LINK);
        const filteredRequests = response.data.data.filter(
          (item) => item.userEmail === email && item.state === "Kabul edildi"
        );
        filteredRequests.length === 0
          ? navigate('/request-dietician', { state: { user_email: user.email, user_name: user.name, user_surname: user.surname,user:user } })
          : navigate("/user-homepage", { state: { user_email: user.email, dietician_email: filteredRequests[0].dieticianEmail,_user:user, _dietician:filteredRequests[0]} });

        return;
      }

      response = await axios.get(DIETICIAN_LINK);
      users = response.data.data;
      user = users.find(user => user.email === email && user.password === password);

      if (user) {
        navigate('/home', { state: { dietician_email: user.email } });
        return;
      }

      antdMessage.error('Kullanıcı bulunamadı.');
    } catch (error) {
      console.error('Error occurred:', error);
      antdMessage.error('Giriş yaparken bir hata oluştu.');
    }
  };

  const data = { email };

  return (
    <UserContext.Provider value={data}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#eafaf1' }}>
        <div style={{ backgroundColor: '#4CAF50', padding: '10px 20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' }}>
          <Title level={2} style={{ color: '#ffffff', margin: 0 , textAlign:"center"}}>diyetisyenim.com</Title>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: 400, width: '100%', padding: 24, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', borderRadius: 8 }}>
            <Title level={3} style={{ textAlign: 'center', color: '#4CAF50', fontSize:25}}><b>Giriş yap</b></Title>
            <Form
              name="login_form"
              onFinish={handleSubmit}
              style={{ marginTop: 24 }}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Lütfen e-postanızı giriniz!' }]}
              >
                <Input
                  type="text"
                  placeholder="E-postanız"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Lütfen şifrenizi giriniz!' }]}
              >
                <Input.Password
                  placeholder="Şifreniz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderColor: '#4CAF50' }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
                  Giriş yap
                </Button>
              </Form.Item>
             <span style={{fontSize: 18}}> Hesabınız yok mu? <Button type="link" onClick={() => { navigate('/register'); }} style={{ color: '#4CAF50' , fontSize: 20}}>Kayıt olun</Button></span>
            </Form>
          </div>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Login;
