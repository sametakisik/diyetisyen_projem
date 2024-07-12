import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Layout, Input, message, Modal as AntdModal } from 'antd';
import emailjs from 'emailjs-com';
import moment from 'moment';
import FoodDetails from './FoodDetails';

const { Content } = Layout;

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
let USERS_LINK = LINK + 'users';
let RELATION_LINK = LINK + 'relation';
let MEALS_LINK = LINK + 'meals';

const Advisors = ({ dietician_email }) => {
  document.title = "Ana sayfa"
  const [requests, setRequests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [breakfast, setBreakfast] = useState(0);
  const [lunch, setLunch] = useState(0);
  const [dinner, setDinner] = useState(0);
  const [userMeals, setUserMeals] = useState({
    breakfast: breakfast,
    lunch: lunch,
    dinner: dinner
  });
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      const fetchData = async () => {
        try {
          const response = await axios.get(MEALS_LINK);
          const filteredRequests = response.data.data.filter(
            (item) =>
              item.dieticianEmail === dietician_email && item.userEmail === selectedUser.email
          );

          if (filteredRequests.length > 0) {
            const mealData = filteredRequests[0];
            setBreakfast(mealData.breakfast);
            setLunch(mealData.lunch);
            setDinner(mealData.dinner);
            setUserMeals({
              breakfast: mealData.breakfast,
              lunch: mealData.lunch,
              dinner: mealData.dinner
            });
          } else {
            setUserMeals({
              breakfast: 0,
              lunch: 0,
              dinner: 0
            });
          }
        } catch (error) {
   
        }
      };
      fetchData();
    }
  }, [selectedUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(RELATION_LINK);
        const responseUsers = await axios.get(USERS_LINK);

        const filteredRequests = response.data.data.filter(
          (item) =>
            item.dieticianEmail === dietician_email && item.state === 'Kabul edildi'
        );

        const filteredUsers = responseUsers.data.data.filter((user) =>
          filteredRequests.some((request) => request.userEmail === user.email)
        );

        setRequests(filteredRequests);
        setFilteredUsers(filteredUsers);
      } catch (error) {
  
      }
    };
    fetchData();
  }, [dietician_email]);

  const columns = [
    {
      title: 'Adı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Soyadı',
      dataIndex: 'surname',
      key: 'surname',
    },
    {
      title: 'Yaş',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Boy',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'Kilo',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Cinsiyet',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Aksiyon',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="primary" style={{ backgroundColor: "#4caf50", borderColor: "#4caf50" }} onClick={() => handleOpenModal(record)}>
            İncele
          </Button>
          <Button style={{ marginLeft: '8px' }} onClick={() => handleOpenDetailsModal(record)}>
            Öğün Detaylarını Gör
          </Button>
        </>
      ),
    },
  ];

  const data = filteredUsers
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((user, index) => ({
      key: index,
      name: user.name,
      surname: user.surname,
      age: user.age,
      height: user.height,
      weight: user.weight,
      gender: user.gender,
      breakfast: user.breakfast,
      lunch: user.lunch,
      dinner: user.dinner,
      email: user.email
    }));

  const handleOpenModal = async (record) => {
    setSelectedUser(record);
    setModalVisible(true);

    try {
      const userDetailResponse = await axios.get(`${USERS_LINK}/${record.key}`);
      setUserMeals({
        breakfast: userDetailResponse.data.data.breakfast,
        lunch: userDetailResponse.data.data.lunch,
        dinner: userDetailResponse.data.data.dinner,
      });
    } catch (error) {
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedUser(null);
    setUserMeals({
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserMeals({
      ...userMeals,
      [name]: value
    });
  };

  const updateUserMeals = async () => {
    try {
      const updatedUser = [[dietician_email, selectedUser.email, userMeals.breakfast, userMeals.lunch, userMeals.dinner]];
      await axios.post(MEALS_LINK, updatedUser);
      message.success('Öğün bilgileri güncellendi');
    } catch (error) {
      message.error('Öğün bilgileri güncelleme hatası:', error);
    }
  };

  const handleOpenDetailsModal = (record) => {
    setSelectedUser(record);
    setDetailsModalVisible(true);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalVisible(false);
    setSelectedUser(null);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  const sendEmail = async () => {
    try {
      const usersInfo = filteredUsers.map(user => `
        <p>
          <strong>Adı:</strong> ${user.name}<br/>
          <strong>Soyadı:</strong> ${user.surname}<br/>
          <strong>Yaş:</strong> ${user.age}<br/>
          <strong>Boy:</strong> ${user.height}<br/>
          <strong>Kilo:</strong> ${user.weight}
        </p>
      `).join('');

  
      const templateParams = {
        to_email: dietician_email,
        from_name: 'Dietician App',
        subject: 'Danışan Bilgileri',
        message_html: `
          <h2>Danışan Bilgileri</h2>
          ${usersInfo}
        `
      };
  
      await emailjs.send('service_b9w0yik', 'template_lqbi4k3', templateParams, 'AhOXFAukw5KjxVWkd');
      message.success('E-posta başarıyla gönderildi.');
    } catch (error) {
      message.error('E-posta gönderme hatası:', error);
    }
  };

  const handleAdvisorCancel = async () => {
    AntdModal.confirm({
      title: 'Danışmanlığı Bitirmek İstediğinize Emin Misiniz?',
      content: 'Danışmanlık işlemini bitirdiğinizde, bu işlemi geri alamazsınız.',
      okText: 'Evet',
      cancelText: 'Hayır',
      okButtonProps: {
        style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }
      },
      onOk: async () => {
        try {
          const x = requests.find(
            (item) => item.userEmail === selectedUser.email
          );
          const data = { ...x, state: "Bitirildi" };
          await axios.put(RELATION_LINK, data);

          message.success('Danışmanlık bitirildi.');

          setRequests((prevRequests) =>
            prevRequests.filter((item) => item.userEmail !== selectedUser.email)
          );
          setFilteredUsers((prevUsers) =>
            prevUsers.filter((user) => user.email !== selectedUser.email)
          );

          setModalVisible(false);
        } catch (error) {
          message.error('Bir hata oluştu.');
        }
      },
      onCancel: () => {
      }
    });
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#eafaf1' }}>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <div>
          <h1 style={{ textAlign: 'center', color: "#508D4E" }}>Danışanlarınız</h1>
          <Input
            placeholder="Danışan Ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Button 
            type="primary" 
            style={{ marginBottom: '20px', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} 
            onClick={sendEmail}
          >
            Tüm Danışanları E-posta ile Gönder
          </Button>
          <Table columns={columns} dataSource={data} locale={{ emptyText: 'Danışanınız yok' }} />

          <AntdModal
            title="Kullanıcı Detayları"
            visible={modalVisible}
            onCancel={handleModalClose}
            footer={[
              <Button key="endAdvisory" danger onClick={handleAdvisorCancel}>
                Danışmanlığı Bitir
              </Button>,
              <Button key="cancel" onClick={handleModalClose}>
                İptal
              </Button>,
              <Button key="submit" type="primary" style={{ backgroundColor: "#4caf50", borderColor: "#4caf50" }} onClick={updateUserMeals}>
                Kaydet
              </Button>,
              <Button key="sendEmail" type="default" onClick={sendEmail}>
                E-posta Gönder
              </Button>
            ]}
          >
            {selectedUser && (
              <div>
                <p><strong>Adı:</strong> {selectedUser.name}</p>
                <p><strong>Soyadı:</strong> {selectedUser.surname}</p>
                <p><strong>Yaş:</strong> {selectedUser.age}</p>
                <p><strong>Boy:</strong> {selectedUser.height}</p>
                <p><strong>Kilo:</strong> {selectedUser.weight}</p>
                <p><strong>Cinsiyet:</strong> {selectedUser.gender}</p>

                <h3>Öğün Bilgileri:</h3>
                <p>
                  <strong>Kahvaltı:</strong>
                  <Input
                    type="number"
                    value={userMeals.breakfast}
                    onChange={handleChange}
                    name="breakfast"
                  />
                </p>
                <p>
                  <strong>Öğle Yemeği:</strong>
                  <Input
                    type="number"
                    value={userMeals.lunch}
                    onChange={handleChange}
                    name="lunch"
                  />
                </p>
                <p>
                  <strong>Akşam Yemeği:</strong>
                  <Input
                    type="number"
                    name="dinner"
                    value={userMeals.dinner}
                    onChange={handleChange}
                  />
                </p>
              </div>
            )}
          </AntdModal>

          <AntdModal
            title="Öğün Detayları"
            visible={detailsModalVisible}
            onCancel={handleDetailsModalClose}
            footer={[
              <Button key="cancel" danger onClick={handleDetailsModalClose}>
                Kapat
              </Button>,
            ]}
          >
            <FoodDetails selectedUser={selectedUser} breakfast={breakfast} lunch={lunch} dinner={dinner}></FoodDetails>
          </AntdModal>
        </div>
      </Content>
    </Layout>
  );
};

export default Advisors;
