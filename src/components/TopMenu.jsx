import { useState } from "react";
import { Layout, Menu, Typography, Button, Modal, Row } from 'antd';
import DieticianHomePage from "./DieticianHomePage";
import Advisors from "./Advisors";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography;

const TopMenu = () => {
    document.title = "Ana sayfa";
    const location = useLocation();
    const navigate = useNavigate();
    const { dietician_email } = location.state || {}; 
    const [currentMenu, setCurrentMenu] = useState('advisors');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleClick = (e) => {
        setCurrentMenu(e.key);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        console.log("Çıkış yapılıyor...");
        navigate('/login');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const renderContent = () => {
        switch (currentMenu) {
            case 'dietician-homepage':
                return <DieticianHomePage />;
            case 'advisors':
                return <Advisors dietician_email={dietician_email} />;
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: "#eafaf1" }}>
            <Header style={{
                backgroundColor: '#4caf50',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)'
            }}>
                <Row style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        selectedKeys={[currentMenu]}
                        onClick={handleClick}
                        style={{
                            flex: 1,
                            backgroundColor: '#4caf50',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }}
                    >
            
                        <Menu.Item key="advisors">
                            Danışanlarınız
                        </Menu.Item>
                        <Menu.Item key="dietician-homepage">
                            İstekleriniz
                        </Menu.Item>
                    </Menu>
                    <Title level={2} style={{ color: '#fff', marginRight: '550px' }}>
                        diyetisyenim.com
                    </Title>
                    <Button danger onClick={showModal}>
                        Çıkış Yap
                    </Button>
                </Row>
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
                <div style={{ flex: 1 }} />
            </Header>
            <Content style={{
                padding: '20px 50px',
                marginTop: '64px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff'
            }}>
                <div className="site-layout-content">{renderContent()}</div>
            </Content>
        </Layout>
    );
};

export default TopMenu;
