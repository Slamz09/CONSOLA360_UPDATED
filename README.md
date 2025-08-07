
consola360/
├── src/
│   ├── views/
│       └── deal-360
│            └── DealsView.vue (where the "Deals" table will live)
│            └── LeadsView.vue (where the "Leads" table will live)
│            └── Deal360ContractsView.vue (where the "contracts" table will live")
│       └── legal-hub
│           └── ContractsManagement.vue
│           └── LegalIntelligence.vue
│           └── LitigationCompliance.vue
│           └── contracts/
│                 └──ClauseRepository.vue
│                 └──ContractGenerator.vue
│             └── intelligence/
│                 └──playbookstraining.vue
│                 └──regulatoryfeed.vue
│             └── litigation/
│                 └── ActiveCases.vue
│                 └── AssignedCases.vue
│                 └── DisputeAnalytics.vue
│                 └── LegalTimeline.vue
│                 └── MatterIntake.vue
│   │   ├── AccountsView.vue      ← Your main accounts page ✓
│   │   ├── ContractsView.vue     ← Future contracts page
│   │   ├── DealsView.vue     ← Future dashboard
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Modal.vue         ← Reusable modal component
│   │   │   ├── Button.vue        ← Reusable button component
│   │   │   └── Table.vue         ← Reusable table component
│   │   ├── AccountForm.vue       ← Account form component
│   ├── router/
│   │   └── index.js              ← Route definitions
│   └── services/
│       └── api.js                ← API service layer
├── database/
│   ├── schema.sql
│   └── seeds/
└── backend/
    └── server.js

BACKEND SET UP (PostgreSQL)

── database/
│   ├── schema.sql (table definitions)
│   ├── migrations/ (database changes over time)
│   ├── seeds/ (sample data)
│   └── functions/ (PostgreSQL functions)
└── backend/ (new folder we'll create)
    ├── server.js
    ├── routes/
    └── config/
    
Phase 1: Database Architecture Setup
1. Convert table CSVs to PostgreSQL Tables
## ENUM vs VARCHAR: The Right Choice

For fields with limited, predefined choices, ENUMs are superior because they:
- **Enforce data integrity** (like legal precedents - only valid options allowed)
- **Save storage space** 
- **Prevent typos/inconsistencies**
- **Make queries faster**
- **Self-document the valid options**

## Corrected Database Schema with ENUMs

Here's your accounts table properly designed with ENUMs:

```sql
-- database/phase1_accounts_with_enums.sql

-- Create the ENUM types first
CREATE TYPE account_type_enum AS ENUM ('customer', 'vendor', 'partner', 'competitor', 'prospect');

CREATE TYPE industry_enum AS ENUM (
    'technology', 'finance', 'healthcare', 'retail', 'manufacturing', 
    'legal', 'consulting', 'real_estate', 'education', 'government',
    'non_profit', 'entertainment', 'telecommunications', 'energy', 'other'
);

CREATE TYPE risk_level_enum AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE account_status_enum AS ENUM ('active', 'inactive', 'prospect', 'churned', 'on_hold');

-- Your specific ENUMs from your data
CREATE TYPE enum_sector AS ENUM (
    'employment', 'entertainment', 'finance', 'marketing', 'medical', 
    'retail', 'services', 'software', 'technology', 'telecommunications'
);

CREATE TYPE enum_office_location AS ENUM (
    'Belgium', 'Brazil', 'China', 'Germany', 'Italy', 'Japan', 'Jordan', 
    'Kenya', 'Korea', 'Norway', 'Panama', 'Philippines', 'Poland', 'Romania', 'United States'
);

CREATE TYPE enum_subsidiary_of AS ENUM (
    'Acme Corporation', 'Bubba Gump', 'Golddex', 'Inity', 'Massive Dynamic', 'Sonron', 'Warephase'
);

-- Now create the table with proper ENUM columns
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    
    -- Use ENUMs instead of VARCHAR for controlled fields
    account_type account_type_enum NOT NULL,
    industry industry_enum,
    sector enum_sector,
    office_location enum_office_location,
    subsidiary_of enum_subsidiary_of,
    account_status account_status_enum DEFAULT 'active',
    
    -- Financial info
    annual_revenue VARCHAR(50), -- Could also be NUMERIC if you want calculations
    
    -- Contact info
    primary_contact VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(500), -- URLs can be longer
    
    -- Location
    headquarters_location TEXT, -- Free text for full address
    
    -- Scores (constrained integers)
    risk_score INTEGER DEFAULT 50 CHECK (risk_score >= 0 AND risk_score <= 100),
    health_score INTEGER DEFAULT 75 CHECK (health_score >= 0 AND health_score <= 100),
    
    -- Additional info
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(255),
    
    -- Add some useful constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT unique_company_email UNIQUE (company_name, email)
);

-- Create an index for faster searches
CREATE INDEX idx_accounts_company_name ON accounts (company_name);
CREATE INDEX idx_accounts_account_type ON accounts (account_type);
CREATE INDEX idx_accounts_industry ON accounts (industry);
```

## Frontend Integration: Dynamic Dropdowns

**The beauty of ENUMs:** You can query them dynamically for your Vue dropdowns!

```javascript
// backend/server.js - Add this route to get ENUM values
app.get('/api/enums', async (req, res) => {
  try {
    const enumQueries = {
      accountTypes: `
        SELECT unnest(enum_range(NULL::account_type_enum)) as value
      `,
      industries: `
        SELECT unnest(enum_range(NULL::industry_enum)) as value
      `,
      sectors: `
        SELECT unnest(enum_range(NULL::enum_sector)) as value
      `,
      locations: `
        SELECT unnest(enum_range(NULL::enum_office_location)) as value
      `,
      subsidiaries: `
        SELECT unnest(enum_range(NULL::enum_subsidiary_of)) as value
      `
    };

    const results = {};
    for (const [key, query] of Object.entries(enumQueries)) {
      const result = await pool.query(query);
      results[key] = result.rows.map(row => row.value);
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

## Updated AccountsView.vue with Dynamic ENUMs

```vue
<!-- In your AccountsView.vue template, update the form selects -->
<template>
  <!-- ... existing code ... -->
  
  <div class="form-group">
    <label class="form-label">Account Type</label>
    <select v-model="accountForm.accountType" class="form-select" required>
      <option value="">Select account type</option>
      <option 
        v-for="type in enums.accountTypes" 
        :key="type" 
        :value="type"
      >
        {{ formatEnumValue(type) }}
      </option>
    </select>
  </div>

  <div class="form-group">
    <label class="form-label">Industry</label>
    <select v-model="accountForm.industry" class="form-select" required>
      <option value="">Select industry</option>
      <option 
        v-for="industry in enums.industries" 
        :key="industry" 
        :value="industry"
      >
        {{ formatEnumValue(industry) }}
      </option>
    </select>
  </div>

  <div class="form-group">
    <label class="form-label">Sector</label>
    <select v-model="accountForm.sector" class="form-select">
      <option value="">Select sector</option>
      <option 
        v-for="sector in enums.sectors" 
        :key="sector" 
        :value="sector"
      >
        {{ formatEnumValue(sector) }}
      </option>
    </select>
  </div>

  <div class="form-group">
    <label class="form-label">Office Location</label>
    <select v-model="accountForm.officeLocation" class="form-select">
      <option value="">Select location</option>
      <option 
        v-for="location in enums.locations" 
        :key="location" 
        :value="location"
      >
        {{ location }}
      </option>
    </select>
  </div>

  <!-- ... rest of form ... -->
</template>

<script setup>
// Add to your existing script
import { ref, computed, onMounted } from "vue"

// Add enums state
const enums = ref({
  accountTypes: [],
  industries: [],
  sectors: [],
  locations: [],
  subsidiaries: []
})

// Load ENUMs on component mount
onMounted(async () => {
  try {
    // Load accounts
    const accountsResponse = await fetch('http://localhost:3001/api/accounts');
    accounts.value = await accountsResponse.json();
    
    // Load ENUM values for dropdowns
    const enumsResponse = await fetch('http://localhost:3001/api/enums');
    enums.value = await enumsResponse.json();
    
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});

// Helper function to format ENUM values for display
function formatEnumValue(value) {
  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Update your form structure to match ENUM fields
const defaultAccountForm = {
  companyName: '',
  accountType: '',
  industry: '',
  sector: '',
  officeLocation: '',
  subsidiaryOf: '',
  annualRevenue: '',
  primaryContact: '',
  email: '',
  phone: '',
  website: '',
  headquartersLocation: '', // Renamed for clarity
  riskScore: 50,
  healthScore: 75,
  notes: ''
}
</script>
```

## CSV to SQL Conversion with ENUMs

When converting your CSV, you'll need to handle the ENUM values:

```javascript
// scripts/csv_to_sql_with_enums.js
const fs = require('fs');
const csv = require('csv-parser');

const results = [];
fs.createReadStream('data/accounts.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const sqlInserts = results.map(row => {
      // Sanitize and validate ENUM values
      const accountType = row.account_type ? `'${row.account_type}'` : 'NULL';
      const industry = row.industry ? `'${row.industry}'` : 'NULL';
      const sector = row.sector ? `'${row.sector}'` : 'NULL';
      const officeLocation = row.office_location ? `'${row.office_location}'` : 'NULL';
      const subsidiaryOf = row.subsidiary_of ? `'${row.subsidiary_of}'` : 'NULL';
      
      return `
INSERT INTO accounts (
  company_name, account_type, industry, sector, office_location, subsidiary_of,
  annual_revenue, primary_contact, email, phone, website, headquarters_location,
  risk_score, health_score, notes
) VALUES (
  '${row.company_name}',
  ${accountType}::account_type_enum,
  ${industry}::industry_enum,
  ${sector}::enum_sector,
  ${officeLocation}::enum_office_location,
  ${subsidiaryOf}::enum_subsidiary_of,
  '${row.annual_revenue}',
  '${row.primary_contact}',
  '${row.email}',
  '${row.phone}',
  '${row.website}',
  '${row.headquarters_location}',
  ${row.risk_score || 50},
  ${row.health_score || 75},
  '${row.notes || ''}'
);`;
    }).join('\n');
    
    fs.writeFileSync('database/accounts_data_with_enums.sql', sqlInserts);
    console.log('SQL file with ENUMs created!');
  });
```

## Benefits for Your Legal Use Case

1. **Data Integrity**: Like legal statutes - only valid values allowed
2. **Consistency**: No "Technology" vs "tech" vs "Tech" variations
3. **Easy Updates**: Add new ENUM values as your business grows
4. **Better Queries**: `WHERE account_type = 'customer'` is faster than LIKE operations
5. **Self-Documenting**: The ENUM definition shows all valid business categories

**Your approach is spot-on!** Always use ENUMs for controlled vocabularies in legal/business applications.
