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
Tools and Technologies Used

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

AI Integration (Phase 3 of 3)The consola360 project is structured in three phases, with the current focus on building the database (Phase 1) and planning AI model development (Phase 2). Phase 3, outlined below, implements the AI-driven workflow for the deal-to-contract process, aligning with the consola360.com vision of automated legal risk analytics and dashboards. Phase 2 will involve creating AI models for each step, to be developed after the database is complete.Project PhasesPhase 1: Database Architecture Setup (Current)Building PostgreSQL tables (accounts, contracts, properties, etc.) in database/schema.sql.
Implementing triggers and migrations for CRM/CLM workflows.

Phase 2: AI Model Development (Future)Creating specialized AI models for each step of the deal-to-contract workflow (e.g., Clause Extractor, Clause Analyzer).
To be implemented after database completion, using tools like Ollama and EDB Postgres AI.

Phase 3: AI Integration and Workflow (Current Focus)Integrating AI agents into the CRM/CLM system for automated risk analysis and dashboard updates.

Consola360 Clause Intelligence Workflow (Phase 3)This workflow automates the deal-to-contract process, extracting clauses, identifying risks, and providing redlined suggestions for executives and sales teams. Contracts are sent to contracts@consola360.com, triggering the following AI-driven steps:Step 1: Clause Extractor (AI Agent #1)Tools: Lightweight LLM (e.g., LLaMA or Claude instance).
Process:Parses raw contract text (PDF, DOCX, etc.) into discrete clauses.
Recognizes visual separators (numbering, indentation, headers).
Segments by logic (e.g., even clauses embedded in body text are isolated).

Output: JSON of {clause_id, raw_text, position_in_contract}.
Next Stage: Passes clauses to Clause Identifier.

Step 2: Clause Identifier (AI Agent #2)Tools: AI classifier (fine-tuned or zero-shot prompt).
Process:Maps each clause to a clause type (e.g., Indemnity, Insurance, Payment Terms, IP Ownership).
Uses metadata + deal context to narrow match (contract type, jurisdiction, etc.).
Flags unknown or compound clauses for fallback human review.

Output: {clause, type, original_text, confidence_score}.
Next Stage: Passes identified clauses to Clause Analyzer.

Step 3: Clause Analyzer (Risk Intelligence Layer + GREP Safety Scan) (AI Agent #3)Tools: Company Clause Repository (in Firebase if compatible w/ rest of project), Large Language Model (e.g., Ollama model), grep engine for deterministic string-level validation.
Process:Compares clause text against:Company-approved clauses from similar contracts in repository.
Jurisdiction-specific rules (e.g., TX indemnity law).
Role-based redline playbooks (Sales, Procurement, etc.).

Finds risk phrases (e.g., “unlimited liability,” “waiver of subrogation”).
Detects missing required language (e.g., “COI must be provided”).
Flags ambiguous legal constructs.

Output: Confidence Score + risk flag:Green: AI-match to approved clause, no issue.
Yellow: Acceptable with review.
Red: Non-standard, risky, or jurisdictional conflict.

Next Stage: Passes flagged clauses to Clause Redliner.

Step 4: Clause Redliner (AI Agent #4)Tools: Specialized clause-aware LLMs (broken down by clause type), Redline Engine with tracked changes output (Word-ready), Optional RegEx helpers for consistent insertions (like term templates).
Process:Redlines only the flagged or changed portions of a clause in MS Word.
Suggests alternative language based on:Company templates.
Past accepted versions (within deal-type context).

All judgment from Analyzer step.

Output: Full redlined MS Doc stored in contract record under pass_no_1 (would it be easier to have attorneys manually upload the contract to a contract redlining tool and then it would split back the MS Word redlines for their attorney to edit if needed?).
Next Stage: Passes redlined document to Auto-Sync + Record Tagging.

Step 5: Auto-Sync + Record Tagging (AI Agent #5)Tools: Triggers.
Process:If clause tagged as approved, synced to Clause Library.
If clause updated, new version saved and linked to the contract ID.
Deal record + Risk dashboard + Company360 all updated in real-time.

Output: Updated CRM/CLM records and dashboards reflecting risk insights.

Future AI Model Development (Phase 2)Objective: Develop custom AI models for each agent (Clause Extractor, Identifier, Analyzer, Redliner, Auto-Sync) to enhance accuracy and specificity.
Approach: Leverage EDB Postgres AI and Ollama to train models on legal data (e.g., past contracts, playbooks) stored in PostgreSQL.
Timeline: To be initiated after Phase 1 database completion, with iterative testing and integration into Phase 3 workflows.

Integration with Consola360CRM/CLM: The workflow integrates with AccountsView.vue and DealsView.vue to track deals and contracts, updating the contracts table.
Risk Analytics: RiskDashboardView.vue leverages Analyzer outputs to display real-time risk metrics (e.g., top properties with litigation, case type breakdowns).
Dashboards: Visual insights empower executives and sales teams to predict risky deals, reducing legal department reliance.


## Frontend Overview

The frontend is built using **Vue.js** and is organized into modular views and reusable components:

- **deal-360/**: Contains views for managing deals, leads, and contracts.
- **legal-hub/**: Manages legal-related functionality, including contracts repository, contracts generator tool, risk intelligence, and litigation sub-modules.
- **components/**: Reusable UI components (`Modal.vue`, `Button.vue`, `Table.vue`) and specific components like `AccountForm.vue`.
- **router/**: Defines client-side routing using `index.js`.
- **services/**: Handles API interactions via `api.js`.

## Backend Setup (PostgreSQL)

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









