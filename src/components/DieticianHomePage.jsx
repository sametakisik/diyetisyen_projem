import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Button, Layout, Typography, message } from 'antd';

const { Content } = Layout;

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
let USERS_LINK = LINK + "users";
let RELATION_LINK = LINK + "relation";

const DieticianHomePage = () => {
  document.title = "Ana sayfa";
  const location = useLocation();
  const { dietician_email } = location.state;
  const [requests, setRequests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(RELATION_LINK);
        const responseUsers = await axios.get(USERS_LINK);

        const filteredRequests = response.data.data.filter(
          (item) =>
            item.dieticianEmail === dietician_email && item.state === "Bekliyor"
        );

        const filteredUsers = responseUsers.data.data.filter((user) =>
          filteredRequests.some((request) => request.userEmail === user.email)
        );

        setRequests(filteredRequests);
        setFilteredUsers(filteredUsers);
      } catch (error) {
        message.error("Veri getirme hatası: " + error.message);
      }
    };
    fetchData();
  }, [dietician_email]);

  const handleAccept = async (index) => {
    try {
      const response = await axios.get(RELATION_LINK);
      const currentData = response.data.data;

      const requestToUpdate = requests[index];
      const currentRow = currentData.find(item => item.row_id === requestToUpdate.row_id);

      if (currentRow) {
        currentRow.state = "Kabul edildi";
        await axios.put(RELATION_LINK, currentRow);

        setRequests(prevRequests =>
          prevRequests.map((req, i) =>
            i === index ? { ...req, state: "Kabul edildi" } : req
          )
        );
        setFilteredUsers(prevUsers =>
          prevUsers.filter((_, i) => i !== index)
        );
        message.success('İstek kabul edildi.');
      } else {
        console.error("İlgili kayıt bulunamadı.");
      }
    } catch (error) {
      console.error("Hata: ", error);
    }
  };

  const handleRemove = async (index) => {
    try {
      const response = await axios.get(RELATION_LINK);
      const currentData = response.data.data;

      const requestToUpdate = requests[index];
      const currentRow = currentData.find(item => item.row_id === requestToUpdate.row_id);

      if (currentRow) {
        currentRow.state = "Reddedildi";
        await axios.put(RELATION_LINK, currentRow);

        setRequests(prevRequests =>
          prevRequests.filter((_, i) => i !== index)
        );
        setFilteredUsers(prevUsers =>
          prevUsers.filter((_, i) => i !== index)
        );
        message.success('İstek reddedildi.');
      } else {
        console.error("İlgili kayıt bulunamadı.");
      }
     
    } catch (error) {
      console.error("Hata: ", error);
    }
  };

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
      render: (_, record, index) => (
        <>
          <Button type="primary" onClick={() => handleAccept(index)} style={{ marginRight: 8, backgroundColor:"#4CAF50" }}>
            Kabul et
          </Button>
          <Button danger onClick={() => handleRemove(index)}>
            Sil
          </Button>
        </>
      ),
    },
  ];

  const data = filteredUsers.map((user, index) => ({
    key: index,
    name: user.name,
    surname: user.surname,
    age: user.age,
    height: user.height,
    weight: user.weight,
    gender: user.gender,
  }));

  return (
    <Content style={{ padding: '0 50px', marginTop: 64 }}>
      <h1 style={{textAlign:'center', color: "#508D4E"}}>Aşağıdaki listeden size gelen istekleri değerlendirebilirsiniz.</h1>
      <Table columns={columns} dataSource={data} locale={{ emptyText: 'İsteğiniz yok' }} />
    </Content>
  );
};

export default DieticianHomePage;
