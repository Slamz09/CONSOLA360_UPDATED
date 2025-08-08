## Consola360 Project Structure

```markdown
This document outlines the project structure for `consola360`, including both frontend and backend components.

## Project Structure

```
```markdown
consola360/
├── src/                             # Frontend source code
│   ├── views/                       # Vue.js view components
│   │   ├── deal-360/                # Deal-360 module
│   │   │   ├── DealsView.vue        # Deals table view
│   │   │   ├── LeadsView.vue        # Leads table view
│   │   │   └── Deal360ContractsView.vue  # Contracts table view
│   │   ├── legal-hub/               # Legal Hub module
│   │   │   ├── ContractsManagement.vue  # Contracts management view
│   │   │   ├── LegalIntelligence.vue    # Legal intelligence view
│   │   │   ├── LitigationCompliance.vue # Litigation compliance view
│   │   │   ├── contracts/           # Contracts sub-module
│   │   │   │   ├── ClauseRepository.vue   # Clause repository view
│   │   │   │   └── ContractGenerator.vue  # Contract generator view
│   │   │   ├── intelligence/        # Intelligence sub-module
│   │   │   │   ├── PlaybooksTraining.vue  # Playbooks and training view
│   │   │   │   └── RegulatoryFeed.vue    # Regulatory feed view
│   │   │   └── litigation/          # Litigation sub-module
│   │   │       ├── ActiveCases.vue       # Active cases view
│   │   │       ├── AssignedCases.vue     # Assigned cases view
│   │   │       ├── DisputeAnalytics.vue  # Dispute analytics view
│   │   │       ├── LegalTimeline.vue     # Legal timeline view
│   │   │       └── MatterIntake.vue      # Matter intake view
│   │   ├── AccountsView.vue         # Main accounts page
│   │   ├── ContractsView.vue        # Future contracts page
│   │   ├── DealsView.vue            # Future dashboard
│   │   └── RiskDashboardView.vue    # Risk dashboard for aggregated analytics
│   ├── components/                   # Reusable Vue components
│   │   ├── ui/                      # UI component library
│   │   │   ├── Modal.vue            # Reusable modal component
│   │   │   ├── Button.vue           # Reusable button component
│   │   │   └── Table.vue            # Reusable table component
│   │   └── AccountForm.vue          # Account form component
│   ├── router/                      # Vue router configuration
│   │   └── index.js                 # Route definitions
│   └── services/                    # API service layer
│       └── api.js                   # API service layer
├── database/                        # Database-related files
│   ├── schema.sql                   # Database table definitions (including properties table)
│   ├── migrations/                  # Database migrations (schema changes)
│   ├── seeds/                       # Sample data for testing
│   └── functions/                   # PostgreSQL stored functions
└── backend/                         # Backend source code
    ├── server.js                    # Main server file
    ├── routes/                      # API route definitions
    └── config/                      # Configuration files
```
## Tools and Technologies Used

The consola360 application is a combined CRM/CLM platform with built-in legal risk analytics and visual dashboards, empowering executives and sales teams with actionable insights to predict risky deals without relying on the legal department. Below is an overview of the tools and coding languages used, along with their specific roles in the project.1. Vue.js (Frontend Framework)Role: Vue.js powers the interactive frontend, including views like AccountsView.vue, RiskDashboardView.vue, and DealsView.vue in src/views/.
Purpose: Builds dynamic dashboards and CRM interfaces to display real-time data on accounts, deals, contracts, and risk analytics.
Enables visualization of legal risk metrics (e.g., top properties with litigation) for executives and sales teams.
Integrates with the backend via src/services/api.js to fetch and render data from PostgreSQL.

Example Usage: RiskDashboardView.vue uses Vue.js to visualize pending deals, contracts, and active legal matters, aiding decision-making.

2. Node.js (Backend Runtime)Role: Node.js runs the backend server (backend/server.js) and handles API requests, email monitoring, and data processing.
Purpose:Manages CRM/CLM workflows, including email monitoring (backend/services/emailMonitor.js) to detect contract-related emails.
Supports API endpoints in backend/routes/ for accessing accounts, contracts, and analytics data.
Facilitates integration with AI services for risk analysis.

Example Usage: The emailMonitor.js script processes incoming contracts and triggers database updates for real-time CRM tracking.

3. PostgreSQL with EDB Postgres AI (Database and AI Engine)Role: PostgreSQL, enhanced with EDB Postgres AI, serves as the relational database for CRM/CLM data (e.g., accounts, deals, contracts) and provides AI-driven analytics.
Purpose:Data Storage: Stores structured data in tables like accounts, contracts, properties, and contract_analysis (defined in database/schema.sql).
Automation: Uses triggers (database/functions/contract_triggers.sql) to automate workflows, such as flagging risky deals or queuing AI analysis.
Risk Analytics: Leverages EDB Postgres AI to run AI models in-database for legal risk assessments, reducing reliance on legal departments.
Dashboards: Supports queries for visual dashboards, e.g., litigation breakdowns by property in RiskDashboardView.vue.

Example Usage: The properties table links to active_cases for analytics on risky deals, displayed in executive dashboards.

4. JavaScript (Primary Programming Language)Role: JavaScript is used across frontend and backend components for logic, UI interactions, and API communication.
Purpose:Frontend: Powers Vue.js components for CRM/CLM interfaces and dashboard visualizations.
Backend: Drives Node.js scripts for server logic, email processing, and API interactions (src/services/api.js).

Example Usage: In AccountsView.vue, JavaScript handles real-time updates of account data from the database.

5. Axios (HTTP Client)Role: Axios facilitates HTTP requests from the Vue.js frontend to the Node.js backend.
Purpose:Fetches CRM/CLM data (e.g., accounts, contracts) and risk analytics for display in dashboards.
Simplifies error handling for seamless user experience.

Example Usage: apiService.getAccounts() in AccountsView.vue retrieves data for CRM tracking.

6. IMAP and Mailparser (Email Processing Libraries)Role: These Node.js libraries in backend/services/emailMonitor.js monitor and process contract-related emails.
Purpose:Detects incoming contracts and updates the contracts table, triggering CRM and risk analysis workflows.
Supports automated deal tracking by integrating email data into the system.

Example Usage: Filters attachments (e.g., PDFs) and saves them for AI analysis, linking to deals in the database.

7. SQL (Database Query Language)Role: SQL defines and queries the PostgreSQL database structure and analytics.
Purpose:Creates tables and triggers in database/schema.sql and database/functions/.
Enables complex queries for risk dashboards, e.g., top 10 properties with litigation.

Example Usage: Queries aggregate litigation data for RiskDashboardView.vue.

8. JSONB (PostgreSQL Data Type)Role: JSONB stores structured AI analysis results in the contract_analysis table.
Purpose:Holds risk assessments and key findings for visual dashboards.
Supports flexible querying for legal risk insights.

Example Usage: Stores data like {"risk_level": "high", "issue": "Unlimited liability"}.

9. Python (via EDB Postgres AI)Role: Python, integrated via plpython3u, runs AI functions within PostgreSQL.
Purpose:Executes in-database AI logic for risk analysis, reducing external dependencies.
Supports future AI model development (Phase 2).

Example Usage: The classify_contract_type function categorizes contracts for risk flagging.

## Project Phases

The consola360 project is structured into three distinct phases to build a combined CRM/CLM platform with legal risk analytics and visual dashboards for executives and sales teams. Below are the phases and their key activities:

### 1) Frontend Develop User Interface: 
Frontend Overview
Build interactive Vue.js views (e.g., AccountsView.vue, RiskDashboardView.vue, DealsView.vue) for CRM/CLM tracking and risk visualization.
Create Reusable Components: Design components like Table.vue, Modal.vue, and Button.vue in src/components/ for consistent UI across the platform.
Implement Data Visualization: Integrate charts and dashboards in RiskDashboardView.vue to display real-time metrics (e.g., pending deals, litigation by property).
Enable API Integration: Use src/services/api.js with Axios to fetch and display data from the backend, ensuring seamless updates for users.
Optimize User Experience: Ensure responsive design and real-time updates for executives and sales teams to predict risky deals without legal reliance.

The frontend is built using **Vue.js** and is organized into modular views and reusable components:
- **deal-360/**: Contains views for managing deals, leads, and contracts.
- **legal-hub/**: Manages legal-related functionality, including contracts repository, contracts generator tool, risk intelligence, and litigation sub-modules.
- **components/**: Reusable UI components (`Modal.vue`, `Button.vue`, `Table.vue`) and specific components like `AccountForm.vue`.
- **router/**: Defines client-side routing using `index.js`.
- **services/**: Handles API interactions via `api.js`.
- 
### 2) Backend Setup (PostgreSQL)
Develop the Node.js server in backend/server.js to handle API requests and CRM/CLM workflows.
Implement Email Monitoring: Create backend/services/emailMonitor.js using IMAP and Mailparser to detect and process contract-related emails, updating the contracts table.
Define API Routes: Build endpoints in backend/routes/ for accessing accounts, contracts, properties, and analytics data.
Configure Database Connectivity: Link the backend to PostgreSQL with EDB Postgres AI, managing data storage and triggers in database/schema.sql and database/functions/.
Support Automation: Implement triggers and functions to automate workflows (e.g., flagging risky deals, queuing AI analysis) for real-time CRM updates.

### 4) AI Integrate Clause Extraction: Develop AI Agent #1 to parse contract text (PDF, DOCX) into clauses, outputting JSON data for further processing.
Enable Clause Identification: Build AI Agent #2 to classify clauses (e.g., Indemnity, IP Ownership) with confidence scores, flagging unknowns for review.
Perform Risk Analysis: Create AI Agent #3 to analyze clauses against playbooks and repositories, identifying risks (e.g., “unlimited liability”) with confidence flags (Green, Yellow, Red).
Generate Redlines: Design AI Agent #4 to redline flagged clauses with tracked changes in MS Word, suggesting alternatives based on past accepted versions.
Automate Sync and Tagging: Implement AI Agent #5 to sync approved clauses to a library, update deal records, and refresh risk dashboards in real-time.
Plan Future Model Development: Outline Phase 2 (post-backend) to train custom AI models using EDB Postgres AI and Ollama for enhanced accuracy in each agent.

## 

The backend is powered by **PostgreSQL** and includes the following components:

- **schema.sql**: Defines the database tables and structure.
- **migrations/**: Manages database schema changes over time.
- **seeds/**: Contains sample data for testing and development.
- **functions/**: Stores PostgreSQL-specific functions for advanced database logic.
- **server.js**: The main entry point for the backend server.
- **routes/**: Defines the API endpoints for the application.
- **config/**: Holds configuration settings for the backend (e.g., database connection details).

## Key Component Descriptions

### AccountsView.vue
The `AccountsView.vue` serves as the main accounts page, acting as a centralized hub for managing entity-specific records (e.g., customers, vendors). It aggregates and stores records from the `Deals`, `Contracts`, and `Leads` tables under a master account for each specific entity. Properties data (e.g., company properties associated with the entity) is now stored in a separate `properties` table in PostgreSQL, linked to entities via foreign keys. This ensures that all related data for an entity is accessible while keeping property-specific data modular and scalable.

### RiskDashboardView.vue
The `RiskDashboardView.vue` provides a high-level overview of risk-related metrics across the platform. It aggregates data from multiple sources:
- **Pending Contracts**: Total number of pending contracts from `Deal360ContractsView.vue`.
- **Pending Deals**: Total number of pending deals from `DealsView.vue`.
- **Active Legal Matters**: Data on active legal cases pulled from the `ActiveCases.vue` table in the litigation module.
- **Property Breakdown**: Analytics on all properties from the `properties` table, including:
  - Top 10 company properties with the most active litigation.
  - Breakdown of litigation by case type (e.g., 60% contract disputes, 40% IP breaches).

This dashboard leverages the `properties` table for efficient querying of property-specific analytics, enabling users to prioritize and address high-risk areas.

## Backend Setup (PostgreSQL)

The backend is powered by **PostgreSQL** and includes a dedicated `properties` table for enhanced modularity and analytics. The database structure includes:

- **schema.sql**: Defines the database tables, including the new `properties` table and relationships with other tables (e.g., `accounts`, `active_cases`).
- **migrations/**: Manages database schema changes over time, including the addition of the `properties` table.
- **seeds/**: Contains sample data for testing, including sample properties and their relationships.
- **functions/**: Stores PostgreSQL-specific functions for advanced database logic (e.g., aggregating litigation data by property).
- **server.js**: The main entry point for the backend server.
- **routes/**: Defines API endpoints, including new endpoints for property-specific queries.
- **config/**: Holds configuration settings for the backend (e.g., database connection details).

### Properties Table Schema
Below is a sample schema for the `properties` table, defined in `schema.sql`:

```sql
CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    entity_id INTEGER REFERENCES accounts(entity_id) ON DELETE CASCADE,
    property_name VARCHAR(255) NOT NULL,
    property_type VARCHAR(100), -- e.g., office, warehouse, retail
    location VARCHAR(255),      -- e.g., city, state, or address
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example relationship with active_cases (litigation)
CREATE TABLE active_cases (
    case_id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(property_id) ON DELETE SET NULL,
    case_type VARCHAR(100) NOT NULL, -- e.g., contract_dispute, ip_breach
    status VARCHAR(50) NOT NULL,     -- e.g., active, pending, closed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example index for performance
CREATE INDEX idx_properties_entity_id ON properties(entity_id);
CREATE INDEX idx_active_cases_property_id ON active_cases(property_id);
```

**Key Features of the Properties Table**:
- `property_id`: Unique identifier for each property.
- `entity_id`: Foreign key linking to the `accounts` table, ensuring properties are associated with specific entities.
- `property_name`, `property_type`, `location`: Core attributes for property data.
- Indexes on `entity_id` and `property_id` for efficient querying in analytics (e.g., for `RiskDashboardView.vue`).
- Relationship with `active_cases` to support litigation analytics by property.

**Sample Query for RiskDashboardView.vue**:
```sql
-- Get top 10 properties with most active litigation, with case type breakdown
SELECT 
    p.property_id,
    p.property_name,
    COUNT(ac.case_id) AS total_cases,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'case_type', ac.case_type,
            'count', COUNT(ac.case_id) FILTER (WHERE ac.case_type = ac.case_type)
        )
    ) AS case_type_breakdown
FROM properties p
LEFT JOIN active_cases ac ON p.property_id = ac.property_id
WHERE ac.status = 'active'
GROUP BY p.property_id, p.property_name
ORDER BY total_cases DESC
LIMIT 10;
```

This query provides the top 10 properties with active litigation and a breakdown of case types (e.g., 60% contract disputes, 40% IP breaches).

## Frontend Overview

The frontend is built using **Vue.js** and is organized into modular views and reusable components:
- **deal-360/**: Manages deals, leads, and contracts.
- **legal-hub/**: Manages legal-related functionality, including contracts, intelligence, and litigation sub-modules.
- **AccountsView.vue**: Central hub for entity-specific data, linked to the `properties` table.
- **RiskDashboardView.vue**: Visualizes risk metrics across contracts, deals, litigation, and properties.
- **components/**: Reusable UI components (`Modal.vue`, `Button.vue`, `Table.vue`) and specific components like `AccountForm.vue`.
- **router/**: Defines client-side routing using `index.js`.
- **services/**: Handles API interactions via `api.js`, including new endpoints for the `properties` table.

## Integration with Properties Table

### Backend Updates
- **schema.sql**: Add the `properties` table and update related tables (e.g., `active_cases`) with foreign key relationships.
- **migrations/**: Create a migration script to add the `properties` table and indexes.
- **seeds/**: Include sample property data linked to entities and litigation cases.
- **routes/**: Add API endpoints in `routes/` for property-related queries, e.g.:
  ```javascript
  // Example in routes/properties.js
  router.get('/properties/top-litigation', async (req, res) => {
      const query = `
          SELECT p.property_id, p.property_name, COUNT(ac.case_id) as total_cases
          FROM properties p
          LEFT JOIN active_cases ac ON p.property_id = ac.property_id
          WHERE ac.status = 'active'
          GROUP BY p.property_id, p.property_name
          ORDER BY total_cases DESC
          LIMIT 10
      `;
      const result = await db.query(query);
      res.json(result.rows);
  });
  ```
- **api.js**: Update the API service layer to fetch property data for `AccountsView.vue` and `RiskDashboardView.vue`.

### Frontend Updates
- **AccountsView.vue**: Update to fetch and display property data via API calls to the `properties` table, linked to entities.
- **RiskDashboardView.vue**: Query the new properties API endpoints to display analytics, such as top 10 properties with litigation and case type breakdowns.
- **components/Table.vue**: Ensure the reusable table component supports dynamic rendering of property and litigation data.

## Benefits of Dedicated Properties Table
- **Modularity**: Separates property data from customer and vendor employee data, improving maintainability.
- **Scalability**: Supports complex queries for analytics (e.g., litigation by property, case type breakdowns).
- **Flexibility**: Enables relationships between properties and multiple entities or litigation cases.
- **Performance**: Indexes on `property_id` and `entity_id` optimize queries for `RiskDashboardView.vue`.


## Database front end integratration:

### Immediate Next Steps
1. **Verify PostgreSQL Installation**:
   - Open a terminal or command prompt and run `psql -U postgres` to connect to the database. If prompted for a password, use the one you set during installation. If it connects, you’re good to go!
   - If you get an error (e.g., "connection refused"), ensure the service is running (e.g., via Services on Windows) and check that port 5432 is free (use `netstat -aon | findstr :5432` on Windows).

2. **Create Your Database**:
   - In the `psql` prompt, create a database for your project:
     ```
     CREATE DATABASE consola360_db;
     \c consola360_db
     ```
   - Use the `database/schema.sql` file you prepared to create tables (e.g., `accounts`, `contracts`):
     ```
     \i path/to/your-vue-app/database/schema.sql
     ```

3. **Install the Node.js Driver**:
   - In your project directory, install the `pg` driver to connect your Node.js backend to PostgreSQL:
     ```
     npm install pg
     ```
   - Update `backend/server.js` with a connection pool:
     ```javascript
     const { Pool } = require('pg');
     const pool = new Pool({
       user: 'postgres',
       host: 'localhost',
       database: 'consola360_db',
       password: 'your_password',
       port: 5432,
     });
     module.exports = pool;
     ```

4. **Set Up the Backend API**:
   - Ensure `backend/server.js` is configured to start a server and handle API requests. Add a basic route:
     ```javascript
     const express = require('express');
     const pool = require('./pool');
     const app = express();
     app.use(express.json());

     app.get('/accounts', async (req, res) => {
       try {
         const result = await pool.query('SELECT * FROM accounts');
         res.json(result.rows);
       } catch (err) {
         res.status(500).send(err);
       }
     });

     app.listen(3001, () => console.log('Server running on port 3001'));
     ```
   - Install Express if needed: `npm install express`.

5. **Update the Frontend**:
   - Modify `src/services/api.js` to call the backend API:
     ```javascript
     import axios from 'axios';

     const API_BASE_URL = 'http://localhost:3001';

     const apiService = {
       getAccounts: () => axios.get(`${API_BASE_URL}/accounts`),
     };

     export default apiService;
     ```
   - Update `AccountsView.vue` to fetch data:
     ```javascript
     <script setup>
     import { ref, onMounted } from 'vue';
     import apiService from '@/services/api';

     const accounts = ref([]);

     onMounted(async () => {
       const response = await apiService.getAccounts();
       accounts.value = response.data;
     });
     </script>

     <template>
       <div>
         <h1>Accounts</h1>
         <ul>
           <li v-for="account in accounts" :key="account.id">{{ account.company_name }}</li>
         </ul>
       </div>
     </template>
     ```

6. **Test the Connection**:
   - Start your Vite app: `npm run dev` (should load at `http://localhost:5173/`).
   - Start the backend server: `node backend/server.js` in a separate terminal.
   - Add some test data to `accounts` via `psql`:
     ```
     INSERT INTO accounts (company_name) VALUES ('Test Corp');
     ```
   - Refresh your app and check if "Test Corp" appears.

### Preparing for Ollama
- **Install pgAdmin 4**: Since it wasn’t in the installer, download it from https://www.pgadmin.org/download/ and install it to manage your database visually.
- **Plan for Python Driver**: When setting up Ollama, install `psycopg2`:
  ```
  pip install psycopg2-binary
  ```
  This will allow Ollama to query your tables later.

### Troubleshooting
- If the app doesn’t load data, ensure the backend is running on port 3001 and there’s no port conflict with 5432.
- Check the console for errors and let me know if you hit any snags!







