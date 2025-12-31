# WCO Data Model 3.10

**World Customs Organization Data Model for International Trade**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Core Principles](#core-principles)
3. [Data Model Structure](#data-model-structure)
4. [Key Entities](#key-entities)
5. [JUL Implementation](#jul-implementation)
6. [Data Validation Rules](#data-validation-rules)
7. [Best Practices](#best-practices)

---

## Introduction

### What is the WCO Data Model?

The **WCO Data Model** is a comprehensive global standard developed by the World Customs Organization to harmonize and standardize the electronic exchange of information between Customs administrations and trade stakeholders. Version 3.10 is the current standard implemented in modern customs systems worldwide.

### Purpose and Objectives

- **Harmonization**: Create a single global standard for customs data
- **Interoperability**: Enable seamless data exchange between countries
- **Trade Facilitation**: Reduce complexity and costs for international traders
- **Security**: Enhance border security through standardized data elements
- **Efficiency**: Streamline customs processes and reduce processing times

### Benefits for Angola JUL System

1. **International Compatibility**: Align with global customs best practices
2. **Reduced Errors**: Standardized data structures minimize data quality issues
3. **Easier Integration**: Common data model simplifies external system integration
4. **Future-Proof**: Support for emerging trade requirements and technologies
5. **Regulatory Compliance**: Meet WCO SAFE Framework requirements

---

## Core Principles

### 1. Information Reusability

Data elements should be defined once and reused across multiple business processes:

- **Single Source of Truth**: Each data element has one authoritative source
- **Reference Data**: Common code lists shared across all declarations
- **Party Information**: Trader details reused across multiple transactions

### 2. Business Process Orientation

The data model aligns with actual customs and trade business processes:

- **Declaration Processing**: Complete lifecycle from submission to clearance
- **Cargo Movement**: Track goods from origin to destination
- **Risk Assessment**: Support for risk-based controls
- **Post-Clearance Audit**: Historical data for audit purposes

### 3. Technology Independence

The model is independent of specific technologies:

- **Implementation Flexibility**: Can be implemented in XML, JSON, databases
- **Protocol Agnostic**: Works with SOAP, REST, or other protocols
- **Platform Independent**: Not tied to specific software or hardware

### 4. Extensibility

The model allows for national extensions:

- **Core Requirements**: Mandatory WCO data elements
- **National Extensions**: Country-specific additional requirements
- **Backward Compatibility**: Extensions don't break core compliance

---

## Data Model Structure

### Hierarchical Organization

```
Declaration
├── Header Information
│   ├── Functional Reference ID
│   ├── Declaration Type
│   ├── Customs Office
│   └── Declaration Parties
├── Goods Shipment
│   ├── Consignment
│   │   ├── Transport Details
│   │   └── Container Information
│   └── Goods Items (1 to many)
│       ├── Commodity Details
│       ├── Valuation
│       ├── Origin Information
│       └── Previous Documents
└── Supporting Documents
```

### Data Categories

#### 1. **Header Data**
- Declaration metadata and control information
- Submitter and declarant identification
- Customs office and location codes
- Procedural codes and clearance type

#### 2. **Party Data**
- Traders, agents, carriers, and other stakeholders
- Identification numbers (tax ID, EORI, etc.)
- Addresses and communication details
- Roles and authorizations

#### 3. **Goods Data**
- Commodity classification (HS codes)
- Commercial and statistical values
- Quantities, weights, and measurements
- Origin and destination information

#### 4. **Transport Data**
- Mode of transport and conveyance details
- Container numbers and seal information
- Route and itinerary
- Departure and arrival locations

#### 5. **Document Data**
- Supporting documents and certificates
- Previous administrative references
- Licenses and permits
- Invoices and packing lists

---

## Key Entities

### 1. Declaration

The central entity representing a customs declaration (DU - Declaração Única).

**Core Attributes:**

| Field | Type | Description | WCO Reference |
|-------|------|-------------|---------------|
| `functional_reference_id` | VARCHAR(35) | Unique declaration identifier | 2/5 |
| `declaration_type_code` | VARCHAR(3) | Import/Export/Transit code | 1/1 |
| `declaration_office_id` | VARCHAR(8) | Lodgement customs office | 5/27 |
| `goods_location_code` | VARCHAR(17) | Location of goods (UN/LOCODE) | 5/23 |
| `total_gross_mass` | DECIMAL(16,6) | Total weight in kg | 6/5 |
| `currency_code` | VARCHAR(3) | Currency (ISO 4217) | 6/14 |

**JUL Database Implementation:**

```sql
CREATE TABLE declarations (
    declaration_id UUID PRIMARY KEY,
    functional_reference_id VARCHAR(35) NOT NULL UNIQUE,
    declaration_type_code VARCHAR(3) NOT NULL,
    declaration_office_id VARCHAR(8) NOT NULL,
    goods_location_code VARCHAR(17),
    declarant_party_id UUID REFERENCES parties(party_id),
    representative_party_id UUID REFERENCES parties(party_id),
    border_transport_means JSONB,
    total_gross_mass DECIMAL(16,6),
    total_packages INTEGER,
    currency_code VARCHAR(3) DEFAULT 'AOA',
    created_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_datetime TIMESTAMP WITH TIME ZONE,
    acceptance_datetime TIMESTAMP WITH TIME ZONE,
    clearance_datetime TIMESTAMP WITH TIME ZONE,
    wco_data_model_version VARCHAR(10) DEFAULT '3.10',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    CONSTRAINT valid_declaration_type CHECK (declaration_type_code IN ('IM', 'EX', 'T1', 'T2'))
);

-- Indexes for performance
CREATE INDEX idx_declarations_ref ON declarations(functional_reference_id);
CREATE INDEX idx_declarations_status ON declarations(status);
CREATE INDEX idx_declarations_submission ON declarations(submission_datetime);
```

### 2. Goods Item

Individual line items within a declaration, each representing a commodity.

**Core Attributes:**

| Field | Type | Description | WCO Reference |
|-------|------|-------------|---------------|
| `sequence_numeric` | INTEGER | Item sequence number | 1/6 |
| `commodity_code` | VARCHAR(22) | HS classification code | 6/14 |
| `customs_value_amount` | DECIMAL(18,2) | Customs valuation | 4/14 |
| `statistical_value_amount` | DECIMAL(18,2) | Statistical value | 4/15 |
| `net_weight_measure` | DECIMAL(16,6) | Net weight in kg | 6/1 |
| `gross_weight_measure` | DECIMAL(16,6) | Gross weight in kg | 6/5 |
| `origin_country_code` | VARCHAR(2) | Country of origin (ISO 3166) | 5/16 |

**JUL Database Implementation:**

```sql
CREATE TABLE goods_items (
    goods_item_id UUID PRIMARY KEY,
    declaration_id UUID NOT NULL REFERENCES declarations(declaration_id) ON DELETE CASCADE,
    sequence_numeric INTEGER NOT NULL,
    commodity_code VARCHAR(22) NOT NULL,
    commodity_code_list_id VARCHAR(3) DEFAULT 'HS',
    commodity_code_version VARCHAR(10) DEFAULT '2022',
    goods_description TEXT NOT NULL,
    customs_value_amount DECIMAL(18,2),
    customs_value_currency_id VARCHAR(3),
    statistical_value_amount DECIMAL(18,2),
    net_weight_measure DECIMAL(16,6),
    gross_weight_measure DECIMAL(16,6),
    supplementary_units DECIMAL(16,6),
    supplementary_unit_code VARCHAR(3),
    origin_country_code VARCHAR(2),
    export_country_code VARCHAR(2),
    destination_country_code VARCHAR(2),
    preference_code VARCHAR(3),
    procedure_code VARCHAR(7),
    created_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_item_sequence UNIQUE (declaration_id, sequence_numeric),
    CONSTRAINT valid_hs_code CHECK (LENGTH(commodity_code) >= 6)
);

-- Indexes for queries
CREATE INDEX idx_goods_items_declaration ON goods_items(declaration_id);
CREATE INDEX idx_goods_items_commodity ON goods_items(commodity_code);
CREATE INDEX idx_goods_items_origin ON goods_items(origin_country_code);
```

### 3. Party

Represents all parties involved in the transaction (declarant, importer, exporter, agent, etc.).

**Core Attributes:**

| Field | Type | Description | WCO Reference |
|-------|------|-------------|---------------|
| `identification_id` | VARCHAR(35) | Tax ID or registration number | 3/1 |
| `name` | VARCHAR(70) | Party legal name | 3/2 |
| `function_code` | VARCHAR(3) | Party role (declarant, agent, etc.) | 3/21 |
| `address_line` | VARCHAR(70) | Street address | 3/3 |
| `city_name` | VARCHAR(35) | City | 3/4 |
| `country_code` | VARCHAR(2) | Country (ISO 3166) | 3/5 |

**Common Function Codes:**

- **CN**: Consignee (importer)
- **CZ**: Consignor (exporter)
- **DE**: Declarant
- **AF**: Agent/Representative
- **CA**: Carrier
- **MF**: Manufacturer
- **IM**: Importer
- **EX**: Exporter

**JUL Database Implementation:**

```sql
CREATE TABLE parties (
    party_id UUID PRIMARY KEY,
    identification_id VARCHAR(35) NOT NULL,
    identification_type VARCHAR(3),
    name VARCHAR(70) NOT NULL,
    address_line VARCHAR(70),
    city_name VARCHAR(35),
    country_sub_division_code VARCHAR(9),
    postcode_id VARCHAR(9),
    country_code VARCHAR(2) NOT NULL,
    communication_phone VARCHAR(50),
    communication_email VARCHAR(256),
    communication_fax VARCHAR(50),
    authorization_id VARCHAR(35),
    created_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE declaration_parties (
    declaration_party_id UUID PRIMARY KEY,
    declaration_id UUID NOT NULL REFERENCES declarations(declaration_id) ON DELETE CASCADE,
    party_id UUID NOT NULL REFERENCES parties(party_id),
    function_code VARCHAR(3) NOT NULL,
    sequence_numeric INTEGER,
    CONSTRAINT unique_declaration_party_function UNIQUE (declaration_id, function_code, sequence_numeric)
);

-- Indexes
CREATE INDEX idx_parties_identification ON parties(identification_id);
CREATE INDEX idx_parties_country ON parties(country_code);
CREATE INDEX idx_declaration_parties_declaration ON declaration_parties(declaration_id);
```

### 4. Transport Details

Information about the means of transport and logistics.

**JUL Database Implementation:**

```sql
CREATE TABLE transport_means (
    transport_means_id UUID PRIMARY KEY,
    declaration_id UUID NOT NULL REFERENCES declarations(declaration_id),
    transport_mode_code VARCHAR(2) NOT NULL, -- 1=Sea, 2=Rail, 3=Road, 4=Air, etc.
    identification_id VARCHAR(35), -- Vehicle/vessel registration
    identification_type_code VARCHAR(3), -- 10=IMO number, 11=Name, etc.
    nationality_code VARCHAR(2), -- Country of registration
    type_code VARCHAR(4), -- Type of transport means
    created_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE containers (
    container_id UUID PRIMARY KEY,
    declaration_id UUID NOT NULL REFERENCES declarations(declaration_id),
    identification_id VARCHAR(17) NOT NULL, -- Container number (ISO 6346)
    seal_id VARCHAR(20), -- Seal number
    type_code VARCHAR(4), -- Container type
    CONSTRAINT valid_container_id CHECK (identification_id ~ '^[A-Z]{4}[0-9]{7}$')
);
```

### 5. Documents

Supporting documents attached to declarations.

**JUL Database Implementation:**

```sql
CREATE TABLE declaration_documents (
    document_id UUID PRIMARY KEY,
    declaration_id UUID REFERENCES declarations(declaration_id),
    goods_item_id UUID REFERENCES goods_items(goods_item_id),
    type_code VARCHAR(4) NOT NULL, -- Document type (WCO code list)
    reference_id VARCHAR(35) NOT NULL, -- Document number/reference
    issue_date DATE,
    expiry_date DATE,
    issuer_party_id UUID REFERENCES parties(party_id),
    minio_storage_path VARCHAR(500), -- Path in MinIO
    file_name VARCHAR(255),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    created_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_document_type CHECK (type_code IN ('380', '705', '861', '952', '954', 'N325', 'N730', 'N741'))
);
```

**Common Document Type Codes:**

- **380**: Commercial Invoice
- **705**: Packing List
- **861**: Certificate of Origin
- **952**: Import License
- **954**: Export License
- **N325**: Bill of Lading
- **N730**: Transport Document
- **N741**: Insurance Certificate

---

## JUL Implementation

### Mapping WCO to JUL Microservices

The WCO Data Model is distributed across JUL microservices:

#### Declaration Management Service (Port 8084)
- Implements complete Declaration entity
- Manages Goods Items with full WCO compliance
- Handles declaration lifecycle states
- Integrates with ASYCUDA using WCO-compliant messages

#### Company Management Service (Port 8081)
- Implements Party entity for company registration
- Manages party identification and authorization
- Links parties to Keycloak user accounts

#### Document Management Service (Port 8085)
- Implements Document entity with MinIO storage
- Manages document metadata in PostgreSQL
- Validates document types against WCO code lists

#### Master Data Management Service (Port 8086)
- Maintains HS Code classification (WCO Harmonized System)
- Manages country codes (ISO 3166)
- Synchronizes currency codes (ISO 4217)
- Distributes reference data to all services

### WCO Compliance Checklist

✅ **Data Elements**
- All mandatory WCO data elements implemented
- Optional elements available based on business needs
- National extensions for Angola-specific requirements

✅ **Code Lists**
- HS 2017 and HS 2022 classification
- WCO document type codes
- Transport mode codes
- Customs procedure codes

✅ **Message Formats**
- UN/EDIFACT CUSDEC for ASYCUDA
- UN/EDIFACT CUSRES for responses
- JSON/XML representations for internal APIs

✅ **Validation Rules**
- HS code format validation
- Value consistency checks
- Weight and quantity validations
- Date range validations

---

## Data Validation Rules

### HS Code Validation

```csharp
public class HSCodeValidator
{
    public ValidationResult ValidateHSCode(string commodityCode)
    {
        var errors = new List<string>();
        
        // Rule 1: Minimum 6 digits (WCO requirement)
        if (commodityCode.Length < 6)
        {
            errors.Add("HS code must be at least 6 digits");
        }
        
        // Rule 2: Numeric only
        if (!Regex.IsMatch(commodityCode, @"^\d+$"))
        {
            errors.Add("HS code must contain only digits");
        }
        
        // Rule 3: Valid chapter (01-99)
        var chapter = commodityCode.Substring(0, 2);
        var chapterNum = int.Parse(chapter);
        if (chapterNum < 1 || chapterNum > 99)
        {
            errors.Add("Invalid HS chapter code");
        }
        
        // Rule 4: Check against master data
        if (!_masterDataService.IsValidHSCode(commodityCode))
        {
            errors.Add($"HS code {commodityCode} not found in current classification");
        }
        
        return new ValidationResult(errors.Count == 0, errors);
    }
}
```

### Value Validation

```csharp
public class ValueValidator
{
    public ValidationResult ValidateCustomsValue(GoodsItem item)
    {
        var errors = new List<string>();
        
        // Rule 1: Customs value must be positive
        if (item.CustomsValueAmount <= 0)
        {
            errors.Add("Customs value must be greater than zero");
        }
        
        // Rule 2: Statistical value should not be less than customs value
        if (item.StatisticalValueAmount < item.CustomsValueAmount)
        {
            errors.Add("Statistical value should not be less than customs value");
        }
        
        // Rule 3: Currency must be valid ISO 4217
        if (!_masterDataService.IsValidCurrency(item.CurrencyCode))
        {
            errors.Add($"Invalid currency code: {item.CurrencyCode}");
        }
        
        // Rule 4: Reasonable value check based on commodity
        var avgValue = _statisticsService.GetAverageValue(item.CommodityCode);
        if (item.CustomsValueAmount < avgValue * 0.5 || item.CustomsValueAmount > avgValue * 3)
        {
            errors.Add("Value significantly differs from expected range - may require additional verification");
        }
        
        return new ValidationResult(errors.Count == 0, errors);
    }
}
```

### Weight Validation

```csharp
public class WeightValidator
{
    public ValidationResult ValidateWeights(GoodsItem item)
    {
        var errors = new List<string>();
        
        // Rule 1: Net weight must be positive
        if (item.NetWeightMeasure <= 0)
        {
            errors.Add("Net weight must be greater than zero");
        }
        
        // Rule 2: Gross weight must be positive
        if (item.GrossWeightMeasure <= 0)
        {
            errors.Add("Gross weight must be greater than zero");
        }
        
        // Rule 3: Gross weight must be >= net weight
        if (item.GrossWeightMeasure < item.NetWeightMeasure)
        {
            errors.Add("Gross weight cannot be less than net weight");
        }
        
        // Rule 4: Reasonable packaging weight (gross - net should be < 30% of gross)
        var packagingWeight = item.GrossWeightMeasure - item.NetWeightMeasure;
        var packagingRatio = packagingWeight / item.GrossWeightMeasure;
        if (packagingRatio > 0.3)
        {
            errors.Add("Packaging weight seems unusually high - please verify");
        }
        
        return new ValidationResult(errors.Count == 0, errors);
    }
}
```

---

## Best Practices

### 1. Data Quality

**Always Validate at Entry**
- Implement client-side validation for immediate feedback
- Enforce server-side validation for security
- Use WCO code lists for dropdown selections
- Provide auto-complete for common entries

**Maintain Data Consistency**
- Use database constraints for critical relationships
- Implement referential integrity checks
- Validate cross-field dependencies
- Perform periodic data quality audits

### 2. Performance Optimization

**Efficient Queries**
```sql
-- Good: Use indexes for common queries
CREATE INDEX idx_declarations_status_submission 
ON declarations(status, submission_datetime DESC);

-- Good: Fetch only needed columns
SELECT declaration_id, functional_reference_id, status
FROM declarations
WHERE status = 'SUBMITTED';

-- Avoid: Full table scans
-- Avoid: SELECT * FROM declarations;
```

**Caching Strategy**
```csharp
// Cache frequently accessed reference data
public class HSCodeService
{
    private readonly IDistributedCache _cache;
    
    public async Task<HSCode> GetHSCode(string code)
    {
        var cacheKey = $"hs_code:{code}";
        var cached = await _cache.GetStringAsync(cacheKey);
        
        if (cached != null)
        {
            return JsonSerializer.Deserialize<HSCode>(cached);
        }
        
        var hsCode = await _database.GetHSCode(code);
        await _cache.SetStringAsync(cacheKey, 
            JsonSerializer.Serialize(hsCode),
            new DistributedCacheEntryOptions 
            { 
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24) 
            });
            
        return hsCode;
    }
}
```

### 3. Error Handling

**Provide Meaningful Error Messages**
```csharp
public class WCOValidationError
{
    public string FieldPath { get; set; } // e.g., "GoodsItem[2].CommodityCode"
    public string ErrorCode { get; set; } // e.g., "WCO_INVALID_HS_CODE"
    public string Message { get; set; } // User-friendly message
    public string WCOReference { get; set; } // WCO Data Element reference
    public string SuggestedAction { get; set; } // How to fix
}

// Example error response
{
    "valid": false,
    "errors": [
        {
            "fieldPath": "GoodsItem[1].CommodityCode",
            "errorCode": "WCO_INVALID_HS_CODE",
            "message": "HS code must be at least 6 digits",
            "wcoReference": "6/14",
            "suggestedAction": "Please enter the complete 6-digit HS code or select from the classification search"
        }
    ]
}
```

### 4. Documentation

**Code Comments**
```csharp
/// <summary>
/// Validates declaration against WCO Data Model 3.10 requirements.
/// Reference: WCO Data Model Version 3.10, Declaration entity
/// </summary>
/// <param name="declaration">The declaration to validate</param>
/// <returns>ValidationResult with errors if any</returns>
public ValidationResult ValidateWCOCompliance(Declaration declaration)
{
    // WCO 2/5: Functional Reference ID is mandatory
    if (string.IsNullOrEmpty(declaration.FunctionalReferenceId))
    {
        errors.Add(new ValidationError("2/5", "Functional Reference ID is required"));
    }
    
    // WCO 1/1: Declaration Type Code is mandatory
    if (string.IsNullOrEmpty(declaration.DeclarationTypeCode))
    {
        errors.Add(new ValidationError("1/1", "Declaration Type Code is required"));
    }
    
    // Continue validation...
}
```

### 5. Testing

**Unit Test Example**
```csharp
[TestClass]
public class WCODataModelTests
{
    [TestMethod]
    public void Declaration_WithValidWCOData_ShouldPassValidation()
    {
        // Arrange
        var declaration = new Declaration
        {
            FunctionalReferenceId = "DU2025001234",
            DeclarationTypeCode = "IM",
            DeclarationOfficeId = "AO001",
            GoodsLocationCode = "AOLAD",
            TotalGrossMass = 1000.50m,
            CurrencyCode = "AOA"
        };
        
        // Act
        var result = _validator.ValidateWCOCompliance(declaration);
        
        // Assert
        Assert.IsTrue(result.IsValid);
        Assert.AreEqual(0, result.Errors.Count);
    }
    
    [TestMethod]
    public void HSCode_WithInvalidLength_ShouldFailValidation()
    {
        // Arrange
        var goodsItem = new GoodsItem
        {
            CommodityCode = "1234" // Only 4 digits, minimum is 6
        };
        
        // Act
        var result = _validator.ValidateHSCode(goodsItem.CommodityCode);
        
        // Assert
        Assert.IsFalse(result.IsValid);
        Assert.IsTrue(result.Errors.Any(e => e.Contains("at least 6 digits")));
    }
}
```

---

## References

### Official WCO Documentation
- **WCO Data Model Version 3.10**: [WCO Website](http://www.wcoomd.org/)
- **Revised Kyoto Convention (RKC)**: International Convention on Simplification and Harmonization
- **WCO SAFE Framework of Standards**: Securing and Facilitating Global Trade
- **WCO Harmonized System**: Commodity classification nomenclature (HS 2017/2022)
- **WCO Framework for Coordinated Border Management**: Multi-agency cooperation
- **WCO Time Release Study**: Measuring customs clearance efficiency

### JUL Project Documents
- JUL High Level Design Document
- JUL-AGT Integration Control Document (ASYCUDA)
- JUL Data Architecture Specification

### Related Standards
- [UN/EDIFACT Standards](un-edifact.md)
- [HS Classification System](hs-classification.md)
- [ISO Standards](iso-standards.md)

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Author**: JUL Technical Team  
**Status**: Production Ready
