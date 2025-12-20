# Development Startup Guide

## Quick Start Commands

### 1. Start Backend Server
```bash
cd Backend
npm install
npm run dev
```
Backend will run on: http://localhost:5000

### 2. Start Frontend Server (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: http://localhost:5173

### 3. Database Setup
1. Create PostgreSQL database named `Tripful`
2. Run the SQL script:
```bash
psql -U postgres -d Tripful -f Backend/database-setup.sql
```

## Test Accounts

**Staff Account:**
- Email: staff@demo.com
- Password: password123

**Customer Account:**
- Email: customer@demo.com  
- Password: password123

## API Testing

Test the API endpoints:
- GET http://localhost:5000/api/health
- GET http://localhost:5000/api/packages
- POST http://localhost:5000/api/auth/login

## Troubleshooting

1. **Database Connection Issues:**
   - Check PostgreSQL is running
   - Verify credentials in Backend/.env
   - Ensure database "Tripful" exists

2. **Frontend API Errors:**
   - Ensure backend is running on port 5000
   - Check browser console for CORS errors

3. **Authentication Issues:**
   - Clear localStorage in browser
   - Check JWT_SECRET in .env file

## Development Workflow

1. Make changes to code
2. Both servers auto-reload on file changes
3. Test in browser at http://localhost:5173
4. API available at http://localhost:5000/api