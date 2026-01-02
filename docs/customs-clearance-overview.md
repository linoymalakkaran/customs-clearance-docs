# Customs Clearance Scenarios - Overview

**Complete Guide to All Customs Clearance Processes**

---

## Introduction

This module provides comprehensive end-to-end scenarios for all types of customs clearance operations in the JUL (Janela Única de Logística) system. Each scenario is documented with:

- Step-by-step process flows
- Required documents
- System interactions
- Validation rules
- Payment procedures
- Common issues and resolutions
- Code examples

---

## Available Scenarios

### 1. [Import Clearance](customs-clearance/import-clearance)
Complete import clearance process from cargo arrival to goods release.

**Sub-scenarios**:
- Sea cargo import
- Air cargo import
- Land/road cargo import
- Containerized cargo
- Bulk cargo
- Dangerous goods import
- Perishable goods import

### 2. [Export Clearance](customs-clearance/export-clearance)
Export clearance process from declaration to cargo departure.

**Sub-scenarios**:
- Sea cargo export
- Air cargo export
- Land/road cargo export
- Export with incentives
- Re-export of goods
- Export of restricted goods

### 3. [Transit Operations](customs-clearance/transit-operations)
Transit and transshipment procedures.

**Sub-scenarios**:
- International transit through Angola
- Transshipment in Angolan ports
- Customs transit bond
- Sealed container transit
- Transit to landlocked countries

### 4. [Temporary Admission](customs-clearance/temporary-admission)
Temporary import with re-export obligation.

**Sub-scenarios**:
- Exhibition goods (ATA Carnet)
- Professional equipment
- Commercial samples
- Vehicles for temporary use
- Equipment for infrastructure projects

### 5. [Customs Warehousing](customs-clearance/customs-warehousing)
Storage in customs warehouses and bonded areas.

**Sub-scenarios**:
- Type I warehouse (public)
- Type II warehouse (private)
- Free zone operations
- Duty suspension warehousing
- Warehouse-to-warehouse transfer

### 6. [Simplified Procedures](customs-clearance/simplified-procedures)
Fast-track clearance for authorized operators.

**Sub-scenarios**:
- AEO clearance
- Pre-arrival processing
- Express courier clearance
- Postal imports
- Low-value imports (de minimis)

### 7. [Special Cases](customs-clearance/special-cases)
Unique situations requiring special handling.

**Sub-scenarios**:
- Government imports
- Diplomatic imports
- Humanitarian aid
- Personal effects and household goods
- Returned goods
- Defective goods replacement

### 8. [Risk-Based Clearance](customs-clearance/risk-based-clearance)
ASYCUDA risk assessment channels.

**Scenarios**:
- Green channel (automatic release)
- Yellow channel (documentary check)
- Orange channel (physical inspection)
- Red channel (detailed examination)

### 9. [Post-Clearance Audit](customs-clearance/post-clearance-audit)
Verification after goods release.

**Scenarios**:
- Random audit selection
- Risk-targeted audit
- Self-assessment verification
- Compliance audit

### 10. [Appeals and Disputes](customs-clearance/appeals-disputes)
Handling customs disputes and appeals.

**Scenarios**:
- Classification disputes
- Valuation disputes
- Origin disputes
- Penalty appeals
- Administrative review

---

## Process Flow Overview

### Typical Import Clearance Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRE-ARRIVAL PHASE                           │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Cargo Manifest Submission (Carrier)                             │
│ 2. Pre-arrival Declaration (Importer/Agent)                        │
│ 3. Document Upload (Invoices, Packing Lists, etc.)                │
│ 4. Initial Risk Assessment                                         │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         ARRIVAL PHASE                               │
├─────────────────────────────────────────────────────────────────────┤
│ 5. Cargo Arrival Notification                                      │
│ 6. Cargo Discharge from Vessel/Aircraft                            │
│ 7. Temporary Storage in Port/Airport                               │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DECLARATION PHASE                              │
├─────────────────────────────────────────────────────────────────────┤
│ 8. Final Declaration Submission                                    │
│ 9. System Validation (WCO Data Model)                             │
│ 10. Document Verification                                          │
│ 11. Risk Assessment & Channel Selection                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      ASSESSMENT PHASE                               │
├─────────────────────────────────────────────────────────────────────┤
│ 12. HS Code Verification                                           │
│ 13. Customs Valuation                                              │
│ 14. Duty & Tax Calculation                                         │
│ 15. OGA Requirements Check (if applicable)                         │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       PAYMENT PHASE                                 │
├─────────────────────────────────────────────────────────────────────┤
│ 16. Payment Assessment Notice                                      │
│ 17. Payment via Bank/Mobile Money                                  │
│ 18. Payment Confirmation                                           │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      INSPECTION PHASE (if required)                 │
├─────────────────────────────────────────────────────────────────────┤
│ 19. Inspection Assignment                                          │
│ 20. Physical Examination                                           │
│ 21. Sample Collection (if needed)                                  │
│ 22. Inspection Report                                              │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       RELEASE PHASE                                 │
├─────────────────────────────────────────────────────────────────────┤
│ 23. Clearance Certificate Generation                               │
│ 24. Exit Authorization                                             │
│ 25. Cargo Release to Importer                                      │
│ 26. Transport to Final Destination                                 │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    POST-CLEARANCE PHASE                             │
├─────────────────────────────────────────────────────────────────────┤
│ 27. Post-clearance Audit (Risk-based)                             │
│ 28. Compliance Monitoring                                          │
│ 29. Data Analytics & Feedback                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Actors in Customs Clearance

### Primary Stakeholders

1. **Importer/Exporter**
   - Owner of goods
   - Responsible for accurate declaration
   - Liable for duties and taxes

2. **Customs Broker/Agent**
   - Licensed representative
   - Prepares and submits declarations
   - Facilitates clearance process

3. **Customs Authority (AGT)**
   - Validates declarations
   - Conducts inspections
   - Collects duties and taxes
   - Issues release authorization

4. **Carrier (Shipping Line, Airline, Trucking Company)**
   - Submits cargo manifest
   - Delivers cargo to port/airport
   - Responsible until customs release

5. **Port/Airport Authority**
   - Manages cargo handling
   - Provides storage facilities
   - Coordinates logistics

6. **Other Government Agencies (OGAs)**
   - Ministry of Health (food/drugs)
   - Ministry of Agriculture (plants/animals)
   - Ministry of Environment (CITES)
   - Central Bank (foreign exchange)
   - INAC (petroleum products)

7. **Bank/Payment Provider**
   - Processes duty payments
   - Issues payment confirmations
   - Manages guarantees/bonds

8. **Inspection Company** (if applicable)
   - Pre-shipment inspection
   - Quality verification
   - Valuation verification

---

## Common Documents Required

### Import Documents

1. **Commercial Invoice**
   - Seller and buyer details
   - Description of goods
   - Unit price and total value
   - Incoterms
   - Payment terms

2. **Packing List**
   - Number of packages
   - Weight (gross and net)
   - Dimensions
   - Marks and numbers

3. **Bill of Lading (B/L) or Air Waybill (AWB)**
   - Proof of shipment
   - Terms of carriage
   - Consignee details

4. **Certificate of Origin**
   - Country of manufacture
   - Producer details
   - Preferential or non-preferential

5. **Insurance Certificate** (if CIF/CIP terms)
   - Coverage details
   - Insured value

6. **Import License** (for restricted goods)
   - Issued by relevant OGA
   - Specific to commodity

7. **Health/Phytosanitary Certificates** (if applicable)
   - Food products
   - Plants and animals
   - Agricultural products

8. **Technical Certificates** (if applicable)
   - Quality certificates
   - Test reports
   - Conformity certificates

### Export Documents

1. **Commercial Invoice**
2. **Packing List**
3. **Export Declaration**
4. **Certificate of Origin** (if preferential treatment)
5. **Phytosanitary Certificate** (for plants/agricultural products)
6. **Export License** (for restricted goods)
7. **Bill of Lading** (issued after loading)

---

## Timeline Expectations

### Standard Import Clearance (Green Channel)
- **Pre-arrival processing**: 1-2 hours
- **Arrival to declaration**: 2-4 hours
- **Declaration to payment**: 2-6 hours
- **Payment to release**: 1-2 hours
- **Total**: 6-14 hours

### Import with Documentary Check (Yellow Channel)
- **Standard process**: 6-14 hours
- **Documentary review**: 4-8 hours
- **Total**: 10-22 hours (1-2 business days)

### Import with Physical Inspection (Orange/Red Channel)
- **Standard process**: 6-14 hours
- **Inspection scheduling**: 4-12 hours
- **Physical examination**: 2-4 hours
- **Report processing**: 2-4 hours
- **Total**: 14-34 hours (2-3 business days)

### Export Clearance
- **Declaration to acceptance**: 2-4 hours
- **Inspection (if required)**: 2-4 hours
- **Loading authorization**: 1-2 hours
- **Total**: 5-10 hours

### AEO Fast-Track
- **Pre-arrival processing**: Immediate
- **Risk assessment**: Automated (seconds)
- **Release**: 2-4 hours
- **Total**: 2-4 hours

---

## Performance Metrics (JUL System)

### 2025 Achievements

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Average Clearance Time | 24 hours | 18 hours | ✅ Exceeded |
| Green Channel Release | < 6 hours | 4.5 hours | ✅ Exceeded |
| Yellow Channel Processing | < 24 hours | 16 hours | ✅ Exceeded |
| Pre-arrival Declaration Rate | 70% | 78% | ✅ Exceeded |
| Electronic Payment Rate | 90% | 94% | ✅ Exceeded |
| Single Submission Rate | 85% | 82% | ⚠️ Near Target |
| User Satisfaction | 80% | 86% | ✅ Exceeded |

### 2026 Targets

| Metric | 2025 Actual | 2026 Target | Improvement |
|--------|-------------|-------------|-------------|
| Average Clearance Time | 18 hours | 12 hours | -33% |
| Green Channel Release | 4.5 hours | 3 hours | -33% |
| Pre-arrival Rate | 78% | 90% | +12% |
| AEO Participation | 45 companies | 100 companies | +122% |
| Paperless Declarations | 94% | 98% | +4% |

---

## Risk Assessment Channels

### Green Channel 🟢
**Automatic Release** - No intervention required

**Criteria**:
- AEO certified importers
- Low-risk commodities
- Consistent compliance history
- Complete documentation
- Accurate past declarations

**Process**: Declaration → Payment → Automatic Release
**Timeline**: 2-6 hours

### Yellow Channel 🟡
**Documentary Check** - Verification of submitted documents

**Criteria**:
- Medium-risk commodities
- New importers (< 6 months)
- Occasional discrepancies
- High-value declarations
- Sensitive product categories

**Process**: Declaration → Payment → Document Review → Release
**Timeline**: 10-22 hours

### Orange Channel 🟠
**Physical Inspection** - Partial examination of goods

**Criteria**:
- First-time importers
- High-risk commodities
- Random selection
- Intelligence information
- Inconsistent documentation

**Process**: Declaration → Payment → Inspection Assignment → Partial Examination → Release
**Timeline**: 14-34 hours

### Red Channel 🔴
**Detailed Examination** - Comprehensive inspection

**Criteria**:
- Very high-risk commodities
- Suspected fraud or smuggling
- Prohibited/restricted goods
- Major discrepancies
- Enforcement actions

**Process**: Declaration → Hold → Investigation → Full Examination → Specialized Tests → Decision
**Timeline**: 3-10 business days

---

## System Integration Points

### JUL integrates with:

1. **ASYCUDA World** - Core customs processing system
2. **SINTECE** - Single window platform
3. **Multicaixa** - Electronic payment system
4. **Banks** - Direct payment integration
5. **Port Community System** - Port operations
6. **INAMAR** - Maritime authority
7. **INAVIC** - Civil aviation authority
8. **Ministry of Health** - Health clearances
9. **MINADER** - Agricultural clearances
10. **MINAMB** - Environmental clearances
11. **BNA** - Central bank (forex)
12. **INAC** - Petroleum products

---

## Next Steps

Select a specific scenario from the list above to explore detailed step-by-step processes, system interactions, and code examples.

**Recommended Learning Path**:
1. Start with [Import Clearance](customs-clearance/import-clearance) - Most common scenario
2. Learn [Risk-Based Clearance](customs-clearance/risk-based-clearance) - Understand channel selection
3. Study [Simplified Procedures](customs-clearance/simplified-procedures) - Fast-track options
4. Explore other scenarios based on your needs

---

**Last Updated**: January 1, 2026  
**Version**: 1.0  
**Status**: Production Ready
