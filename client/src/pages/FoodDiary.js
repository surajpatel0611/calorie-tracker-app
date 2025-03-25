import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const FoodDiary = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diaryData, setDiaryData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [mealType, setMealType] = useState('breakfast');

  useEffect(() => {
    fetchDiaryData();
  }, [user.id]);

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

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/foods/search?query=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSearchResults(response.data);
    } catch (error) {
      setError('Failed to search foods');
    }
  };

  const handleAddFood = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/diary/${user.id}`,
        {
          mealType,
          foodId: selectedFood._id,
          quantity: parseFloat(quantity),
          unit: selectedFood.servingUnit,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchDiaryData();
      handleCloseDialog();
    } catch (error) {
      setError('Failed to add food to diary');
    }
  };

  const handleDeleteFood = async (foodId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/diary/${user.id}/${foodId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchDiaryData();
    } catch (error) {
      setError('Failed to delete food from diary');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedFood(null);
    setQuantity('');
    setMealType('breakfast');
  };

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
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Food Diary</Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Add Food
            </Button>
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
          <Grid item xs={12} key={meal}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </Typography>
              <List>
                {diaryData?.meals
                  ?.find((m) => m.type === meal)
                  ?.foods.map((food) => (
                    <ListItem key={food.foodId}>
                      <ListItemText
                        primary={food.name}
                        secondary={`${food.quantity} ${food.unit}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteFood(food.foodId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
              </List>
            </Paper>
          </Grid>
        ))}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Add Food</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Search Food"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ mt: 1 }}
              >
                Search
              </Button>
              <List>
                {searchResults.map((food) => (
                  <ListItem
                    key={food._id}
                    button
                    selected={selectedFood?._id === food._id}
                    onClick={() => setSelectedFood(food)}
                  >
                    <ListItemText
                      primary={food.name}
                      secondary={`${food.calories} calories per ${food.servingSize} ${food.servingUnit}`}
                    />
                  </ListItem>
                ))}
              </List>
              {selectedFood && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Meal Type</InputLabel>
                    <Select
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      label="Meal Type"
                    >
                      <MenuItem value="breakfast">Breakfast</MenuItem>
                      <MenuItem value="lunch">Lunch</MenuItem>
                      <MenuItem value="dinner">Dinner</MenuItem>
                      <MenuItem value="snack">Snack</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    margin="normal"
                    helperText={`Enter quantity in ${selectedFood.servingUnit}`}
                  />
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleAddFood}
              variant="contained"
              disabled={!selectedFood || !quantity}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Container>
  );
};

export default FoodDiary; 