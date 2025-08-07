# Consola360 Project Structure


```markdown
# Consola360 Project Structure
This document outlines the project structure for `consola360`, including both frontend and backend components with a focus on implementing a **dedicated relational table** in PostgreSQL for properties. 

## Project Structure

```
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

## NEXT STEPS FOR PROKECT BUILD:
1. Implement the `properties` table in `schema.sql` and create corresponding migration scripts.
2. Populate `seeds/` with sample property data for testing.
3. Update `api.js` and `routes/` to include property-related endpoints.
4. Modify `AccountsView.vue` and `RiskDashboardView.vue` to integrate with the new properties API.
5. Test analytics queries (e.g., top 10 properties with litigation) to ensure accuracy and performance.
6. Consider adding additional attributes to the `properties` table (e.g., `value`, `risk_score`) for enhanced analytics.







