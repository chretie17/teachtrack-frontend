import React, { useState, useEffect } from 'react';
import apiService from '../Api';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const TeacherSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [qrImage, setQrImage] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const teacherId = localStorage.getItem('user_id');
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/teacher/${teacherId}`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showAlert('Failed to fetch classes. Please try again later.', 'error');
    }
  };

  const handleGenerateQRCode = async () => {
    const teacherId = localStorage.getItem('user_id');
    if (!selectedClass) {
      showAlert('Please select a valid class.', 'warning');
      return;
    }

    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/generate-qrcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          class_id: selectedClass,
        }),
      });

      const data = await response.json();

      if (data.qrCodeUrl) {
        console.log('QR Code Data:', data.qrCodeUrl);
        setQrImage(data.qrCodeUrl);
        showAlert('QR Code generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      showAlert('Failed to generate QR code. Please try again.', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 6000);
  };

  return (
    <Container>
      <Header>
        <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" color="#00447B" />
        <Title>My Class Schedule</Title>
      </Header>

      <Content>
        <ScheduleSection>
          <SectionTitle>Class Schedule</SectionTitle>
          <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.course_name} ({classItem.course_code})
              </option>
            ))}
          </Select>
          <Button onClick={handleGenerateQRCode}>
            <FontAwesomeIcon icon={faQrcode} /> Generate QR Code
          </Button>
        </ScheduleSection>

        {qrImage && (
          <QRCodeSection>
            <QRCodeImage src={qrImage} alt="QR Code" />
            <QRCodeText>Scan the QR code to mark attendance.</QRCodeText>
          </QRCodeSection>
        )}
      </Content>

      {alert.show && <Alert type={alert.type}>{alert.message}</Alert>}
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #00447B;
  margin-left: 15px;
`;

const Content = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScheduleSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #00447B;
  margin-bottom: 15px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #00447B;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003366;
  }
`;

const QRCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

const QRCodeImage = styled.img`
  width: 200px;
  height: 200px;
  border: 2px solid #00447B;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const QRCodeText = styled.p`
  color: #00447B;
  font-weight: bold;
`;

const Alert = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  background-color: ${props => 
    props.type === 'error' ? '#f8d7da' :
    props.type === 'success' ? '#d4edda' :
    props.type === 'warning' ? '#fff3cd' : '#cce5ff'};
  color: ${props => 
    props.type === 'error' ? '#721c24' :
    props.type === 'success' ? '#155724' :
    props.type === 'warning' ? '#856404' : '#004085'};
`;

export default TeacherSchedule;