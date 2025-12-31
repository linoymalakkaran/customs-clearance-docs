# JUL Documentation Project

**Angola National Single Window - Complete Documentation System**

**Janela Única Logística (Angola National Logistics Single Window)**  
Comprehensive Documentation for Customs Clearance, Trade & Logistics Standards

---

## 📋 Overview

This is a comprehensive **Docusaurus-based documentation system** for **JUL (Janela Única de Logística)** - Angola's National Single Window for customs clearance, trade facilitation, and logistics operations.

### Key Statistics
- **21 comprehensive documents** covering all aspects of customs clearance
- **60,000+ lines** of detailed content
- **500+ code examples** in C#, TypeScript, and SQL
- **20+ international standards** fully documented
- **10 customs clearance scenarios** with end-to-end processes

### Technology Stack
- **Framework**: Docusaurus 3.9.2
- **Language**: TypeScript
- **UI**: React 18
- **Node**: v24.12.0

---

## 🚀 Quick Start

### Installation

```bash
cd jul-docs
npm install
```

### Development Server

```bash
npm start
```

Server runs at: `http://localhost:3001`

### Build for Production

```bash
npm run build
npm run serve
```

---

## 📚 Complete Documentation Structure

### Core Documents (jul-docs/docs/)
- `intro.md` - Welcome page with role-based navigation
- `customs-clearance-overview.md` - Overview of all customs scenarios (3,000 lines)
- `single-window-overview.md` - JUL architecture and services (8,000 lines)
- `port-logistics-overview.md` - Port operations and logistics (10,000 lines)

### Customs Clearance Scenarios (jul-docs/docs/customs-clearance/)

#### Import & Export Operations
- **import-clearance.md** - 29-step import process with risk channels (3,000 lines)
- **export-clearance.md** - Complete export workflow, drawback, re-export (2,500 lines)

#### Transit & Temporary Operations
- **transit-operations.md** - T1 documents, TIR carnets, GPS tracking (2,300 lines)
- **temporary-admission.md** - ATA carnet system, guarantees, monitoring (2,000 lines)

#### Warehousing & Simplified Procedures
- **customs-warehousing.md** - Types A/B/C/D, inventory management (2,000 lines)
- **simplified-procedures.md** - AEO certification, pre-declaration, self-assessment (1,500 lines)

#### Compliance & Audit
- **risk-based-clearance.md** - Risk profiling, selectivity criteria (1,500 lines)
- **post-clearance-audit.md** - Audit process, findings, adjustments (1,800 lines)

#### Disputes & Special Cases
- **appeals-disputes.md** - Appeals process, tribunals, binding rulings (2,000 lines)
- **special-cases.md** - Diplomatic goods, humanitarian aid, 15+ scenarios (2,500 lines)

### International Standards (jul-docs/docs/standards/)
- **comprehensive-standards-overview.md** - All 20+ standards with compliance matrix (12,000 lines)
- **wco-data-model.md** - WCO Data Model 3.10 implementation (3,000 lines)
- **un-edifact.md** - UN/EDIFACT message standards (2,500 lines)
- **hs-classification.md** - Harmonized System classification (2,800 lines)
- **iso-standards.md** - ISO 28000, 17712, 6346 implementations (6,000 lines)

### Process Guides & Reference (jul-docs/docs/)
- **guides/customs-clearance-process.md** - End-to-end clearance workflow (4,500 lines)
- **reference/glossary.md** - Comprehensive terminology (1,500 lines)

- **[Customs Clearance Process](docs/guides/customs-clearance-process.md)** - End-to-end declaration processing
- **[Trade Facilitation](docs/guides/trade-facilitation.md)** - Single Window concepts and benefits
- **[License & Permits](docs/guides/license-permits.md)** - CNCA and regulatory permits
- **[Document Management](docs/guides/document-management.md)** - Trade document requirements

### 4. Reference Materials

Quick reference and lookup resources:

- **[Glossary](docs/reference/glossary.md)** - Customs and trade terminology
- **[Code Lists](docs/reference/code-lists.md)** - HS codes, country codes, port codes
- **[API Reference](docs/reference/api-reference.md)** - JUL system API documentation
- **[FAQ](docs/reference/faq.md)** - Frequently asked questions

---

## 🚀 Quick Start

### For Developers

1. Start with [WCO Data Model](docs/standards/wco-data-model.md) to understand core data structures
2. Review [Data Architecture](docs/implementation/data-architecture.md) for database design
3. Implement integrations using [ASYCUDA](docs/implementation/asycuda-integration.md) and [SINTECE](docs/implementation/sintece-integration.md) guides
4. Refer to [API Reference](docs/reference/api-reference.md) for service contracts

### For Business Analysts

1. Understand [Customs Clearance Process](docs/guides/customs-clearance-process.md)
2. Review [Trade Facilitation](docs/guides/trade-facilitation.md) concepts
3. Study [License & Permits](docs/guides/license-permits.md) workflows
4. Familiarize with [Regulatory Compliance](docs/standards/regulatory-compliance.md)

### For Project Managers

1. Review [Trade Facilitation](docs/guides/trade-facilitation.md) for project scope
2. Understand [Regulatory Compliance](docs/standards/regulatory-compliance.md) requirements
3. Check [Implementation Guides](docs/implementation/) for technical dependencies
4. Use [Glossary](docs/reference/glossary.md) for stakeholder communication

---

## 🌍 Key Standards Implemented

### World Customs Organization (WCO)
- **WCO Data Model 3.10**: Standardized data structures for customs declarations
- **Revised Kyoto Convention (RKC)**: Simplification and harmonization of customs procedures
- **SAFE Framework of Standards**: Securing and facilitating global trade
- **Harmonized System (HS)**: Global commodity classification system (HS 2017/2022)
- **Framework for Coordinated Border Management**: Multi-agency cooperation
- **Time Release Study**: Measuring and improving customs clearance efficiency

### United Nations Standards
- **UN/EDIFACT**: Electronic Data Interchange for Administration, Commerce and Transport (CUSDEC, CUSRES, CUSCAR)
- **UN/CEFACT**: Trade facilitation and electronic business standards
- **UN/LOCODE**: Location codes for ports, airports, and inland terminals (ISO 3166-based)
- **UNTDED (Trade Data Elements Directory)**: Standardized data elements for trade documents

### World Trade Organization (WTO)
- **Trade Facilitation Agreement (TFA)**: Expediting movement, release and clearance of goods
- **TFA Article 7**: Release and clearance of goods
- **TFA Article 10**: Formalities connected with importation and exportation
- **TFA Single Window**: One-stop shop for trade documentation

### International Organization for Standardization (ISO)

#### Core Trade Standards
- **ISO 3166**: Country codes (alpha-2, alpha-3, numeric)
- **ISO 4217**: Currency codes and decimal places
- **ISO 8601**: Date and time format standards
- **ISO 6346**: Container identification and marking

#### Management System Standards
- **ISO 9001:2015**: Quality management systems
- **ISO 14001:2015**: Environmental management systems
- **ISO 45001:2018**: Occupational health and safety management
- **ISO 27001:2022**: Information security management systems
- **ISO/IEC 20000**: IT service management
- **ISO 28000:2022**: Supply chain security management

#### Additional ISO Standards
- **ISO 10383**: Market identifier codes (MIC)
- **ISO 17712**: Freight container seals
- **ISO 18185**: Electronic seals for freight containers
- **ISO 23355**: Continuous monitoring of freight containers

### International Air Transport Association (IATA)
- **IATA Cargo-XML**: Standard for air cargo messaging
- **e-AWB**: Electronic air waybill standard
- **IATA Cargo-IMP**: Cargo interchange message procedures
- **IATA Dangerous Goods Regulations (DGR)**: Safe transport of hazardous materials

### International Maritime Organization (IMO)
- **SOLAS Convention**: Safety of Life at Sea
- **ISPS Code**: International Ship and Port Facility Security Code
- **IMO FAL Convention**: Facilitation of International Maritime Traffic
- **IMDG Code**: International Maritime Dangerous Goods Code
- **VGM (Verified Gross Mass)**: Container weight verification (SOLAS Amendment)

### GS1 Standards
- **GTIN (Global Trade Item Number)**: Product identification
- **GLN (Global Location Number)**: Party and location identification
- **SSCC (Serial Shipping Container Code)**: Logistics unit identification
- **GS1-128 Barcodes**: Supply chain barcoding standard
- **EPCIS**: Electronic Product Code Information Services for supply chain visibility

### International Chamber of Commerce (ICC)
- **Incoterms® 2020**: International commercial terms defining buyer/seller responsibilities
- **UCP 600**: Uniform Customs and Practice for Documentary Credits
- **ICC Model Contracts**: International trade contract templates

### Angola National Standards
- **Angola Customs Code**: National customs regulations and procedures
- **CNCA Requirements**: Certificado Nacional de Capacidade Aduaneira
- **Data Protection Laws**: Personal data and privacy regulations
- **E-Government Decree**: Digital transformation and e-services mandate

---

## 🏗️ System Architecture Overview

The JUL system implements a modern microservices architecture:

### Core Components
- **11 Microservices**: Specialized services for different business domains
- **PostgreSQL Databases**: Database-per-service pattern
- **MinIO Object Storage**: Secure document management
- **Keycloak IAM**: Comprehensive identity and access management
- **Kong API Gateway**: Unified API management

### Integration Points
- **ASYCUDA (AGT)**: Angola Customs Authority system via SOAP/XML
- **SINTECE**: Angola Single Window via REST/JSON
- **OGA Systems**: Multiple government agencies via REST/JSON

### Key Features
- **Real-time Processing**: < 3 seconds response time (95th percentile)
- **High Availability**: 99.9% uptime SLA
- **Scalability**: 10,000 concurrent users, 100 transactions/second
- **Security**: OAuth 2.0, MFA, TLS 1.3 encryption

---

## 📖 Learning Path

### Beginner
1. [Glossary](docs/reference/glossary.md) - Learn customs terminology
2. [Customs Clearance Process](docs/guides/customs-clearance-process.md) - Understand basic workflows
3. [Trade Facilitation](docs/guides/trade-facilitation.md) - Single window concepts

### Intermediate
1. [WCO Data Model](docs/standards/wco-data-model.md) - Core data structures
2. [HS Classification](docs/standards/hs-classification.md) - Commodity classification
3. [UN/EDIFACT](docs/standards/un-edifact.md) - Message standards

### Advanced
1. [Data Architecture](docs/implementation/data-architecture.md) - Database design patterns
2. [ASYCUDA Integration](docs/implementation/asycuda-integration.md) - Complex integrations
3. [Security Implementation](docs/implementation/security-implementation.md) - Security architecture

---

## 🔍 Use Cases

The documentation covers these primary use cases:

1. **Company Registration**: Onboarding new trading companies
2. **License Applications**: CNCA and regulatory permit processing
3. **Customs Declarations**: Import/export declaration submission
4. **Agent Nomination**: Customs broker authorization
5. **Multi-Agency Permits**: Coordinated OGA applications
6. **Cargo Tracking**: Real-time shipment visibility
7. **Document Management**: Secure trade document handling
8. **Compliance Reporting**: Regulatory and operational reports

---

## 🛠️ Technical Stack

### Frontend
- Angular 17+ with Module Federation
- TypeScript, Angular Material UI
- Progressive Web App (PWA)

### Backend
- ASP.NET Core 8.0 microservices
- PostgreSQL 15+, Redis 7+
- RabbitMQ 3.12+, MinIO

### Infrastructure
- Kubernetes on-premises cluster
- Docker containers, Helm charts
- Prometheus, Grafana, ELK Stack

### Security
- Keycloak 23+ (OAuth 2.0, OIDC, SAML 2.0)
- TLS 1.3, AES-256 encryption
- Multi-Factor Authentication (MFA)

---

## 📊 Performance Targets

- **Availability**: 99.9% uptime (8.76 hours downtime/year max)
- **Response Time**: < 3 seconds (95th percentile)
- **Throughput**: 100 declarations per second
- **Concurrent Users**: 10,000 simultaneous users
- **Data Retention**: 7 years for compliance

---

## 🤝 Contributing

This documentation is maintained by the JUL project team. For updates or corrections:

1. Review existing documentation structure
2. Follow the established format and style
3. Include practical examples where applicable
4. Reference official standards documents
5. Validate technical accuracy with SMEs

---

## 📞 Support & Resources

### Official Standards Organizations
- **WCO**: [World Customs Organization](http://www.wcoomd.org/)
- **UN/CEFACT**: [United Nations Trade Facilitation](https://unece.org/trade/uncefact)
- **ISO**: [International Organization for Standardization](https://www.iso.org/)

### Angola Government Resources
- **AGT**: Administração Geral Tributária (Angola Customs Authority)
- **SINTECE**: Sistema Nacional de Troca Electrónica de Dados

### Project Documentation
- High Level Design Document (JUL_High_Level_Design.md)
- JUL-AGT Integration Control Document
- JUL-SINTECE Integration Control Document

---

## 📝 Document Version Control

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | December 2025 | Initial comprehensive documentation |

---

## 📜 License

This documentation is proprietary to the JUL (Janela Única Logística) project and the Government of Angola.

---

**Last Updated**: December 2025  
**Next Review**: June 2026  
**Status**: Production Ready
# customs-clearance-docs
