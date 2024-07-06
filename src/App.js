import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
// ************************ firebase ****************
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeLt2DnhCZekuBMj7HnCrFcqGV-fcDmiA",
  authDomain: "catch-game-58cba.firebaseapp.com",
  projectId: "catch-game-58cba",
  storageBucket: "catch-game-58cba.appspot.com",
  messagingSenderId: "987525706492",
  appId: "1:987525706492:web:d542d4b6a9c895d56bdd79",
  measurementId: "G-J6SZY6DDWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// ************************ firebase ****************
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #000;
    color: #fff;
  }
  .react-calendar {
    width: 100%;
    border: none;
    background-color: #fff;
    color: #000;
  }
  .highlight {
    background: #007bff !important;
    border-radius: 50%;
    color: #fff;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideLeftRightPause = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    transform: translateX(0);
    opacity: 1;
  }
  70% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 20px;
  animation: ${slideIn} 0.5s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 250px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 10px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
`;

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const CalendarContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-left: 20px;
`;

const LogList = styled.div`
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-right: 20px;
  color: #000;
`;

const LogItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ccc;
  font-size: 1.2rem;
  &:last-child {
    border-bottom: none;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  color: black;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  text-align: center;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin: 10px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0056b3;
  }
`;

const ConfirmationMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 4rem;
  color: #007bff;
  animation: ${slideLeftRightPause} 2s ease-out;
  transform: translateY(-50%);
`;

const App = () => {
  const [logs, setLogs] = useState([]);
  const [calendarLogs, setCalendarLogs] = useState([]);
  const [inputDate, setInputDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingLog, setPendingLog] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('https://back-catch-game.onrender.com/log');
      setLogs(response.data);
      setCalendarLogs(response.data.map(log => new Date(log.timestamp)));
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleButtonClick = () => {
    const log = { timestamp: inputDate ? new Date(inputDate).toISOString() : new Date().toISOString() };
    setPendingLog(log);
    setShowModal(true);
  };

  const handleConfirmLog = async () => {
    try {
      await axios.post('https://back-catch-game.onrender.com/log', pendingLog);
      fetchLogs();
      setInputDate('');
      setShowModal(false);
      setPendingLog(null);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 2000);
    } catch (error) {
      console.error('Error logging press:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputDate(e.target.value);
  };

  const handleDayClick = (value) => {
    setSelectedDate(value);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('default', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(date));
  };

  const logsForSelectedDate = logs.filter(log => {
    return new Date(log.timestamp).toDateString() === selectedDate?.toDateString();
  });

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>The Catch Game</Title>
        <InputContainer>
          <Input
            type="datetime-local"
            value={inputDate}
            onChange={handleInputChange}
          />
          <Button onClick={handleButtonClick}>Log Press</Button>
        </InputContainer>
        <MainContent>
          <LogList>
            <h3>Logs:</h3>
            {logs.map((log, index) => (
              <LogItem key={index}>{new Date(log.timestamp).toDateString()} - {formatTime(log.timestamp)}</LogItem>
            ))}
          </LogList>
          <CalendarContainer>
            <Calendar
              onClickDay={handleDayClick}
              tileClassName={({ date }) =>
                calendarLogs.some(d => d.toDateString() === date.toDateString()) ? 'highlight' : null
              }
            />
          </CalendarContainer>
        </MainContent>
      </Container>
      {showModal && (
        <ModalBackground>
          <Modal>
            <h2>Confirm Log</h2>
            <p>Are you sure you want to log this entry?</p>
            <p>{pendingLog && new Date(pendingLog.timestamp).toLocaleString()}</p>
            <ModalButton onClick={handleConfirmLog}>Confirm</ModalButton>
            <ModalButton onClick={() => setShowModal(false)}>Cancel</ModalButton>
          </Modal>
        </ModalBackground>
      )}
      {showConfirmation && (
        <ConfirmationMessage>
          Good Catch! 👍
        </ConfirmationMessage>
      )}
    </>
  );
};

export default App;
