# TasksManager SuperCom

A full-stack task management web application built with .NET 10.0 backend and React frontend, featuring comprehensive task organization with user assignments, tags, and priority management.

## 🚀 Features

- **Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **User System**: Assign tasks to users with full profile management
- **Tag Organization**: Categorize tasks with custom tags and multi-tag support
- **Task Reminders**: Automated RabbitMQ-based reminder system for overdue tasks
- **Background Processing**: Windows Service worker for continuous task monitoring
- **Real-time Updates**: Redux (Reducer + useReducer) state management for seamless user experience
- **Material UI Design**: Modern, accessible UI using Material Design components
- **Responsive Design**: Material UI's responsive system that works across all devices
- **Database Integration**: Entity Framework Core with SQL Server
- **Message Queue**: RabbitMQ integration for reliable task processing
- **API Documentation**: RESTful API with comprehensive endpoints

## 🏗️ Architecture Overview

### Technology Stack

**Backend (.NET 10.0)**
- **Framework**: ASP.NET Core Web API
- **Database**: Entity Framework Core with SQL Server
- **Architecture**: Repository pattern with interfaces
- **Messaging**: RabbitMQ integration for task reminders
- **Background Services**: Hosted Windows Service workers
- **Middleware**: Custom exception handling
- **API**: RESTful endpoints with DTOs

**Frontend (React)**
- **Framework**: React 19.1.0 with modern hooks
- **State Management**: Redux with React-Redux
- **Routing**: React Router DOM
- **Build Tool**: Vite for fast development
- **HTTP Client**: Axios for API communication
- **UI Library**: Material UI (MUI) with modern component system
- **Styling**: Material UI theming with responsive design

### Project Structure

```
TasksManager_SuperCom/
├── server/                    # .NET Core API Backend
│   ├── Controllers/          # API endpoints (Tasks, Users, Tags)
│   ├── Models/              # Entity models (TaskItem, User, Tag)
│   ├── Data/                # Entity Framework DbContext
│   ├── DTOs/                # Data transfer objects
│   ├── Interfaces/          # Repository interfaces
│   ├── Middlewares/         # Custom middleware (Exception handling)
│   └── Queries/             # Query implementations
└── client/                   # React Frontend
    └── src/
       ├── components/      # Reusable React components with MUI
       │   ├── Tasks/       # Task-related components using MUI
       │   ├── Users/       # User management components using MUI
       │   └── Tags/        # Tag management components using MUI
       ├── pages/           # Page components
       ├── services/        # API service layers
       ├── utils/           # Utility functions and reducers
       ├── theme/           # Material UI theme configuration
       └── styles/          # Additional custom styling (minimal)
```

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **.NET SDK 10.0**
- **SQL Server** (LocalDB or full instance)
- **RabbitMQ Server** (for task reminder system)
- **Erlang** (required for RabbitMQ)
- **Visual Studio Code** or **Visual Studio** (recommended)

### Database Setup

1. **Install SQL Server**
   ```bash
   # For development, SQL Server Express or LocalDB is sufficient
   # Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads
   ```

2. **Update Connection String**
   
   Edit `server/appsettings.json` and update the connection string based on your SQL Server setup:

   **For LocalDB:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=TasksManager_SuperCom_AndreyIvanovDB;Trusted_Connection=true;TrustServerCertificate=True;"
     }
   }
   ```

   **For SQL Server Express:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=TasksManager_SuperCom_AndreyIvanovDB;Trusted_Connection=true;TrustServerCertificate=True;"
     }
   }
   ```

   **For Full SQL Server Instance:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=TasksManager_SuperCom_AndreyIvanovDB;Trusted_Connection=true;TrustServerCertificate=True;"
     }
   }
   ```

   **For Remote SQL Server:**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=your-server-name;Database=TasksManager_SuperCom_AndreyIvanovDB;User Id=your-username;Password=your-password;TrustServerCertificate=True;"
     }
   }
   ```

### RabbitMQ Setup

RabbitMQ is required for the automated task reminder system that monitors overdue tasks and sends notifications.

#### Option A: Direct Download (Recommended)
1. **Install Erlang first**: Download from https://www.erlang.org/downloads
2. **Install RabbitMQ**: Download from https://www.rabbitmq.com/install-windows.html
3. Run both installers as Administrator
4. **Restart your computer** after installation

#### Option B: Using Docker (Easiest for testing) - RECOMMENDED IF HAVING ISSUES
```bash
# Make sure Docker is installed and running
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Check if it's running
docker ps

# Access web UI at: http://localhost:15672 (guest/guest)
```

#### Option C: Using Chocolatey
```powershell
choco install rabbitmq
```

#### Option D: Using Windows Package Manager (winget)
```powershell
winget install RabbitMQ.RabbitMQ
```

#### Enable RabbitMQ Management Plugin

**Method A: Using Command Prompt (Simplest)**
```cmd
cd "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.*\sbin"
rabbitmq-plugins.bat enable rabbitmq_management
```

**Method B: Using PowerShell**
```powershell
cd "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.*\sbin"
.\rabbitmq-plugins.bat enable rabbitmq_management
```

**Verify RabbitMQ is running:**
```cmd
sc query RabbitMQ
```

**Access web UI:** http://localhost:15672 (username: guest, password: guest)

#### 🚨 Troubleshooting RabbitMQ

**If Web UI doesn't work:**

1. **Check if Erlang is installed** (REQUIRED): https://www.erlang.org/downloads
2. **Verify RabbitMQ service:** `sc query RabbitMQ`
3. **Start service if stopped:** `sc start RabbitMQ`
4. **Check management plugin:** 
   ```cmd
   cd "C:\Program Files\RabbitMQ Server\rabbitmq_server-*\sbin"
   rabbitmq-plugins.bat list
   ```
   Look for `rabbitmq_management` with `[E*]` (enabled)

**Fresh install approach if issues persist:**
1. Uninstall RabbitMQ
2. Install Erlang first
3. Restart computer
4. Install RabbitMQ
5. Enable management plugin

**Note**: The web UI is optional - your .NET application will work without it and create the queue automatically.

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Create initial database migration** (First time only)
   ```bash
   dotnet ef migrations add InitialMigration
   ```

4. **Run database migrations**
   ```bash
   dotnet ef database update
   ```

5. **Start the backend server**
   
   **Option A: Development (using dotnet run)**
   ```bash
   dotnet run
   ```
   
   **Option B: Production (publish and run)**
   ```bash
   dotnet publish -c Release -o ./publish
   cd publish
   dotnet server.dll
   ```
   
   The API will be available at `http://localhost:3000`
   
   **Verify RabbitMQ Integration**: Check console logs for:
   - *"Started consuming task reminders..."*
   - Task reminder system runs every 5 minuts in the background

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The frontend will be available at `http://localhost:5173`

### Production Build

**Backend**
```bash
cd server
dotnet publish -c Release -o ./publish

```

**Frontend**
```bash
cd client
npm run build
```

## 🔧 Key Implementation Details

### Database Design

The application uses Entity Framework Core with a relational design:

**Core Models:**
- **TaskItem**: Main task entity with title, description, due date, priority (1-3), and optional user assignment
- **User**: User profiles with full name, telephone, and optional email
- **Tag**: Task categorization with many-to-many relationship

**Key Relationships:**
- **Tasks ↔ Tags**: Many-to-many relationship via `TaskTags` junction table
- **Users → Tasks**: One-to-many relationship with optional assignment
- **Cascade Rules**: Restrict delete to maintain data integrity

```csharp
// Example: Many-to-many configuration in AppDbContext
mb.Entity<TaskItem>()
    .HasMany(t => t.Tags)
    .WithMany(tag => tag.Tasks)
    .UsingEntity(j => j.ToTable("TaskTags"));
```

### API Design

**RESTful Endpoints:**

```
GET    /api/tasks                         # Get all tasks
POST   /api/tasks                         # Create new task
PUT    /api/tasks/{id}                    # Update task
DELETE /api/tasks/{id}                    # Delete task
PUT    /api/tasks/associatetags/{id}      # Associate tags with task
PUT    /api/tasks/disassociatetags/{id}   # Disassociate tags from task

GET    /api/users                            # Get all users
POST   /api/users                            # Create user
PUT    /api/users/{id}                       # Update user
DELETE /api/users/{id}                       # Delete user
PUT    /api/users/associatetasks/{userId}    # Associate tasks with user
PUT    /api/users/disassociatetasks/{userId} # Disassociate tasks from user

GET    /api/tags                          # Get all tags
POST   /api/tags                          # Create tag
PUT    /api/tags/{id}                     # Update tag
DELETE /api/tags/{id}                     # Delete tag
PUT    /api/tags/associatetasks/{id}      # Associate task with tags
PUT    /api/tags/disassociatetasks/{id}   # Disassociate task with tags
```

**DTO Pattern**: All endpoints use Data Transfer Objects for clean separation between internal models and API contracts.

### Frontend Architecture

**State Management**: Redux with organized reducers for:
- `tasksReducer`: Task management
- `usersReducer`: User management
- `tagsReducer`: Tag operations
- Local reducers for form state management

**Component Architecture**:
- **Container Components**: Handle data fetching and state management
- **Presentational Components**: Material UI components for consistent, accessible UI rendering
- **Service Layer**: Axios-based API clients for all backend communication
- **MUI Integration**: Leveraging Material UI's comprehensive component library for forms, inputs, buttons, and layouts

**Key Features**:
- **Real-time Updates**: Redux ensures UI stays synchronized with backend
- **Form Management**: Dedicated reducers for complex forms (add/edit tasks)
- **Reusable Components**: LookupField for user/tag selection across forms

### Error Handling

**Backend**: Custom `ExceptionsMiddleware` provides centralized error handling with structured responses.

**Frontend**: Redux error states and user-friendly error messages throughout the application.

## � RabbitMQ Task Reminder System

### How It Works

The application includes an automated task reminder system using RabbitMQ and background workers:

1. **TaskMonitorWorker** runs every 20 seconds as a background service
2. Checks for overdue tasks where `IsReminderSent` is false/null using `TasksQ.GetOverdueTasksForRemindersAsync()`
3. Publishes `TaskReminder` messages to RabbitMQ queue "task_reminders"
4. Consumes messages and logs reminders: *"Hi your Task is due {TaskTitle} (ID: {TaskId})"*
5. Uses optimistic concurrency with `TasksQ.MarkReminderSentAsync()` to prevent duplicate reminders
6. Marks tasks as `IsReminderSent = true` after processing

### Architecture

```
┌─────────────────┐
│TaskMonitorWorker│  
│ (Background)    │  
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│    TasksQ.cs    │
│ (Data Access)   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ RabbitMQ Queue  │
│"task_reminders" │
└─────────────────┘
```

### Key Components Created

- **Services/RabbitMQConnection.cs** - RabbitMQ connection management
- **Services/TaskReminderService.cs** - Publish/consume reminder messages  
- **Workers/TaskMonitorWorker.cs** - Background worker service
- **DTOs/TaskReminderDtos.cs** - TaskReminder DTO
- **Queries/TasksQ.cs** - Added overdue task queries and reminder marking
- **appsettings.json** - Added RabbitMQ configuration

### Testing the Reminder System

1. **Add a task with past due date**:
   - Create a task with DueDate < DateTime.Now
   - Set IsReminderSent = false or null

2. **Check logs**:
   - Console output (if running with dotnet run)
   - Windows Event Log (if running as service)

3. **Monitor RabbitMQ queue**:
   - Queue name: "task_reminders"
   - Use web UI at http://localhost:15672 to check message count

### *OPTIONAL* Install as Windows Service

```cmd
# Publish the application
dotnet publish -c Release -o ./publish

# Install as Windows Service (Run as Administrator)
sc create "TaskManagerService" binpath="C:\full\path\to\your\publish\server.exe"
sc start "TaskManagerService"

# To remove the service
sc stop "TaskManagerService" 
sc delete "TaskManagerService"
```

## �🔍 Development Workflow

1. **Make backend changes**: Update models, controllers, or add migrations
2. **Test API endpoints**: Use tools like Postman or the built-in Swagger UI
3. **Test RabbitMQ integration**: Create overdue tasks and monitor reminder logs
4. **Update frontend**: Modify components and update Redux states
5. **Run migrations**: Apply database changes with `dotnet ef database update` 
6. **Verify integration**: Test full flow from UI to database to RabbitMQ

## 📝 API Testing

The application includes comprehensive API endpoints. Example requests:

**Create a new task:**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "dueDate": "2026-03-30T10:00:00Z",
  "priority": 3,
  "userId": 1
}
```

## 📄 License

This project is part of a home assignment for SuperCom.
All user right reserved by Andrey Ivanov

---

**Last Updated**: March 26, 2026


## SQL Query based on Home Asignment
**Write a SQL query that returns tasks with at least two tags, including tag names, sorted by number of tags descending and add it to the README file**
Complex SQL query for analytics (tasks with multiple tags):

```sql
SELECT 
    task.Id,
    task.Title,
    COUNT(tt.TagId) AS TagCount,
    STRING_AGG(tag.Name, ', ') AS TagNames
FROM Tasks task     
JOIN TaskTags tt ON task.Id = tt.TaskId
JOIN Tags tag ON tag.Id = tt.TagId
GROUP BY task.Id, task.Title
HAVING COUNT(tt.TagId) >= 2
ORDER BY TagCount DESC;
```