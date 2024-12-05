import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Alert, 
  AlertTitle 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send, AlertTriangle, CheckCircle } from 'lucide-react';

// Custom Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  background: 'linear-gradient(145deg, #f0f0f0 0%, #f9f9f9 100%)',
  maxWidth: 600,
  margin: '40px auto',
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const CreateAnnouncement = () => {
  // State management
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Input change handlers
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setError('');
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setError('');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required');
      return;
    }

    setLoading(true);
    try {
      // API call
      const response = await axios.post('http://localhost:5000/api/announcements', {
        subject: subject.trim(),
        message: message.trim(),
      });

      // Success handling
      setSuccess('Announcement sent successfully!');
      setSubject('');
      setMessage('');
      setError('');
    } catch (err) {
      // Error handling
      const errorMsg = err.response?.data?.error || 'There was an error sending the announcement';
      setError(errorMsg);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            fontWeight: 600, 
            color: '#003D73',
            marginBottom: 3 
          }}
        >
          Create Announcement
        </Typography>

        <StyledForm onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Subject"
            variant="outlined"
            value={subject}
            onChange={handleSubjectChange}
            required
            error={!!error}
            helperText={error && subject.trim() === '' ? 'Subject is required' : ''}
          />

          <TextField
            fullWidth
            label="Message"
            variant="outlined"
            multiline
            rows={6}
            value={message}
            onChange={handleMessageChange}
            required
            error={!!error}
            helperText={error && message.trim() === '' ? 'Message is required' : ''}
          />

          {error && (
            <Alert 
              severity="error" 
              icon={<AlertTriangle color="red" size={24} />}
            >
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              icon={<CheckCircle color="green" size={24} />}
            >
              <AlertTitle>Success</AlertTitle>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<Send size={20} />}
            disabled={loading}
            sx={{
              padding: '12px 24px',
              fontSize: '1rem',
              background: '#003D73',
              '&:hover': {
                background: '#002D53',
              },
            }}
          >
            {loading ? 'Sending...' : 'Send Announcement'}
          </Button>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
};

export default CreateAnnouncement;