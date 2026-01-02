# International Trade and Customs Standards - Complete Overview

**Comprehensive Guide to Global Standards for Trade Facilitation**

---

## Table of Contents

1. [WCO Standards](#wco-standards)
2. [UN Standards](#un-standards)
3. [WTO Standards](#wto-standards)
4. [ISO Standards](#iso-standards)
5. [IATA Standards](#iata-standards)
6. [IMO Standards](#imo-standards)
7. [GS1 Standards](#gs1-standards)
8. [ICC Standards](#icc-standards)
9. [Other International Standards](#other-international-standards)
10. [National Standards - Angola](#national-standards---angola)

---

## WCO Standards

### 1. Revised Kyoto Convention (RKC)

**Full Name**: International Convention on the Simplification and Harmonization of Customs Procedures (as amended)

**Status**: Entered into force February 3, 2006  
**Signatories**: 100+ countries including Angola

#### Core Principles

**Transparency and Predictability**
- Publication of all customs laws and regulations
- Advance rulings on tariff classification and origin
- Right of appeal against customs decisions
- Consultation with trade before major changes

**Standardization and Simplification**
- Standardized goods declaration and supporting documents
- Minimum data requirements
- Single goods declaration for all purposes
- Use of international standards (WCO Data Model, UN/EDIFACT)

**Simplified Procedures for Authorized Persons**
- Authorized Economic Operator (AEO) programs
- Simplified declaration procedures
- Deferred payment facilities
- Reduced guarantees

**Maximum Use of Information Technology**
- Electronic declaration and processing
- Automated risk assessment
- Electronic payment systems
- Paperless customs clearance

**Minimum Necessary Customs Control**
- Risk management approach
- Audit-based controls
- Post-clearance audit
- Focus resources on high-risk consignments

**Coordinated Interventions**
- Single point of control for all border agencies
- Coordinated inspections
- Information sharing between agencies
- Mutual recognition of controls

**Partnership with Trade**
- Customs-business dialogue
- Memoranda of Understanding with trade
- Joint compliance programs
- Co-regulation approach

#### JUL Implementation

```csharp
public class RKCComplianceChecker
{
    public async Task<RKCComplianceReport> AssessCompliance()
    {
        var report = new RKCComplianceReport();
        
        // Chapter 1: General Principles
        report.Principles.Add(await CheckPublishedLaws());
        report.Principles.Add(await CheckAdvanceRulings());
        report.Principles.Add(await CheckAppealProcess());
        
        // Chapter 2: Definitions
        report.StandardTerminology = await VerifyWCOTerminology();
        
        // Chapter 3: Clearance and Other Customs Formalities
        report.ClearanceProcesses.Add(await CheckElectronicDeclaration());
        report.ClearanceProcesses.Add(await CheckRiskManagement());
        report.ClearanceProcesses.Add(await CheckAuditBasedControls());
        
        // Chapter 4: Duties and Taxes
        report.DutyCalculation = await VerifyDutyCalculationAccuracy();
        report.PaymentFacilities = await CheckDeferredPayment();
        
        // Chapter 5: Security
        report.SecurityMeasures = await VerifySecurityControls();
        report.GuaranteeSystems = await CheckGuaranteeManagement();
        
        return report;
    }
}
```

### 2. SAFE Framework of Standards

**Full Name**: Framework of Standards to Secure and Facilitate Global Trade

**Version**: 2021 edition  
**Purpose**: Supply chain security and trade facilitation

#### Four Core Elements

**Pillar 1: Customs-to-Customs Network**
- Electronic advance cargo information
- Risk assessment consistency
- Communication procedures
- Inspection equipment coordination

**Pillar 2: Customs-Business Partnership (AEO)**
- Security standards
- Authorized Economic Operator certification
- Mutual recognition arrangements
- Tangible benefits for compliant traders

**Pillar 3: Customs-to-Other Government Agencies**
- Coordinated border management
- Integrated cargo processing
- Single window systems
- Information sharing protocols

**Pillar 4: Technology and Innovation**
- Data analytics and artificial intelligence
- Blockchain for supply chain transparency
- Internet of Things (IoT) for cargo monitoring
- Non-intrusive inspection equipment

#### AEO Program Benefits

```csharp
public class AEOBenefitsCalculator
{
    public AEOBenefits CalculateBenefits(string companyNIF)
    {
        var company = _database.Companies
            .Include(c => c.AEOCertification)
            .FirstOrDefault(c => c.NIF == companyNIF);
        
        if (company?.AEOCertification == null)
        {
            return null;
        }
        
        return new AEOBenefits
        {
            // Fewer physical inspections
            InspectionRate = 5, // vs 30% for non-AEO
            
            // Priority treatment
            PriorityProcessing = true,
            FastTrackLane = true,
            
            // Simplified procedures
            SimplifiedDeclaration = true,
            DeferredPayment = true,
            ReducedGuarantees = 50, // 50% reduction
            
            // Post-clearance facilities
            SelfAssessment = true,
            PostClearanceAudit = true,
            PeriodicDeclaration = true,
            
            // Mutual recognition
            RecognizedInEU = true,
            RecognizedInSADC = true,
            
            // Business benefits
            EstimatedTimeSaving = "60%",
            EstimatedCostSaving = "30%",
            ReputationEnhancement = true
        };
    }
}
```

### 3. WCO Data Model 3.10

**Purpose**: Harmonized data structure for customs declarations globally

**Coverage**:
- Declaration structure and elements
- Party information
- Goods items
- Transport and logistics
- Valuation and duty calculation

See [WCO Data Model detailed documentation](wco-data-model.md)

### 4. Harmonized System (HS)

**Purpose**: International commodity classification

**Versions**:
- HS 2017 (6,205 tariff lines)
- HS 2022 (6,556 tariff lines - 351 amendments)
- HS 2027 (in development)

See [HS Classification detailed documentation](hs-classification.md)

### 5. WCO Valuation Agreement

**Full Name**: Agreement on Implementation of Article VII of GATT (WTO Valuation Agreement)

**Methods** (applied sequentially):
1. Transaction Value (invoice price)
2. Transaction Value of Identical Goods
3. Transaction Value of Similar Goods
4. Deductive Method
5. Computed Method
6. Fall-back Method

### 6. WCO Rules of Origin

**Types**:
- **Non-preferential Origin**: MFN tariff rates
- **Preferential Origin**: Reduced rates under trade agreements

**Criteria**:
- Wholly obtained
- Substantial transformation
- Change in tariff classification
- Value added percentage

### 7. Time Release Study (TRS)

**Purpose**: Measure customs clearance times and identify bottlenecks

**Metrics**:
- Time from arrival to release
- Time at each processing stage
- Comparison across channels (Green/Yellow/Red)
- International benchmarking

---

## UN Standards

### 1. UN/EDIFACT

**Full Name**: United Nations Electronic Data Interchange for Administration, Commerce and Transport

**Key Messages for Customs**:
- **CUSDEC**: Customs Declaration
- **CUSRES**: Customs Response
- **CUSCAR**: Customs Cargo Report
- **CUSREP**: Customs Conveyance Report
- **BANSTA**: Banking Status (payment confirmation)
- **CONTRL**: Syntax and Service Report Acknowledgement

See [UN/EDIFACT detailed documentation](un-edifact.md)

### 2. UN/CEFACT Standards

**UN/CEFACT Modeling Methodology (UMM)**
- Business process analysis
- Requirements specification
- Design guidelines
- Implementation frameworks

**Buy-Ship-Pay Reference Data Model**
- Supply chain processes
- Trade documents
- Data semantics
- Code lists

**Single Window Recommendation (No. 33)**
- Single entry point for trade data
- Harmonized data requirements
- Electronic processing
- Coordinated government services

### 3. UN/LOCODE

**Full Name**: United Nations Code for Trade and Transport Locations

**Format**: CC LLL (Country Code + 3-letter Location Code)

**Examples**:
- AOLAD: Angola - Luanda
- USNYC: United States - New York City
- CNSHA: China - Shanghai
- DEHAM: Germany - Hamburg
- NLRTM: Netherlands - Rotterdam

**JUL Implementation**:
```sql
CREATE TABLE un_locodes (
    locode VARCHAR(5) PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(alpha2_code),
    location_name VARCHAR(100) NOT NULL,
    name_without_diacritics VARCHAR(100),
    subdivision VARCHAR(3),
    function_code VARCHAR(8), -- Port, Rail, Road, Airport, etc.
    status VARCHAR(2),
    date_added DATE,
    iata_code VARCHAR(3),
    coordinates VARCHAR(12),
    remarks TEXT
);

-- Function codes
-- 1: Port
-- 2: Rail terminal
-- 3: Road terminal
-- 4: Airport
-- 5: Postal exchange office
-- 6: Multimodal function
-- 7: Fixed transport function
-- B: Border crossing
```

### 4. UNTDED

**Full Name**: United Nations Trade Data Elements Directory

**Purpose**: Standardized data elements for trade documents

**Coverage**:
- Data element definitions
- Code lists
- Data formats
- Document structures

### 5. UN Trade Facilitation Recommendations

**No. 4**: National Trade Facilitation Bodies
**No. 18**: Legal Framework for Trade Facilitation
**No. 33**: Single Window for International Trade
**No. 34**: Data Simplification and Standardization
**No. 35**: Legal Framework for Electronic Commerce

---

## WTO Standards

### WTO Trade Facilitation Agreement (TFA)

**Adopted**: December 7, 2013  
**Entry into Force**: February 22, 2017  
**Parties**: 164 WTO members

#### Section I - Provisions for Expediting Movement and Clearance

**Article 1: Publication and Availability of Information**
- Publish all trade regulations online
- Enquiry points for traders
- Advance rulings
- Right to appeal

**Article 2: Comments and Information Before Entry into Force**
- Consultation with trade stakeholders
- Reasonable time between publication and entry into force
- Impact assessment

**Article 3: Advance Rulings**
- Binding decisions on tariff classification
- Origin determinations
- Valuation methods
- Valid for reasonable period

**Article 4: Procedures for Appeal**
- Right to appeal or review
- Independent review authority
- Safeguards against conflicts of interest

**Article 5: Other Measures to Enhance Impartiality**
- Separation of assessment and collection functions
- No conflicts of interest
- Protection of confidential information

**Article 6: Disciplines on Fees and Charges**
- Limited to approximate cost of services
- Prohibition of consular fees
- Transparent fee structure
- Periodic review

**Article 7: Release and Clearance of Goods**
- Pre-arrival processing
- Electronic payment
- Risk management
- Post-clearance audit
- AEO programs
- Expedited shipments

**Article 8: Border Agency Cooperation**
- Coordinated border management
- Single window
- Joint controls
- Common operating hours

**Article 9: Movement of Goods Under Customs Control**
- Transit facilitation
- Advance filing
- Guarantee systems
- Escorts only when necessary

**Article 10: Formalities Connected with Importation and Exportation**
- Acceptance of copies
- Use of international standards
- Single window (10.4)
- Pre-shipment inspection
- Temporary admission
- Authorized operators

**Article 11: Freedom of Transit**
- Efficient transit procedures
- Separate transit from other traffic
- Advance filing
- Risk-based guarantees

**Article 12: Customs Cooperation**
- Information exchange
- Verification requests
- Notification of irregularities

#### JUL TFA Compliance Matrix

```csharp
public class TFAComplianceMatrix
{
    public Dictionary<string, ComplianceStatus> Articles { get; set; }
    
    public TFAComplianceMatrix()
    {
        Articles = new Dictionary<string, ComplianceStatus>
        {
            { "Article 1 - Publication", new ComplianceStatus 
            { 
                Status = "Fully Implemented",
                Evidence = "All regulations published on JUL portal and AGT website",
                EnquiryPoint = "jul-support@customs.gov.ao"
            }},
            { "Article 3 - Advance Rulings", new ComplianceStatus 
            { 
                Status = "Partially Implemented",
                Evidence = "Tariff classification rulings available, origin rulings in development",
                TargetDate = new DateTime(2026, 6, 30)
            }},
            { "Article 7.1 - Pre-arrival Processing", new ComplianceStatus 
            { 
                Status = "Fully Implemented",
                Evidence = "JUL allows declaration submission before cargo arrival"
            }},
            { "Article 7.4 - Risk Management", new ComplianceStatus 
            { 
                Status = "Fully Implemented",
                Evidence = "ASYCUDA risk assessment with Green/Yellow/Orange/Red channels"
            }},
            { "Article 7.7 - Post-Clearance Audit", new ComplianceStatus 
            { 
                Status = "Fully Implemented",
                Evidence = "AGT conducts risk-based post-clearance audits within 3 years"
            }},
            { "Article 7.8 - Expedited Shipments", new ComplianceStatus 
            { 
                Status = "In Development",
                Evidence = "Express courier procedures being finalized",
                TargetDate = new DateTime(2026, 12, 31)
            }},
            { "Article 10.4 - Single Window", new ComplianceStatus 
            { 
                Status = "Fully Implemented",
                Evidence = "JUL system with ASYCUDA, SINTECE, and OGA integration"
            }}
        };
    }
}
```

---

## ISO Standards

### Quality Management

**ISO 9001:2015** - Quality Management Systems
- Customer focus
- Leadership and commitment
- Risk-based thinking
- Process approach
- Continuous improvement

### Environmental Management

**ISO 14001:2015** - Environmental Management Systems
- Environmental policy
- Life cycle perspective
- Environmental performance
- Compliance obligations

### Occupational Health and Safety

**ISO 45001:2018** - OH&S Management Systems
- Hazard identification
- Risk assessment
- Incident investigation
- Worker participation

### Information Security

**ISO/IEC 27001:2022** - Information Security Management
- Confidentiality, integrity, availability
- Risk assessment and treatment
- Security controls (93 controls)
- Incident management

**ISO/IEC 27002:2022** - Information Security Controls
- Organizational controls
- People controls
- Physical controls
- Technological controls

### IT Service Management

**ISO/IEC 20000-1:2018** - Service Management Systems
- Service catalog
- Service level management
- Incident management
- Problem management
- Change management

### Supply Chain

**ISO 28000:2022** - Supply Chain Security Management
- Security risk assessment
- Security management plans
- Monitoring and measurement
- Continual improvement

**ISO 28001:2007** - Best Practices for Supply Chain Security
- Security assessment
- Security plans and procedures
- Training and awareness

**ISO 28004** - Guidelines for Implementation of ISO 28000

### Container and Cargo

**ISO 6346:1995** - Freight Containers - Coding, Identification and Marking
- Owner code (4 letters)
- Equipment category identifier
- Serial number (6 digits)
- Check digit calculation

**ISO 17712:2013** - Freight Container Seals
- Mechanical seals
- High security seals
- Testing requirements
- Performance standards

**ISO 18185** - Electronic Seals for Freight Containers
- Communication protocols
- Data formats
- Power requirements
- Security features

**ISO 23355:2007** - Continuous Monitoring Systems for Freight Containers
- Position tracking
- Status monitoring
- Security alerts
- Data transmission

See [ISO Standards detailed documentation](iso-standards.md)

---

## IATA Standards

### 1. Cargo-XML

**Purpose**: Standard for electronic air cargo messaging

**Key Messages**:
- **XFWB**: XML Format Waybill
- **XFZB**: XML Format House Waybill
- **XFHL**: XML Format House Manifest
- **XFSU**: XML Format Status Update
- **XFBL**: XML Format Freight Booked List

### 2. e-AWB (Electronic Air Waybill)

**Benefits**:
- Paperless air cargo
- Faster processing
- Reduced costs
- Environmental sustainability

**Adoption**: 70%+ of air cargo globally

### 3. IATA Dangerous Goods Regulations (DGR)

**Based on**: ICAO Technical Instructions and UN Model Regulations

**Coverage**:
- Classification of dangerous goods
- Packing requirements
- Labeling and marking
- Documentation requirements

**9 Classes of Dangerous Goods**:
1. Explosives
2. Gases
3. Flammable liquids
4. Flammable solids
5. Oxidizing substances and organic peroxides
6. Toxic and infectious substances
7. Radioactive material
8. Corrosive substances
9. Miscellaneous dangerous substances

### 4. IATA Cargo-IMP

**Purpose**: Cargo Interchange Message Procedures

**Standard Messages**:
- FWB: Freight Waybill
- FHL: Freight House List
- FSU: Freight Status Update
- FFM: Freight Flight Manifest
- FMA: Freight Manifest Arrival
- FZB: Freight House Waybill

### JUL Air Cargo Integration

```csharp
public class IATAMessageHandler
{
    public async Task ProcessXFWB(XFWBMessage xfwb)
    {
        // Extract AWB number
        var awbNumber = $"{xfwb.AirlinePrefix}{xfwb.SerialNumber}";
        
        // Create cargo manifest entry
        var cargo = new CargoManifest
        {
            ManifestId = Guid.NewGuid(),
            AWBNumber = awbNumber,
            FlightNumber = xfwb.FlightDetails.FlightNumber,
            ArrivalDate = xfwb.FlightDetails.ArrivalDate,
            ShipperName = xfwb.Shipper.Name,
            ConsigneeName = xfwb.Consignee.Name,
            OriginAirport = xfwb.OriginAirport,
            DestinationAirport = xfwb.DestinationAirport,
            NumberOfPieces = xfwb.WeightVolume.PieceCount,
            Weight = xfwb.WeightVolume.Weight,
            GoodsDescription = xfwb.Description,
            DangerousGoods = xfwb.ShipmentDetails.Contains("DGR")
        };
        
        await _database.CargoManifests.AddAsync(cargo);
        
        // Check for dangerous goods
        if (cargo.DangerousGoods)
        {
            await _alertService.NotifyDangerousGoods(cargo);
        }
        
        // Notify consignee
        await _notificationService.NotifyCargoArrival(cargo.ConsigneeName, awbNumber);
        
        await _database.SaveChangesAsync();
    }
}
```

---

## IMO Standards

### 1. SOLAS Convention

**Full Name**: International Convention for the Safety of Life at Sea

**Key Requirements**:
- Ship construction and equipment standards
- Fire safety
- Life-saving appliances
- Radio communications
- Safety management

**Chapter VI - Carriage of Cargoes**
- Stowage and securing
- Cargo information
- Dangerous goods
- **VGM (Verified Gross Mass) - SOLAS Amendment (2016)**

### 2. VGM Requirements

**Regulation**: SOLAS Chapter VI, Regulation 2

**Who**: Shipper responsibility

**When**: Before loading onto vessel

**Methods**:
1. **Method 1**: Weigh packed container
2. **Method 2**: Weigh contents + tare weight

**Documentation**:
```csharp
public class VGMDeclaration
{
    public string ContainerNumber { get; set; }
    public decimal VerifiedGrossMass { get; set; } // in kg
    public string Method { get; set; } // "1" or "2"
    public string AuthorizedPerson { get; set; }
    public string Company { get; set; }
    public DateTime VerificationDateTime { get; set; }
    public string Signature { get; set; }
    
    public bool Validate()
    {
        // Must be completed before loading
        if (VerificationDateTime > DateTime.Now)
            return false;
        
        // VGM must be positive
        if (VerifiedGrossMass <= 0)
            return false;
        
        // Method must be 1 or 2
        if (Method != "1" && Method != "2")
            return false;
        
        // Must have authorized person
        if (string.IsNullOrEmpty(AuthorizedPerson))
            return false;
        
        return true;
    }
}
```

### 3. ISPS Code

**Full Name**: International Ship and Port Facility Security Code

**Purpose**: Maritime security framework post-9/11

**Requirements**:
- Security assessments
- Security plans
- Security officers
- Training and drills
- Security equipment

**Security Levels**:
- **Level 1**: Normal (minimum protective measures)
- **Level 2**: Heightened (additional measures)
- **Level 3**: Exceptional (specific measures)

### 4. IMO FAL Convention

**Full Name**: Convention on Facilitation of International Maritime Traffic

**Purpose**: Simplify and standardize maritime documentation

**Standard Forms**:
- FAL 1: General Declaration
- FAL 2: Cargo Declaration
- FAL 3: Ship's Stores Declaration
- FAL 4: Crew's Effects Declaration
- FAL 5: Crew List
- FAL 6: Passenger List
- FAL 7: Dangerous Goods Manifest

### 5. IMDG Code

**Full Name**: International Maritime Dangerous Goods Code

**Based on**: UN Model Regulations

**Structure**:
- Volume 1: General provisions, definitions, training
- Volume 2: Classification and segregation

**9 Classes** (same as IATA DGR):
1. Explosives
2. Gases
3. Flammable liquids
4. Flammable solids
5. Oxidizing substances
6. Toxic and infectious substances
7. Radioactive materials
8. Corrosives
9. Miscellaneous dangerous goods

---

## GS1 Standards

### 1. GTIN (Global Trade Item Number)

**Formats**:
- GTIN-8: 8 digits (small items)
- GTIN-12 (UPC-A): 12 digits (North America)
- GTIN-13 (EAN-13): 13 digits (international)
- GTIN-14: 14 digits (shipping containers)

**Structure**:
```
GTIN-13: [Company Prefix][Item Reference][Check Digit]
Example: 590 12345 67890 4
         ├─GS1 Prefix
         ├──Company
         ├────────Item
         └─────────Check
```

### 2. GLN (Global Location Number)

**Purpose**: Identify parties and physical locations

**Format**: 13 digits

**Uses**:
- Company identification
- Warehouse locations
- Store locations
- Shipping addresses

### 3. SSCC (Serial Shipping Container Code)

**Purpose**: Unique logistics unit identification

**Format**: 18 digits

**Structure**:
```
SSCC: [Extension][Company Prefix][Serial Reference][Check Digit]
```

### 4. GS1-128 Barcodes

**Applications**:
- Shipping labels
- Pallet labels
- Case labels

**Application Identifiers (AI)**:
- (00): SSCC
- (01): GTIN
- (02): GTIN of contained items
- (10): Batch/Lot number
- (11): Production date
- (15): Best before date
- (17): Expiration date

### 5. EPCIS (Electronic Product Code Information Services)

**Purpose**: Supply chain visibility through event sharing

**Event Types**:
- **Object Event**: What, when, where
- **Aggregation Event**: Packing/unpacking
- **Transaction Event**: Business transaction
- **Transformation Event**: Manufacturing

**JUL EPCIS Integration**:
```csharp
public class EPCISEvent
{
    public DateTime EventTime { get; set; }
    public string EventType { get; set; }
    public string Action { get; set; } // ADD, OBSERVE, DELETE
    public string BusinessStep { get; set; }
    public string Disposition { get; set; }
    public string ReadPoint { get; set; }
    public string BizLocation { get; set; }
    public List<string> EPCList { get; set; }
    public Dictionary<string, string> BusinessTransaction { get; set; }
}

// Example: Cargo arrival event
var arrivalEvent = new EPCISEvent
{
    EventTime = DateTime.UtcNow,
    EventType = "ObjectEvent",
    Action = "OBSERVE",
    BusinessStep = "urn:epcglobal:cbv:bizstep:arriving",
    Disposition = "urn:epcglobal:cbv:disp:in_transit",
    ReadPoint = "urn:epc:id:sgln:590.12345.0", // Port of Luanda
    BizLocation = "urn:epc:id:sgln:590.12345.1", // Container terminal
    EPCList = new List<string> 
    {
        "urn:epc:id:sscc:590.1234567.1234567890"
    },
    BusinessTransaction = new Dictionary<string, string>
    {
        { "urn:epcglobal:cbv:btt:po", "PO-2026-001234" },
        { "urn:epcglobal:cbv:btt:inv", "INV-2026-567890" }
    }
};
```

---

## ICC Standards

### 1. Incoterms® 2020

**Purpose**: Define responsibilities in international trade

**11 Incoterms**:

**Any Mode of Transport**:
- **EXW**: Ex Works
- **FCA**: Free Carrier
- **CPT**: Carriage Paid To
- **CIP**: Carriage and Insurance Paid To
- **DAP**: Delivered at Place
- **DPU**: Delivered at Place Unloaded
- **DDP**: Delivered Duty Paid

**Sea and Inland Waterway Only**:
- **FAS**: Free Alongside Ship
- **FOB**: Free on Board
- **CFR**: Cost and Freight
- **CIF**: Cost, Insurance and Freight

**Key Changes in 2020**:
- DAT replaced by DPU
- Different insurance levels for CIP (All Risks) vs CIF (Minimum Cover)
- FCA allows for on-board notation on B/L
- Security-related costs allocation clarified

### 2. UCP 600

**Full Name**: Uniform Customs and Practice for Documentary Credits

**Purpose**: Rules for letters of credit

**Key Articles**:
- Article 14: Standard for examination of documents
- Article 16: Discrepancies
- Article 20: Ambiguous terms
- Article 38: Transferable credits

### 3. URC 522

**Full Name**: Uniform Rules for Collections

**Purpose**: Rules for documentary and clean collections

---

## Other International Standards

### 1. UNECE Trade Facilitation Recommendations

**Recommendation 1**: UN Layout Key for Trade Documents
**Recommendation 4**: National Trade Facilitation Bodies
**Recommendation 12**: Measures to Facilitate Maritime Transport
**Recommendation 18**: Legal Framework for Trade Facilitation
**Recommendation 33**: Single Window
**Recommendation 34**: Data Simplification
**Recommendation 35**: Legal Framework for E-Commerce
**Recommendation 36**: Interoperability in Cross-border Trade

### 2. UNCTAD Standards

**ASYCUDA** (Automated System for Customs Data)
- Declaration processing
- Tariff management
- Transit control
- Warehouse management
- Enforcement

**TRAINFORTRADE**: Capacity building programs

### 3. World Bank Trade Facilitation Indicators

**Logistics Performance Index (LPI)**:
1. Customs efficiency
2. Infrastructure quality
3. Ease of arranging shipments
4. Logistics competence
5. Tracking and tracing
6. Timeliness of delivery

**Doing Business - Trading Across Borders**:
- Time to export/import
- Cost to export/import
- Documentary compliance
- Border compliance

---

## National Standards - Angola

### 1. Angola Customs Code

**Legal Framework**:
- Código Aduaneiro de Angola
- Regulamento do Código Aduaneiro
- Pauta Aduaneira (Tariff Schedule)

**Key Provisions**:
- Customs territory and organization
- Rights and obligations of traders
- Customs procedures
- Valuation methods
- Origin rules
- Prohibited and restricted goods
- Offences and penalties

### 2. CNCA (Certificado Nacional de Capacidade Aduaneira)

**Purpose**: National Customs Capacity Certificate

**Requirements**:
- Registered company in Angola
- Minimum capital requirements
- Qualified staff with customs knowledge
- Adequate facilities
- Clean compliance record
- Financial guarantees

**Validity**: 2 years (renewable)

**Categories**:
- Category A: Full operations (import/export/transit)
- Category B: Limited operations
- Category C: Specific commodities only

### 3. Data Protection Laws

**Lei de Protecção de Dados Pessoais**

**Principles**:
- Lawfulness, fairness, transparency
- Purpose limitation
- Data minimization
- Accuracy
- Storage limitation
- Integrity and confidentiality
- Accountability

**Rights of Data Subjects**:
- Right to information
- Right of access
- Right to rectification
- Right to erasure
- Right to restriction
- Right to data portability
- Right to object

### 4. E-Government Standards

**Decree on Digital Transformation**

**Requirements**:
- Electronic signatures (qualified, advanced, simple)
- Digital certificates
- Secure communication protocols
- Data retention and archival
- Accessibility standards
- Interoperability frameworks

---

## Standards Compliance Matrix

### JUL System Compliance Summary

| Standard | Implementation Status | Compliance Level | Notes |
|----------|----------------------|------------------|-------|
| WCO Data Model 3.10 | ✅ Fully Implemented | 100% | All mandatory elements |
| Revised Kyoto Convention | ✅ Fully Implemented | 95% | Some transitional standards pending |
| SAFE Framework | ⚠️ Partially Implemented | 75% | AEO program in pilot phase |
| WTO TFA | ✅ Fully Implemented | 90% | Category A measures complete |
| UN/EDIFACT | ✅ Fully Implemented | 100% | CUSDEC/CUSRES operational |
| UN/LOCODE | ✅ Fully Implemented | 100% | All ports and locations coded |
| HS 2017 | ✅ Fully Implemented | 100% | Complete classification |
| HS 2022 | ⚠️ In Transition | 60% | Migration by Dec 2026 |
| ISO 3166/4217/8601 | ✅ Fully Implemented | 100% | Full compliance |
| ISO 6346 | ✅ Fully Implemented | 100% | Container validation |
| ISO 9001 | ⚠️ In Progress | 70% | Certification planned Q3 2026 |
| ISO 27001 | ⚠️ In Progress | 80% | Certification planned Q4 2026 |
| IATA Cargo-XML | ⚠️ In Development | 40% | Target: Q2 2027 |
| SOLAS/VGM | ✅ Fully Implemented | 100% | VGM verification mandatory |
| IMO FAL | ✅ Fully Implemented | 100% | Electronic FAL forms |
| GS1 Standards | ⚠️ Partially Implemented | 50% | GTIN recognition, EPCIS planned |
| Incoterms 2020 | ✅ Fully Implemented | 100% | All terms supported |

---

## Future Standards Roadmap

### 2026
- HS 2022 full migration (June 2026)
- ISO 9001 certification (September 2026)
- ISO 27001 certification (December 2026)
- AEO program full launch (Q4 2026)

### 2027
- IATA Cargo-XML integration (Q2 2027)
- GS1 EPCIS implementation (Q3 2027)
- ISO 14001 certification (Q4 2027)
- Blockchain for certificate verification (Q4 2027)

### 2028
- HS 2027 adoption (January 2028)
- AI-powered HS classification (Q2 2028)
- IoT cargo monitoring (Q3 2028)
- Mutual recognition agreements with EU, SADC (Q4 2028)

---

## References

### Official Organizations
- **WCO**: http://www.wcoomd.org
- **UN/CEFACT**: https://unece.org/trade/uncefact
- **WTO**: https://www.wto.org
- **ISO**: https://www.iso.org
- **IATA**: https://www.iata.org
- **IMO**: https://www.imo.org
- **GS1**: https://www.gs1.org
- **ICC**: https://iccwbo.org

### JUL Project Documents
- [WCO Data Model](wco-data-model.md)
- [UN/EDIFACT Standards](un-edifact.md)
- [HS Classification](hs-classification.md)
- [ISO Standards](iso-standards.md)
- [Customs Clearance Process](../guides/customs-clearance-process.md)
- [Glossary](../reference/glossary.md)

---

**Document Version**: 1.0  
**Last Updated**: January 1, 2026  
**Author**: JUL Technical Team  
**Status**: Production Ready
