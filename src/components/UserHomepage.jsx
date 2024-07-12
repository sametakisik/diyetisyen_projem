import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Card, Spin, Alert, DatePicker, Button, Modal, message as antdMessage, Modal as AntdModal, } from 'antd';
import { useUserContext } from './UserContext';
import FoodSelect from "./FoodSelect";
import moment from 'moment'; 
import { Header } from "antd/es/layout/layout";

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";

const USERS_LINK = LINK + 'users';
const MEALS_LINK = LINK + 'meals';
const DIETICIAN_LINK = LINK + "dietician"
const RELATION_LINK = LINK + "relation"


const UserHomepage = () => {
    document.title = "Ana sayfa"
    const location = useLocation();
    const navigate = useNavigate();
    const { _user, _dietician } = location.state;
    const [user, setUser] = useState(null);
    const [breakfastLimit, setBreakfastLimit] = useState(0);
    const [lunchLimit, setLunchLimit] = useState(0);
    const [dinnerLimit, setDinnerLimit] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD")); 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAdvisorModalVisible, setIsAdvisorModalVisible] = useState(false); 
    const { email, setEmail } = useUserContext();
    const [dietician, setDietician] = useState([])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(USERS_LINK);
                const userInfo = userResponse.data.data.find(
                    (item) => item.email === _user.email
                );
                setUser(userInfo || null);

                const mealsResponse = await axios.get(MEALS_LINK);
                const mealsLimits = mealsResponse.data.data.find(
                    (item) => item.userEmail === _user.email
                );

                
                if (mealsLimits) {
                    setBreakfastLimit(mealsLimits.breakfast || 0);
                    setLunchLimit(mealsLimits.lunch || 0);
                    setDinnerLimit(mealsLimits.dinner || 0);
                }

                setLoading(false);

                const dieticianResponse = await axios.get(DIETICIAN_LINK)
                const dieticiann = dieticianResponse.data.data.find(
                    (item) => item.email === _dietician.dieticianEmail 
                );
                setDietician(dieticiann)


            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Veriler yüklenirken bir hata oluştu.");
                setLoading(false);
            }
        };

        fetchData();
    }, [_user.email, selectedDate]); 

    const handleDateChange = (date, dateString) => {
        setSelectedDate(dateString);
    };

    const disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    const showAdvisorModal = () => {
        setIsAdvisorModalVisible(true);
    };

    const handleAdvisorOk = () => {
        setIsAdvisorModalVisible(false);
    };



    const handleAdvisorCancel = async () => {
        AntdModal.confirm({
            title: 'Danışmanlığı Bitirmek İstediğinize Emin Misiniz?',
            content: 'Danışmanlık işlemini bitirdiğinizde, bu işlemi geri alamazsınız.',
            okText: 'Evet',
            cancelText: 'Hayır',
            onOk: async () => {
                try {
                    const data = { ..._dietician, state: "Bitirildi" };
                    await axios.put(RELATION_LINK, data);
                    antdMessage.success('Danışmanlık bitirildi.');
                    setIsAdvisorModalVisible(false);
                    navigate("/request-dietician", { state: { user: user } })
                } catch (error) {
                    antdMessage.error('Bir hata oluştu.');
                }
            },
            onCancel: () => {
                
            },
            okButtonProps:{ style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' } },
            cancelButtonProps:{ style: { backgroundColor: '#fff', borderColor: '#4CAF50', color: "#4CAF50" } }
                   
        });
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Alert message={error} type="error" /></div>;
    }

    if (!user) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Alert message="Kullanıcı bilgileri bulunamadı." type="warning" /></div>;
    }

    const handleLogout = () => {
        setEmail('');
        navigate('/login');
    };

    const showLogoutModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        handleLogout();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ backgroundColor: '#f0f8f0', minHeight: '100vh' }}>
            <div style={{ 
                backgroundColor: '#4caf50', 
                color: '#fff', 
                padding: '10px 20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                position: 'fixed', 
                top: 0, 
                width: '100%',
                zIndex: 1,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)' 
                
            }}>
                <Row style={{ width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div>
                        <span style={{ fontSize: 20 }}>Merhaba {_user.name} {_user.surname}!  </span>
                        <Button style={{ color: "#4caf50", borderColor: "#4caf50" }} onClick={() => navigate("/profile", { state: { users: user } })}>Profil bilgileriniz</Button>
                        <Button style={{ color: "#4caf50", borderColor: "#4caf50", marginLeft: '10px' }} onClick={showAdvisorModal}>Danışman Bilgileri</Button>
                    </div>
                    
                    <h1 style={{ margin: 0, marginRight: 200 }}>diyetisyenim.com</h1>
                    
                    <Button danger onClick={showLogoutModal}>Çıkış Yap</Button>
                </Row>
            </div>
            <div style={{ padding: '20px', paddingTop: '80px' }}> 
                <DatePicker 
                    required
                    onChange={handleDateChange} 
                    style={{ marginBottom: '20px', display: 'block' }} 
                    format="YYYY-MM-DD" 
                    value={selectedDate ? moment(selectedDate) : null}
                    disabledDate={disabledDate} 
                />
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Kahvaltı" bordered={false}>
                            <h3>Sınırınız: {breakfastLimit}</h3>
                            <FoodSelect limit={breakfastLimit} meal="breakfast" selectedDate={selectedDate} email={_user.email} />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Öğle Yemeği" bordered={false}>
                            <h3>Sınırınız: {lunchLimit}</h3>
                            <FoodSelect limit={lunchLimit} meal="lunch" />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Akşam Yemeği" bordered={false}>
                            <h3>Sınırınız: {dinnerLimit}</h3>
                            <FoodSelect limit={dinnerLimit} meal="dinner" />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="Danışman Bilgileri"
                    visible={isAdvisorModalVisible}
                    onOk={handleAdvisorOk}
                    onCancel={handleAdvisorCancel}
                    okText="Tamam"
                    cancelText="Danışmanlığı Bitir"
                    okButtonProps={{ style: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' } }}
                    cancelButtonProps={{ style: { backgroundColor: '#fff', borderColor: '#4CAF50', color: "#4CAF50" } }}

                >
                    <p>Adı:<b> {dietician.name} </b></p> 
                    <p>Soyadı:<b> {dietician.surname} </b></p> 
                </Modal>
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
}

export default UserHomepage;
