import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diaryData, setDiaryData] = useState(null);

  useEffect(() => {
    const fetchDiaryData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(
          `http://localhost:5000/api/diary/${user.id}/${today}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setDiaryData(response.data);
      } catch (error) {
        setError('Failed to fetch diary data');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryData();
  }, [user.id]);

  const macroData = [
    {
      name: 'Protein',
      target: user.macros.protein,
      consumed: diaryData?.totalProtein || 0,
    },
    {
      name: 'Carbs',
      target: user.macros.carbs,
      consumed: diaryData?.totalCarbs || 0,
    },
    {
      name: 'Fats',
      target: user.macros.fats,
      consumed: diaryData?.totalFats || 0,
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.email}!
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Calorie Goal
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h3" color="primary">
                {user.dailyCalories}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                calories
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                Consumed: {diaryData?.totalCalories || 0} calories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining: {user.dailyCalories - (diaryData?.totalCalories || 0)} calories
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Macro Targets
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body1">
                Protein: {user.macros.protein}g
              </Typography>
              <Typography variant="body1">
                Carbs: {user.macros.carbs}g
              </Typography>
              <Typography variant="body1">
                Fats: {user.macros.fats}g
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Macro Progress
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={macroData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="target" fill="#8884d8" name="Target" />
                  <Bar dataKey="consumed" fill="#82ca9d" name="Consumed" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard; 