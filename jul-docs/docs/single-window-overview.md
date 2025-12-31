# Single Window Concept - Complete Guide

**Understanding the Single Window System for International Trade**

---

## Table of Contents

1. [What is a Single Window?](#what-is-a-single-window)
2. [Core Principles](#core-principles)
3. [Benefits](#benefits)
4. [Architecture](#architecture)
5. [Services](#services)
6. [Implementation in Angola (JUL)](#implementation-in-angola-jul)
7. [Integration Points](#integration-points)
8. [User Journey](#user-journey)
9. [International Standards](#international-standards)
10. [Best Practices](#best-practices)

---

## What is a Single Window?

### Definition

According to **UN/CEFACT Recommendation 33**:

> *"A Single Window is a facility that allows parties involved in trade and transport to lodge standardized information and documents with a single entry point to fulfill all import, export, and transit-related regulatory requirements."*

### Key Concept

**ONE STOP**:
- **ONE** platform for submission
- **ONE** set of data entered once
- **ONE** interface for all agencies
- **ONE** response to the trader
- **ONE** payment mechanism

###Traditional Process vs Single Window

#### Traditional Multi-Agency Process

```
Trader submits separately to:
├── Customs Authority (AGT)
│   └── Paper forms, manual processing
├── Port Authority (INAMAR)
│   └── Separate system, different formats
├── Health Ministry
│   └── Physical office visit required
├── Agriculture Ministry
│   └── Manual certificates
├── Central Bank
│   └── Foreign exchange forms
├── Standards Agency
│   └── Quality certificates
└── ... (10+ different agencies)

Result: 15+ days, multiple visits, paper-based, costly
```

#### Single Window Process

```
Trader submits ONCE to JUL Portal:
└── Single electronic submission
    ├── Automatically routed to AGT
    ├── Automatically routed to INAMAR
    ├── Automatically routed to Health Ministry
    ├── Automatically routed to Agriculture Ministry
    ├── Automatically routed to Central Bank
    ├── Automatically routed to Standards Agency
    └── Consolidated response back to trader

Result: 6-24 hours, zero office visits, paperless, cost-effective
```

---

## Core Principles

### WCO Single Window Compendium Standards

The implementation follows WCO recommendations:
- **Single Submission**: Data submitted once
- **Single Decision**: Coordinated agency response
- **Risk-Based Controls**: Focus resources on high-risk
- **Paperless Processing**: 95%+ electronic transactions
- **Time Release**: Measure and reduce clearance times
- **Authorized Operators**: Trusted trader programs

### 1. Single Submission

**Principle**: Submit once, used by all agencies

**Implementation**:
- Trader enters data only one time
- System stores data centrally
- Each agency accesses required data
- No re-keying of information

```typescript
// Single submission captures all data once
interface SingleWindowSubmission {
  // Core customs data
  customsDeclaration: CustomsDeclaration;
  
  // Port/logistics data
  cargoManifest: CargoManifest;
  
  // Regulatory clearances
  healthDeclaration?: HealthClearanceRequest;
  phytosanitaryDeclaration?: PhytosanitaryCertificateRequest;
  standardsCertification?: QualityCertificateRequest;
  
  // Financial data
  forexDeclaration?: ForexDeclaration;
  
  // Supporting documents (uploaded once)
  documents: Document[];
}

// System routes to relevant agencies automatically
class SingleWindowRouter {
  async routeSubmission(submission: SingleWindowSubmission) {
    const routes = [];
    
    // Always to customs
    routes.push(this.routeToCustoms(submission.customsDeclaration));
    
    // Conditional routing based on commodity
    if (this.requiresHealthClearance(submission)) {
      routes.push(this.routeToHealthMinistry(submission));
    }
    
    if (this.requiresPhytosanitary(submission)) {
      routes.push(this.routeToAgriculture(submission));
    }
    
    if (this.requiresQualityCertificate(submission)) {
      routes.push(this.routeToStandards(submission));
    }
    
    // Execute all routes in parallel
    const results = await Promise.all(routes);
    
    return this.consolidateResponses(results);
  }
}
```

### 2. Single Payment

**Principle**: One payment covers all fees

**Benefits**:
- Consolidated invoice
- Single transaction
- Automatic distribution to agencies
- Receipt for all charges

```csharp
public class SingleWindowPayment
{
    public async Task<PaymentResult> ProcessConsolidatedPayment(
        string declarationNumber,
        PaymentMethod method)
    {
        // Calculate all charges from all agencies
        var charges = await CalculateAllCharges(declarationNumber);
        
        var invoice = new ConsolidatedInvoice
        {
            InvoiceNumber = GenerateInvoiceNumber(),
            DeclarationNumber = declarationNumber,
            IssueDate = DateTime.UtcNow,
            DueDate = DateTime.UtcNow.AddDays(5),
            LineItems = new List<InvoiceLineItem>
            {
                // Customs duties and taxes
                new InvoiceLineItem
                {
                    Agency = "AGT - Customs",
                    Description = "Import Duty",
                    Amount = charges.ImportDuty,
                    Account = "AGT-1001"
                },
                new InvoiceLineItem
                {
                    Agency = "AGT - Customs",
                    Description = "VAT (14%)",
                    Amount = charges.VAT,
                    Account = "AGT-1002"
                },
                new InvoiceLineItem
                {
                    Agency = "AGT - Customs",
                    Description = "Consumption Tax",
                    Amount = charges.ConsumptionTax,
                    Account = "AGT-1003"
                },
                
                // Port charges
                new InvoiceLineItem
                {
                    Agency = "INAMAR - Port Authority",
                    Description = "Port Handling Fee",
                    Amount = charges.PortHandling,
                    Account = "INAMAR-2001"
                },
                new InvoiceLineItem
                {
                    Agency = "Port Terminal",
                    Description = "Terminal Handling",
                    Amount = charges.TerminalHandling,
                    Account = "PORT-3001"
                },
                
                // Regulatory fees
                new InvoiceLineItem
                {
                    Agency = "Ministry of Health",
                    Description = "Health Inspection Fee",
                    Amount = charges.HealthInspection,
                    Account = "MINSA-4001"
                },
                
                // Agency processing fees
                new InvoiceLineItem
                {
                    Agency = "JUL Platform",
                    Description = "Electronic Processing Fee",
                    Amount = charges.PlatformFee,
                    Account = "JUL-9001"
                }
            },
            TotalAmount = charges.Total
        };
        
        // Process single payment
        var payment = await _paymentGateway.ProcessPayment(
            invoice.TotalAmount,
            method
        );
        
        if (payment.Success)
        {
            // Automatically distribute to agency accounts
            await DistributePayments(invoice.LineItems, payment.TransactionId);
            
            // Generate unified receipt
            var receipt = await GenerateReceipt(invoice, payment);
            
            // Update declaration status
            await UpdateDeclarationStatus(declarationNumber, "PAID");
            
            return PaymentResult.Success(receipt);
        }
        
        return PaymentResult.Failed(payment.ErrorMessage);
    }
}
```

### 3. Single Decision

**Principle**: Coordinated decision-making

**Process**:
1. All agencies review simultaneously
2. System consolidates decisions
3. Single response to trader
4. No contradictory decisions

```csharp
public class CoordinatedDecisionEngine
{
    public async Task<ConsolidatedDecision> GetFinalDecision(
        string declarationNumber)
    {
        // Get decisions from all agencies in parallel
        var agencyDecisions = await Task.WhenAll(
            GetCustomsDecision(declarationNumber),
            GetHealthDecision(declarationNumber),
            GetAgricultureDecision(declarationNumber),
            GetStandardsDecision(declarationNumber),
            GetForexDecision(declarationNumber)
        );
        
        // Apply decision logic
        var finalDecision = new ConsolidatedDecision
        {
            DeclarationNumber = declarationNumber,
            DecisionTime = DateTime.UtcNow,
            AgencyDecisions = agencyDecisions.ToList()
        };
        
        // Overall approval logic:
        // - If ANY agency REJECTS → Overall REJECTED
        // - If ANY agency requires INSPECTION → Overall INSPECT
        // - If ALL approve → Overall APPROVED
        
        if (agencyDecisions.Any(d => d.Status == "REJECTED"))
        {
            finalDecision.Status = "REJECTED";
            finalDecision.RejectingAgency = agencyDecisions
                .First(d => d.Status == "REJECTED").AgencyName;
            finalDecision.RejectionReason = agencyDecisions
                .First(d => d.Status == "REJECTED").Reason;
        }
        else if (agencyDecisions.Any(d => d.RequiresInspection))
        {
            finalDecision.Status = "INSPECTION_REQUIRED";
            finalDecision.InspectingAgencies = agencyDecisions
                .Where(d => d.RequiresInspection)
                .Select(d => d.AgencyName)
                .ToList();
        }
        else if (agencyDecisions.All(d => d.Status == "APPROVED"))
        {
            finalDecision.Status = "APPROVED";
            finalDecision.ReleaseAuthorized = true;
        }
        else
        {
            finalDecision.Status = "PENDING";
        }
        
        // Save consolidated decision
        await _database.ConsolidatedDecisions.AddAsync(finalDecision);
        await _database.SaveChangesAsync();
        
        // Notify trader
        await NotifyTrader(finalDecision);
        
        return finalDecision;
    }
}
```

### 4. Standardized Data

**Principle**: Use international standards for data exchange

**Standards Used**:
- WCO Data Model 3.10
- UN/EDIFACT messages
- ISO standards (countries, currencies, dates)
- GS1 standards (product identification)

### 5. Interoperability

**Principle**: Systems can communicate seamlessly

**Requirements**:
- Standard APIs (RESTful)
- Common data formats (JSON, XML)
- Secure protocols (HTTPS, TLS 1.3)
- Message queues for async processing
- Event-driven architecture

---

## Benefits

### For Traders/Businesses

| Benefit | Traditional | Single Window | Improvement |
|---------|-------------|---------------|-------------|
| **Time to Clear** | 15-30 days | 6-24 hours | 95%+ faster |
| **Office Visits** | 10-15 visits | Zero | 100% reduction |
| **Forms to Fill** | 20-30 forms | 1 form | 95%+ reduction |
| **Cost per Declaration** | $500-1,000 | $100-200 | 70-80% savings |
| **Error Rate** | 30-40% | 5-10% | 75% reduction |
| **Transparency** | Low | High | Real-time tracking |
| **Payment Methods** | Cash/Check only | Digital payments | Modern & flexible |

### For Government

| Benefit | Impact |
|---------|--------|
| **Revenue Collection** | 30% increase through better compliance |
| **Processing Efficiency** | 50% reduction in processing time |
| **Staff Productivity** | 40% more declarations per officer |
| **Data Quality** | 80% improvement in accuracy |
| **Inter-agency Coordination** | Real-time collaboration |
| **Risk Management** | Better targeting of high-risk cargo |
| **Trade Facilitation** | Improved ease of doing business ranking |
| **Paperwork** | 90% reduction |

### For Economy

- **Trade Volume**: Increased imports/exports
- **GDP Growth**: 0.5-1.5% contribution
- **Foreign Investment**: Attractive business environment
- **Job Creation**: Logistics and trade sector growth
- **Competitiveness**: Regional trade hub potential
- **Compliance**: Better regulatory compliance

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Web Portal  │  │ Mobile Apps  │  │  API Portal  │         │
│  │  (Angular)   │  │   (React     │  │   (Swagger)  │         │
│  │              │  │    Native)   │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/TLS 1.3
┌────────────────────────┴────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Kong API Gateway + Keycloak Authentication              │  │
│  │  - Rate limiting                                         │  │
│  │  - JWT validation                                        │  │
│  │  - Request routing                                       │  │
│  │  - Logging & monitoring                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│                   ORCHESTRATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Single Window Orchestrator Service                      │  │
│  │  - Route submissions to agencies                         │  │
│  │  - Consolidate responses                                 │  │
│  │  - Manage workflows                                      │  │
│  │  - Handle exceptions                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
┌──────────┴────────┐    ┌────────────┴───────────┐
│  MICROSERVICES    │    │   MESSAGE BUS          │
│                   │    │   (RabbitMQ/Kafka)     │
├───────────────────┤    └────────────────────────┘
│ • Customs Service │              │
│ • Port Service    │              │
│ • Health Service  │              │
│ • Agriculture Svc │              │
│ • Forex Service   │              │
│ • Payment Service │              │
│ • Document Mgmt   │              │
│ • Notification    │              │
└───────────────────┘              │
           │                       │
┌──────────┴───────────────────────┴─────────────┐
│           DATA LAYER                           │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  PostgreSQL  │  │    MinIO     │           │
│  │  (Databases) │  │ (Documents)  │           │
│  └──────────────┘  └──────────────┘           │
└────────────────────────────────────────────────┘
           │
┌──────────┴─────────────────────────────────────┐
│        INTEGRATION LAYER                       │
│  ┌────────────┐  ┌────────────┐               │
│  │  ASYCUDA   │  │  External  │               │
│  │   World    │  │  Systems   │               │
│  └────────────┘  └────────────┘               │
└────────────────────────────────────────────────┘
```

### Component Details

#### 1. Presentation Layer

**Web Portal** (Angular 17+):
- Trader interface
- Customs officer interface
- OGA officer interface
- Management dashboard

**Mobile Apps**:
- iOS and Android native apps
- Offline capability
- Biometric authentication
- Push notifications

**API Portal**:
- Swagger/OpenAPI documentation
- API key management
- Sandbox environment
- Rate limit information

#### 2. API Gateway

**Kong Gateway**:
```yaml
# Kong Configuration
services:
  - name: customs-service
    url: http://customs-api:8080
    routes:
      - name: declarations
        paths:
          - /api/v1/declarations
        methods:
          - GET
          - POST
        plugins:
          - name: rate-limiting
            config:
              minute: 100
              policy: local
          - name: jwt
          - name: cors
          
  - name: port-service
    url: http://port-api:8081
    routes:
      - name: manifests
        paths:
          - /api/v1/manifests
```

**Keycloak Authentication**:
- OAuth 2.0 / OpenID Connect
- Multi-factor authentication
- Role-based access control (RBAC)
- Federation with government ID systems

#### 3. Orchestration Layer

**Single Window Orchestrator**:
```csharp
public class SingleWindowOrchestrator
{
    private readonly IMessageBus _messageBus;
    private readonly IAgencyRouter _router;
    
    public async Task<string> ProcessSubmission(
        SingleWindowSubmission submission)
    {
        // 1. Validate submission
        var validation = await ValidateSubmission(submission);
        if (!validation.IsValid)
        {
            throw new ValidationException(validation.Errors);
        }
        
        // 2. Generate unique reference number
        var referenceNumber = GenerateReferenceNumber();
        submission.ReferenceNumber = referenceNumber;
        
        // 3. Store submission
        await StoreSubmission(submission);
        
        // 4. Determine required agencies
        var agencies = await DetermineRequiredAgencies(submission);
        
        // 5. Route to agencies asynchronously
        foreach (var agency in agencies)
        {
            await _messageBus.Publish(new AgencyRoutingMessage
            {
                ReferenceNumber = referenceNumber,
                Agency = agency,
                Data = ExtractAgencyData(submission, agency),
                Timestamp = DateTime.UtcNow
            });
        }
        
        // 6. Return reference number immediately
        return referenceNumber;
    }
    
    public async Task<ConsolidatedResponse> GetStatus(
        string referenceNumber)
    {
        var submission = await GetSubmission(referenceNumber);
        var responses = await GetAgencyResponses(referenceNumber);
        
        return new ConsolidatedResponse
        {
            ReferenceNumber = referenceNumber,
            SubmissionTime = submission.Timestamp,
            CurrentStatus = DetermineOverallStatus(responses),
            AgencyResponses = responses,
            PendingAgencies = GetPendingAgencies(responses),
            NextActions = GetNextActions(responses)
        };
    }
}
```

#### 4. Microservices

Each agency has a dedicated microservice:

```csharp
// Example: Health Ministry Microservice
[ApiController]
[Route("api/v1/health")]
public class HealthClearanceController : ControllerBase
{
    [HttpPost("clearance-request")]
    public async Task<IActionResult> ProcessClearanceRequest(
        [FromBody] HealthClearanceRequest request)
    {
        // 1. Validate request
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        // 2. Check if commodity requires health clearance
        var requiresClearance = await _hsCodeService
            .RequiresHealthClearance(request.HSCode);
        
        if (!requiresClearance)
        {
            return Ok(new HealthClearanceResponse
            {
                Status = "NOT_REQUIRED",
                Message = "This commodity does not require health clearance"
            });
        }
        
        // 3. Verify supporting documents
        var documents = await _documentService
            .GetDocuments(request.ReferenceNumber);
        
        var hasHealthCertificate = documents
            .Any(d => d.Type == "HEALTH_CERTIFICATE");
        
        if (!hasHealthCertificate)
        {
            return Ok(new HealthClearanceResponse
            {
                Status = "PENDING",
                RequiredDocuments = new[] { "Health Certificate from Origin" },
                Message = "Health certificate required"
            });
        }
        
        // 4. Risk assessment
        var riskLevel = await AssessHealthRisk(request);
        
        if (riskLevel == "HIGH")
        {
            // Schedule laboratory testing
            var testingId = await ScheduleLaboratoryTest(request);
            
            return Ok(new HealthClearanceResponse
            {
                Status = "TESTING_REQUIRED",
                TestingId = testingId,
                EstimatedCompletionTime = DateTime.UtcNow.AddDays(3),
                Message = "Laboratory testing required"
            });
        }
        
        // 5. Automatic approval for low-risk
        var clearance = await IssueClearance(request);
        
        return Ok(new HealthClearanceResponse
        {
            Status = "APPROVED",
            ClearanceNumber = clearance.Number,
            ValidUntil = clearance.ValidUntil,
            Message = "Health clearance approved"
        });
    }
}
```

#### 5. Message Bus

**RabbitMQ Configuration**:
```csharp
public class MessageBusConfiguration
{
    public void ConfigureExchanges(IModel channel)
    {
        // Topic exchange for agency routing
        channel.ExchangeDeclare(
            exchange: "single-window",
            type: ExchangeType.Topic,
            durable: true
        );
        
        // Queues for each agency
        var agencies = new[]
        {
            "customs", "health", "agriculture", 
            "standards", "forex", "port"
        };
        
        foreach (var agency in agencies)
        {
            var queueName = $"agency.{agency}";
            channel.QueueDeclare(
                queue: queueName,
                durable: true,
                exclusive: false,
                autoDelete: false
            );
            
            // Bind to exchange with routing key
            channel.QueueBind(
                queue: queueName,
                exchange: "single-window",
                routingKey: $"submission.{agency}.#"
            );
        }
    }
}
```

---

## Services

### 1. Declaration Management Service

**Functions**:
- Create and edit declarations
- Validate against WCO Data Model
- Submit to relevant agencies
- Track status
- Retrieve historical declarations

**API Endpoints**:
```
POST   /api/v1/declarations           - Create declaration
GET    /api/v1/declarations/{id}      - Get declaration details
PUT    /api/v1/declarations/{id}      - Update declaration
DELETE /api/v1/declarations/{id}      - Delete draft
POST   /api/v1/declarations/{id}/submit - Submit for processing
GET    /api/v1/declarations/{id}/status - Get current status
GET    /api/v1/declarations            - List all declarations
```

### 2. Document Management Service

**Functions**:
- Upload supporting documents
- Store in MinIO object storage
- OCR for document data extraction
- Document verification
- Retrieval and download

**Supported Formats**:
- PDF
- JPEG/PNG (scanned documents)
- TIFF
- XML (structured data)
- EDIFACT messages

```typescript
class DocumentUploadComponent {
  async uploadDocument(file: File, documentType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    formData.append('referenceNumber', this.referenceNumber);
    
    const response = await this.http.post(
      '/api/v1/documents/upload',
      formData,
      {
        reportProgress: true,
        observe: 'events'
      }
    ).toPromise();
    
    if (response.type === HttpEventType.UploadProgress) {
      const progress = Math.round(100 * response.loaded / response.total);
      this.uploadProgress = progress;
    }
    
    if (response.type === HttpEventType.Response) {
      return response.body.documentId;
    }
  }
}
```

### 3. Payment Service

**Functions**:
- Calculate consolidated charges
- Generate payment invoices
- Process payments (multiple methods)
- Distribute to agency accounts
- Issue receipts
- Handle refunds

**Payment Methods**:
- Bank transfer
- Multicaixa (ATM/POS)
- Mobile money (Unitel Money, Zap)
- Credit/debit cards
- Direct debit for AEO

### 4. Notification Service

**Functions**:
- Email notifications
- SMS alerts
- Push notifications (mobile app)
- In-app messages
- WhatsApp notifications (future)

**Notification Types**:
- Submission confirmation
- Status updates
- Payment reminders
- Inspection schedules
- Clearance approvals
- Rejection notifications

### 5. Tracking Service

**Functions**:
- Real-time status tracking
- Timeline view of process
- Estimated completion time
- Alert on delays
- Historical audit trail

```typescript
interface TrackingTimeline {
  referenceNumber: string;
  events: TrackingEvent[];
  currentStatus: string;
  estimatedCompletion: Date;
  progressPercentage: number;
}

interface TrackingEvent {
  timestamp: Date;
  stage: string;
  actor: string;
  action: string;
  details: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

// Example timeline
const timeline: TrackingTimeline = {
  referenceNumber: 'JUL-2026-001234',
  currentStatus: 'AWAITING_PAYMENT',
  progressPercentage: 60,
  estimatedCompletion: new Date('2026-01-02T14:00:00'),
  events: [
    {
      timestamp: new Date('2026-01-01T09:00:00'),
      stage: 'SUBMISSION',
      actor: 'Importer',
      action: 'Declaration submitted',
      details: 'Pre-arrival declaration submitted successfully',
      status: 'COMPLETED'
    },
    {
      timestamp: new Date('2026-01-01T09:05:00'),
      stage: 'VALIDATION',
      actor: 'System',
      action: 'Automatic validation',
      details: 'All required fields validated',
      status: 'COMPLETED'
    },
    {
      timestamp: new Date('2026-01-01T09:10:00'),
      stage: 'RISK_ASSESSMENT',
      actor: 'ASYCUDA',
      action: 'Risk channel assigned',
      details: 'Yellow channel - Documentary check required',
      status: 'COMPLETED'
    },
    {
      timestamp: new Date('2026-01-01T10:30:00'),
      stage: 'AGENCY_REVIEW',
      actor: 'Health Ministry',
      action: 'Health clearance approved',
      details: 'Certificate verified, clearance granted',
      status: 'COMPLETED'
    },
    {
      timestamp: new Date('2026-01-01T11:00:00'),
      stage: 'ASSESSMENT',
      actor: 'Customs Officer',
      action: 'Duty calculation',
      details: 'Import duty: 5,000 USD, VAT: 700 USD',
      status: 'COMPLETED'
    },
    {
      timestamp: new Date('2026-01-01T11:15:00'),
      stage: 'PAYMENT',
      actor: 'System',
      action: 'Payment invoice generated',
      details: 'Total amount: 5,700 USD. Awaiting payment',
      status: 'IN_PROGRESS'
    },
    {
      timestamp: null,
      stage: 'INSPECTION',
      actor: 'Customs Inspector',
      action: 'Documentary verification',
      details: 'Pending payment completion',
      status: 'PENDING'
    },
    {
      timestamp: null,
      stage: 'RELEASE',
      actor: 'Customs',
      action: 'Release authorization',
      details: 'Pending inspection completion',
      status: 'PENDING'
    }
  ]
};
```

### 6. Reporting and Analytics Service

**Dashboards**:
- Trader dashboard
- Agency dashboard
- Management dashboard
- Port operator dashboard

**Reports**:
- Clearance time statistics
- Revenue collection
- Compliance rates
- Commodity analysis
- Trading partner analysis
- Channel distribution

### 7. Integration Service

**External Systems**:
- ASYCUDA World
- SINTECE
- Port Community Systems
- Bank APIs
- Mobile money APIs
- Government authentication systems

---

## Implementation in Angola (JUL)

### JUL System Overview

**JUL** (Janela Única de Logística) = Angola's National Single Window for Logistics

**Launch**: Pilot in 2024, Full operation in 2025

**Coverage**:
- 3 sea ports (Luanda, Lobito, Namibe)
- 2 airports (Luanda, Catumbela)
- 8 land border posts
- Dry ports (Viana, Huambo)

**Connected Agencies** (15+):
1. AGT - Customs Authority
2. INAMAR - Maritime Authority
3. INAVIC - Civil Aviation
4. MINSA - Ministry of Health
5. MINADER - Ministry of Agriculture
6. MINAMB - Ministry of Environment
7. BNA - Central Bank
8. INAC - National Petroleum Agency
9. GGPIPS - Port Security
10. MINCO - Ministry of Commerce
11. SME - Migration Service
12. PNC - National Police
13. Standards Agency
14. Veterinary Services
15. Phytosanitary Services

### Technical Stack

**Frontend**:
- Angular 17+
- TypeScript
- TailwindCSS
- NgRx (state management)

**Backend**:
- ASP.NET Core 8.0
- C# 12
- Microservices architecture
- RESTful APIs

**Database**:
- PostgreSQL 15+
- Redis (caching)
- Elasticsearch (search)

**Integration**:
- ASYCUDA World (UNCTAD)
- SINTECE platform
- Kong API Gateway

**Infrastructure**:
- Docker containers
- Kubernetes orchestration
- Azure Cloud (primary)
- On-premises (backup)

### User Statistics (2025)

| Metric | Value |
|--------|-------|
| Registered Users | 3,500+ |
| Active Importers | 1,200+ |
| Customs Brokers | 450+ |
| AEO Companies | 45 |
| Declarations per Day | 800-1,200 |
| Average Clearance Time | 18 hours |
| System Uptime | 99.7% |
| User Satisfaction | 86% |

---

[Continue reading: Port and Logistics Operations →](../port-logistics/overview.md)

---

**Last Updated**: January 1, 2026  
**Version**: 1.0  
**Status**: Production Ready
