# Quiz Admin Panel

A Vue.js application for managing quizzes with features for authentication, quiz creation, editing, and management.

## Features

- **Authentication:** Login, forgot password, and password reset functionality
- **Quiz Management:** Create, edit, view, and toggle quiz status
- **Category Management:** Add and filter quizzes by categories
- **Question Management:** Create and edit multiple-choice questions for quizzes
- **CSV Import:** Upload quiz questions via CSV file

## Technologies Used

- **Vue.js 3:** Progressive JavaScript framework
- **Vuex:** State management
- **Vue Router:** Navigation and routing
- **Vuetify:** Material Design component library
- **Axios:** HTTP client for API requests

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

## Project Setup

1. Clone the repository:
```
git clone <repository-url>
cd quiz-admin-panel
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

4. Build for production:
```
npm run build
```

## Usage

### Login

- Email: `admin@example.com`
- Password: `password123`

### Adding Quizzes

1. Navigate to the "Add Quiz" page
2. Fill in the quiz details (title, category, grade)
3. Upload a CSV file with questions in the format:
   ```
   Question Text,Option1|Option2|Option3|Option4,Correct Answer
   ```
4. Review the questions preview and save the quiz

### Editing Quizzes

1. Navigate to the "Quizzes" page
2. Click the edit button for a quiz
3. Modify quiz details and questions
4. Save the changes

## CSV Format for Quiz Questions

The CSV file for uploading questions should have the following format:

```
"What is 2+2?","1|2|4|5","4"
"What is the capital of France?","London|Paris|Berlin|Madrid","Paris"
```

Each line contains:
1. Question text
2. Options separated by pipe (|) character
3. The correct answer (must match one of the options exactly)

## Project Structure

- `/src` - Source files
  - `/components` - Reusable Vue components
  - `/views` - Page components
  - `/store` - Vuex state management
  - `/router` - Vue Router configuration
  - `/assets` - Static assets


  Creadentials:

  Email: admin@example.com
Password: 123456

Email: user@gmail.com  
Password: password

Email: test@test.com
Password: simple123
