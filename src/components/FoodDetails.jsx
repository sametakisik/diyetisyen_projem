import React, { useEffect, useState } from 'react';
import { DatePicker, ConfigProvider, message } from 'antd';
import moment from 'moment';
import 'moment/locale/tr';
import axios from 'axios';

let LINK = "https://v1.nocodeapi.com/bartiko/google_sheets/eVSPsvgPMphfHDCv?tabId=";
const BREAKFAST_LINK = LINK + 'breakfast';
const LUNCH_LINK = LINK + 'lunch';
const DINNER_LINK = LINK + 'dinner';

const FoodDetails = ({ selectedUser, breakfast, lunch, dinner }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [breakfastDetails, setBreakfastDetails] = useState([]);
  const [lunchDetails, setLunchDetails] = useState([]);
  const [dinnerDetails, setDinnerDetails] = useState([]);


  const disableFutureDates = (current) => {
    return current && current > moment().endOf('day');
  };


  const handleDateChange = (date) => {
    setSelectedDate(date); 
    console.log('Seçilen Tarih:', date ? date.format('YYYY-MM-DD') : 'Tarih seçilmedi');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate) return; 

      try {
        const breakfastResponse = await axios.get(BREAKFAST_LINK);
        const lunchResponse = await axios.get(LUNCH_LINK);
        const dinnerResponse = await axios.get(DINNER_LINK);

  
        console.log('Kahvaltı Yanıtı:', breakfastResponse.data.data);
        console.log('Öğle Yemeği Yanıtı:', lunchResponse.data.data);
        console.log('Akşam Yemeği Yanıtı:', dinnerResponse.data.data);

        const filteredBreakfast = breakfastResponse.data.data.filter(
          (item) =>
            item.userEmail === selectedUser.email && item.date === selectedDate.format('YYYY-MM-DD')
        );
        const filteredLunch = lunchResponse.data.data.filter(
          (item) =>
            item.userEmail === selectedUser.email && item.date === selectedDate.format('YYYY-MM-DD')
        );
        const filteredDinner = dinnerResponse.data.data.filter(
          (item) =>
            item.userEmail === selectedUser.email && item.date === selectedDate.format('YYYY-MM-DD')
        );

        console.log('Filtrelenmiş Kahvaltı Detayları:', filteredBreakfast);
        console.log('Filtrelenmiş Öğle Yemeği Detayları:', filteredLunch);
        console.log('Filtrelenmiş Akşam Yemeği Detayları:', filteredDinner);

        const parsedBreakfastDetails = filteredBreakfast.flatMap(item => JSON.parse(item.foods));
        const parsedLunchDetails = filteredLunch.flatMap(item => JSON.parse(item.foods));
        const parsedDinnerDetails = filteredDinner.flatMap(item => JSON.parse(item.foods));
        setBreakfastDetails(parsedBreakfastDetails);
        setLunchDetails(parsedLunchDetails);
        setDinnerDetails(parsedDinnerDetails);
      } catch (error) {
        message.error('Veri getirme hatası: ' + error.message);
      }
    };

    fetchData();
  }, [selectedDate, selectedUser.email]); 

  const totalCalories = breakfastDetails.reduce((total, item) => total + item.foodCal, 0);
  return (
    <ConfigProvider locale="tr">
      <div style={{ padding: '20px' }}>
        <h1>{selectedUser.name} {selectedUser.surname}</h1>
        <DatePicker
          defaultValue={moment()}
          disabledDate={disableFutureDates}
          onChange={handleDateChange}
          style={{ width: '100%' }}
        />
        {selectedDate && (
          <p>Seçilen Tarih: {selectedDate.format('YYYY-MM-DD')}</p>
        )}
        <div>
          <h2>Kahvaltı Detayları: {breakfast}</h2>
          <ul>
            {breakfastDetails.length > 0 ? (
              breakfastDetails.map((item, index) => (
                <li key={index}>
                  {item.foodName} - {item.foodCal} kalori
                </li>
              )
              )
            ) :

              (
                <li>Kahvaltı detayları bulunamadı.</li>
              )}
          </ul>
        </div>
        <div>
          <h2>Öğle Yemeği Detayları: {lunch}</h2>
          <ul>
            {lunchDetails.length > 0 ? (
              lunchDetails.map((item, index) => (
                <li key={index}>
                  {item.foodName} - {item.foodCal} Kalori
                </li>
              ))
            ) : (
              <li>Öğle yemeği detayları bulunamadı.</li>
            )}
          </ul>
        </div>
        <div>
          <h2>Akşam Yemeği Detayları: {dinner}</h2>
          <ul>
            {dinnerDetails.length > 0 ? (
              dinnerDetails.map((item, index) => (
                <li key={index}>
                  {item.foodName} - {item.foodCal} Kalori
                </li>
              ))
            ) : (
              <li>Akşam yemeği detayları bulunamadı.</li>
            )}
          </ul>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default FoodDetails;
