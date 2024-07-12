import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from './UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Button, Typography, message, Input, Modal, Row } from 'antd';

const { Title } = Typography;

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
let RELATION_LINK = LINK + 'relation';
const DIETICIAN_LINK = LINK + "dietician";

const RequestDietician = () => {
    document.title = "Ana sayfa"
    const location = useLocation();
    const navigate = useNavigate();
    const { user_email ,user} = location.state;
    const [dieticians, setDieticians] = useState([]);
    const [filteredDieticians, setFilteredDieticians] = useState([]);
    const { email, setEmail } = useUserContext(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false); 

    useEffect(() => {
        const fetchDieticians = async () => {
            try {
                const response = await axios.get(DIETICIAN_LINK);
                console.log(response.data.data);
                const dieticiansData = response.data.data.map(dietician => ({
                    ...dietician,
                    requested: false,
                }));
                setDieticians(dieticiansData);
                setFilteredDieticians(dieticiansData);
            } catch (error) {
                message.error('Diyetisyenler alınırken bir hata oluştu.');
            }
        };
        fetchDieticians();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        const filtered = dieticians.filter(dietician =>
            dietician.name.toLowerCase().includes(value.toLowerCase()) ||
            dietician.surname.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDieticians(filtered);
    };

    const handleRequest = async (index) => {
        const dietician = filteredDieticians[index];
        const dietician_email = dietician.email;
        const data = [[user_email ? user_email : user.email, dietician_email, "Bekliyor"]];
        console.log(data)
        try {
            
            await axios.post(RELATION_LINK, data);
            setFilteredDieticians(prevDieticians =>
                prevDieticians.map((d, i) =>
                    i === index ? { ...d, requested: true } : d
                )
            );

            message.success('Diyetisyen isteği gönderildi.');
        } catch (error) {
            message.error('İstek gönderilirken bir hata oluştu.');
        }
    };

    const handleCancelRequest = async (index) => {
        try {
            const dietician = filteredDieticians[index];
            const dietician_email = dietician.email;

            const response = await axios.get(RELATION_LINK);
            console.log(response.data.data);

            const relation = response.data.data.find(
                (item) =>
                    item.userEmail === user_email &&
                    item.dieticianEmail === dietician_email &&
                    item.state === "Bekliyor"
            );
            
            if (!relation) {
                message.error('İlişki bulunamadı.');
                return;
            }

            await axios.delete(`${RELATION_LINK}&row_id=${relation.row_id}`)
    
            setFilteredDieticians((prevDieticians) =>
                prevDieticians.map((d, i) =>
                    i === index ? { ...d, requested: false } : d
                )
            );
            message.success('Diyetisyen isteği iptal edildi.');
        } catch (error) {
            console.error('Error cancelling request:', error);
            message.error('İstek iptal edilirken bir hata oluştu.');
        }
    };

    const fetchRelation = async (index) => {
        try {
            const response = await axios.get(RELATION_LINK);
            const relations = response.data.data;
        
            const dietician = filteredDieticians[index];
            const dietician_email = dietician.email;
            const relation = relations.find(
                (relation) => relation.userEmail === user_email && relation.dieticianEmail === dietician_email
            );

            if (!relation) {
                handleRequest(index);
            } else {
                message.warning('Bu diyetisyen ile zaten bir isteğiniz var.');
            }
        } catch (error) {
            console.error("Hata oluştu:", error);
            message.error('İlişkiler alınırken bir hata oluştu.');
        }
    };

    const handleLogout = () => {
        setEmail('');
        navigate('/login');
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        handleLogout();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
console.log(user)
    return (
        <div style={{ backgroundColor: '#f0f8f0', minHeight: '100vh' }}>
            <div style={{ backgroundColor: '#4caf50', color: '#fff', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)'  }}>
                <Row style={{ width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div>
                    <span style={{fontSize:20 }}>Merhaba {user.name} {user.surname}!  </span>
                    <Button style={{ color: "#4caf50", borderColor: "#4caf50" }} onClick={()=>navigate("/profile", { state: {users:user }} )}>Profil bilgileriniz</Button>
                    </div>
                    
                    <h1 style={{ margin: 0, marginRight:200 }}>diyetisyenim.com</h1>
                    
                    <Button danger onClick={showModal}>Çıkış Yap</Button>
                </Row>
            </div>
            <h1 style={{textAlign:'center', color: "#508D4E"}}>Diyetisyeniniz bulunmadığı için aşağıdan diyetisyenlere istek gönderebilirsiniz.</h1>
            <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '1200px', margin: '20px auto' }}>
                <Input
                    placeholder="Diyetisyen adını veya soyadını ara"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ marginBottom: '20px' }}
                />
                <List
                    bordered
                    dataSource={filteredDieticians}
                    renderItem={(dietician, index) => (
                        <List.Item actions={[
                            dietician.requested ?
                                <Button type="danger"  style={{ color: '#f00' }} onClick={() => handleCancelRequest(index)}>İsteği İptal Et</Button> :
                                <Button type="primary" style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} onClick={() => fetchRelation(index)} >İstek gönder</Button>
                                
                        ]}>
                            {dietician.name} {dietician.surname}
                        </List.Item>
                    )}
                />
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
        </div>
    );
};

export default RequestDietician;
