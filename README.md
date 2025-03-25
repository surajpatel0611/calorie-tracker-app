# Calorie Tracker App

A comprehensive web application for tracking calories and macronutrients to help users achieve their health and fitness goals.

## Features

- User authentication (register/login)
- Calculate daily calorie needs based on:
  - Height
  - Weight
  - Age
  - Gender
  - Activity level
  - Fitness goal (lose/maintain/gain weight)
- Track daily food intake
- Search and add foods to your diary
- Monitor macronutrient intake (protein, carbs, fats)
- Adjust calorie and macro goals
- View progress through interactive charts

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd calorie-tracker-app
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/calorie-tracker
JWT_SECRET=your-secret-key-here
PORT=5000
```

## Running the Application

1. Start MongoDB on your local machine

2. Start the backend server:
```bash
npm run dev
```

3. In a new terminal, start the frontend development server:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Users
- POST /api/users/register - Register a new user
- POST /api/users/login - Login user
- PUT /api/users/macros/:userId - Update user macros

### Foods
- GET /api/foods - Get all foods
- GET /api/foods/search - Search foods
- POST /api/foods - Add new food
- PUT /api/foods/:id - Update food
- DELETE /api/foods/:id - Delete food

### Diary
- GET /api/diary/:userId/:date - Get user's diary for a specific date
- POST /api/diary/:userId - Add food to diary
- DELETE /api/diary/:userId/:foodId - Remove food from diary

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Recharts
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT Authentication
  - bcryptjs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 