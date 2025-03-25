import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUserMacros } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    dailyCalories: user.dailyCalories,
    macros: {
      protein: user.macros.protein,
      carbs: user.macros.carbs,
      fats: user.macros.fats,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('macros.')) {
      const macroType = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        macros: {
          ...prev.macros,
          [macroType]: parseInt(value) || 0,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await updateUserMacros(user.id, formData.dailyCalories, formData.macros);
      setSuccess('Profile updated successfully');
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Profile Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Daily Calorie Goal
              </Typography>
              <TextField
                fullWidth
                label="Daily Calories"
                name="dailyCalories"
                type="number"
                value={formData.dailyCalories}
                onChange={handleChange}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Macro Targets
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Protein (g)"
                    name="macros.protein"
                    type="number"
                    value={formData.macros.protein}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Carbs (g)"
                    name="macros.carbs"
                    type="number"
                    value={formData.macros.carbs}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Fats (g)"
                    name="macros.fats"
                    type="number"
                    value={formData.macros.fats}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile; 