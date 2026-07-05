# Job Tracker

A full-stack MERN application that helps job seekers organize, manage, and track their job applications efficiently. The application provides a centralized dashboard to monitor application status, manage interviews, search and filter jobs, visualize progress through analytics, and receive AI-powered career assistance.

---

## Features

### Job Management
- Add new job applications
- Edit existing job details
- Delete job applications
- View all applications in one place

### Application Tracking
Track applications through different stages:
- Pending
- Interview
- Accepted
- Rejected

### Search & Filter
- Search jobs by company or position
- Filter by application status
- Sort jobs by:
  - Latest
  - Oldest
  - Company Name
  - Position

### Dashboard & Analytics
- Total applications overview
- Status-wise job distribution
- Interactive charts and graphs
- Quick insights into application progress

### Authentication
- Secure user registration
- User login
- JWT-based authentication
- Password encryption using bcrypt

### AI Career Chat
An AI-powered assistant that helps users with:
- Resume improvement suggestions
- Interview preparation
- Career guidance
- Job search advice
- General career-related questions

---

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

### AI
- Google Gemini API (AI Career Chat)

---

## Folder Structure

```
project/
│
├── backend/
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Models/
│   ├── Routes/
│   ├── Services/
│   ├── Uploads/
│   ├── util/
│   ├── Validations/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── package.json
└── README.md
```


## Application Preview

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Jobs Page
![Jobs](screenshots/Job-Cards.png)

### Analytics
![Resume Analysis](screenshots/Resume_analysis.png)

### Add-Job
![AI Chat](screenshots/Add-New_Job.png)

### Interview-Questions
![Interview-Questions](screenshots/AI_Generated_Questions.png)

### Login-Page
![Login-page](screenshots/Login_page.png)

---

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/job-tracker.git
```

```bash
cd job-tracker
```

---

## Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server.

```bash
npm start
```

or

```bash
npm run dev
```

---

## Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login user |

### Jobs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/jobs` | Get all jobs |
| POST | `/jobs` | Add new job |
| PUT | `/jobs/:id` | Update job |
| DELETE | `/jobs/:id` | Delete job |

### AI

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/ai/chat` | AI Career Chat |

---

## Screenshots

Add screenshots of your application here.

Example:

```
screenshots/
├── login.png
├── dashboard.png
├── analytics.png
├── jobs.png
└── ai-chat.png
```

---

## Future Enhancements

- Resume upload and parsing
- Email reminders for interviews
- Calendar integration
- Company-wise analytics
- Application deadline tracking
- Dark mode
- Export job data to PDF or Excel

---

## Author

**Sakshi Sinha**

GitHub: https://github.com/sakshi9703

---

## License

This project is developed for educational purposes.