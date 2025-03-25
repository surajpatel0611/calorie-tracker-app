import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimelineIcon from '@mui/icons-material/Timeline';
import PersonIcon from '@mui/icons-material/Person';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      title: 'Track Your Calories',
      description: 'Log your daily food intake and monitor your calorie consumption.',
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Monitor Macros',
      description: 'Track your protein, carbs, and fats to achieve your fitness goals.',
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Progress Tracking',
      description: 'View your progress over time with detailed charts and analytics.',
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Personalized Goals',
      description: 'Set and adjust your calorie and macro goals based on your needs.',
      icon: <PersonIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Welcome to Calorie Tracker
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Your personal nutrition companion for achieving your health and fitness goals
          </Typography>
          {!user && (
            <Box display="flex" justifyContent="center" gap={2} mt={4}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
                size="large"
              >
                Get Started
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                color="inherit"
                size="large"
              >
                Login
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mb={2}
                    color="primary.main"
                  >
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  {!user && (
                    <Button
                      component={RouterLink}
                      to="/register"
                      size="small"
                      color="primary"
                    >
                      Learn More
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
              Why Choose Our Calorie Tracker?
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Easy to Use
                </Typography>
                <Typography paragraph>
                  Our intuitive interface makes it simple to log your meals and track your progress.
                  Search for foods, add them to your diary, and monitor your daily intake with ease.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Comprehensive Tracking
                </Typography>
                <Typography paragraph>
                  Track not just calories, but also macronutrients (protein, carbs, and fats) to ensure
                  you're meeting your nutritional goals.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Personalized Goals
                </Typography>
                <Typography paragraph>
                  Set your own calorie and macro targets based on your fitness goals, whether you want
                  to lose, maintain, or gain weight.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Progress Visualization
                </Typography>
                <Typography paragraph>
                  View your progress through interactive charts and graphs, making it easy to see how
                  you're progressing towards your goals.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 