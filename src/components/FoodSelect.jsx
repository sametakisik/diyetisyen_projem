import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Button, List, Spin, message, Typography, Space, Row, Col, Card } from 'antd';

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
let FOODS_LINK = LINK + "foods";

const today = new Date();
const day = today.getDate().toString().padStart(2, '0');
const month = (today.getMonth() + 1).toString().padStart(2, '0');
const year = today.getFullYear();

const { Title, Text } = Typography;

const FoodSelect = ({ limit, meal, selectedDate, email }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addFoods, setAddFoods] = useState([]);
  const [totalCal, setTotalCal] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(FOODS_LINK);
        setFoods(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserFoods = async () => {
      if (!selectedDate || !meal || !email) return;
  
      try {
        const MEALS_LINK = LINK + meal;
        const response = await axios.get(MEALS_LINK);
        console.log(response.data.data);
        const data = response.data.data || [];
        const filteredData = data.filter(
          item => item.userEmail === email && item.date === selectedDate
        ).map(item => JSON.parse(item.foods));
  
        
        const flattenedData = filteredData.flat();
        setAddFoods(flattenedData.map(item => ({
          foodName: item.foodName,
          foodCal: item.foodCal
        })));
  
     
        const totalCalories = flattenedData.reduce((acc, item) => acc + parseInt(item.foodCal), 0);
        setTotalCal(totalCalories);
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchUserFoods();
  }, [selectedDate, meal, email]);
  

  const saveFoods = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      message.warning('Lütfen bir tarih seçin.');
      return;
    }

    try {
      let MEALS_LINK = LINK + meal;
      const data = [[email, selectedDate, JSON.stringify(addFoods)]];
      await axios.post(MEALS_LINK,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      message.success('Öğün kaydedildi.');
    } catch (error) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else {
        console.error('Error message:', error.message);
      }
      message.error('Failed to save foods');
    }
  };

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <div>Error: {error}</div>;

  const filteredFoods = foods.filter(food =>
    food.food.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFood = (food) => {
    const foodCalori = parseInt(food.calori);
    if (totalCal + foodCalori <= limit) {
      setAddFoods([...addFoods, { foodName: food.food, foodCal: food.calori }]);
      setTotalCal(totalCal + foodCalori);
    } else {
      message.warning('Eklediğiniz yiyecek toplam kalori sınırınızı aşıyor.');
    }
  };

  const removeFoods = (index) => {
    const newList = addFoods.filter((urun, i) => i !== index);
    setAddFoods(newList);
    const removedFoodCal = parseInt(addFoods[index].foodCal);
    setTotalCal(totalCal - removedFoodCal);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card bordered={false} style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Title level={3}>
              {totalCal} cal <Button type="primary" onClick={saveFoods} style={{ float: 'right', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>Kaydet</Button>
            </Title>
            <List
              bordered
              dataSource={addFoods}
              
              renderItem={(item, index) => (
                <List.Item
                  actions={[<Button type="link" danger onClick={() => removeFoods(index)}>Kaldır</Button>]}
                >
                  <b> {item.foodName}</b> - {item.foodCal} cal
                </List.Item>
              )}
            >
              {addFoods.length === 0 && (
                <List.Item>
                  <Text>Öğün bilgisi giriniz.</Text>
                </List.Item>
              )}
            </List>
          </Card>
        </Col>
        <Col span={24}>
          <Title style={{ fontSize: 20 }}>Yiyecek Listesi</Title>
          <Input
            placeholder="Yiyecek ara"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <List
            bordered
            dataSource={filteredFoods}
            renderItem={(food, index) => (
              <List.Item
                actions={[<Button type="link" onClick={() => addFood(food)}>Ekle</Button>]}
              >
                <Text><b>{food.food}</b> - Servis: {food.service} - Kalori: {food.calori} cal</Text>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default FoodSelect;
