# Trade Finance and Insurance

**Complete Guide to International Trade Payment Methods and Risk Mitigation**

---

## Table of Contents

1. [Overview](#overview)
2. [Payment Methods](#payment-methods)
3. [Documentary Credits (Letters of Credit)](#documentary-credits-letters-of-credit)
4. [Documentary Collections](#documentary-collections)
5. [Bank Guarantees](#bank-guarantees)
6. [Cargo Insurance](#cargo-insurance)
7. [Incoterms 2020](#incoterms-2020)
8. [Trade Finance Solutions](#trade-finance-solutions)

---

## Overview

### What is Trade Finance?

**Trade Finance** encompasses the financial instruments and products used to facilitate international trade by managing payment and delivery risks between exporters and importers.

**Core Functions**:
- **Risk Mitigation**: Protect against non-payment and non-delivery
- **Liquidity**: Provide working capital for trade
- **Credit**: Extend payment terms to buyers
- **Facilitation**: Enable trade between unknown parties
- **Documentation**: Ensure compliance with terms

### Key Parties

**In a Trade Transaction**:
- **Exporter (Seller/Beneficiary)**: Supplies goods
- **Importer (Buyer/Applicant)**: Purchases goods
- **Issuing Bank**: Buyer's bank (opens L/C)
- **Advising Bank**: Seller's bank (confirms L/C)
- **Confirming Bank**: Adds guarantee to L/C
- **Negotiating Bank**: Purchases documents under L/C
- **Insurance Company**: Provides cargo coverage
- **Freight Forwarder**: Handles transportation
- **Customs Broker**: Manages clearance

### Payment Risks

**Exporter Risks**:
- Non-payment by buyer
- Political instability in buyer's country
- Foreign exchange restrictions
- Buyer insolvency
- Goods received but payment delayed/refused

**Importer Risks**:
- Non-delivery of goods
- Goods not matching specification
- Delayed shipment
- Seller insolvency
- Document fraud

**Mitigation Tools**:
- Letters of Credit
- Documentary Collections
- Bank Guarantees
- Export Credit Insurance
- Cargo Insurance

---

## Payment Methods

### Comparison of Payment Methods

| Method | Exporter Risk | Importer Risk | Cost | Complexity | When to Use |
|--------|--------------|--------------|------|------------|-------------|
| **Cash in Advance** | Very Low | Very High | Low | Simple | New relationships, high risk |
| **Letter of Credit** | Low | Low | High | Complex | Standard international trade |
| **Documentary Collection** | Medium | Medium | Medium | Moderate | Established relationships |
| **Open Account** | High | Very Low | Low | Simple | Trusted long-term partners |
| **Consignment** | Very High | Very Low | Low | Simple | Special arrangements |

### Cash in Advance (Prepayment)

**Process**:
1. Buyer pays before goods shipped
2. Exporter manufactures/ships after payment
3. Importer receives goods

**Advantages for Exporter**:
- No payment risk
- Immediate cash flow
- No financing costs

**Disadvantages for Importer**:
- Tied-up capital
- Total risk of non-delivery
- No leverage for quality issues

**Use Cases**:
- First-time buyers
- High-risk countries
- Custom-manufactured goods
- Small transactions

### Open Account

**Process**:
1. Exporter ships goods
2. Importer receives goods
3. Importer pays after agreed period (30/60/90 days)

**Advantages for Importer**:
- Best cash flow
- Lower costs
- Simple process

**Disadvantages for Exporter**:
- Maximum payment risk
- Need working capital
- Difficult recourse

**Use Cases**:
- Established relationships
- Low-risk markets
- Within-group transfers
- Domestic trade

### Comparison Matrix

```typescript
interface PaymentMethodSelection {
    factors: {
        relationshipHistory: 'NEW' | 'DEVELOPING' | 'ESTABLISHED';
        trustLevel: 'LOW' | 'MEDIUM' | 'HIGH';
        orderValue: 'SMALL' | 'MEDIUM' | 'LARGE';
        buyerCountryRisk: 'LOW' | 'MEDIUM' | 'HIGH';
        urgency: 'STANDARD' | 'URGENT';
    };
    
    recommendation: PaymentMethod;
}

// Example decision logic
function recommendPaymentMethod(factors: PaymentMethodSelection): string {
    if (factors.relationshipHistory === 'NEW' || factors.trustLevel === 'LOW') {
        return 'LETTER_OF_CREDIT';
    }
    
    if (factors.orderValue === 'LARGE' && factors.buyerCountryRisk === 'HIGH') {
        return 'CONFIRMED_LETTER_OF_CREDIT';
    }
    
    if (factors.relationshipHistory === 'ESTABLISHED' && factors.trustLevel === 'HIGH') {
        return 'OPEN_ACCOUNT';
    }
    
    return 'DOCUMENTARY_COLLECTION';
}
```

---

## Documentary Credits (Letters of Credit)

### What is a Letter of Credit?

**Definition**: A bank's written undertaking to pay the beneficiary (exporter) a specified amount if documents presented comply with the L/C terms.

**Key Principle**: **Independence** - Bank deals in documents, not goods. Payment depends on document compliance, not goods quality.

**UCP 600**: Uniform Customs and Practice for Documentary Credits (ICC Publication) - internationally recognized rules governing L/Cs.

### Parties to a Letter of Credit

```
                    [Sales Contract]
        EXPORTER ←------------------→ IMPORTER
       (Beneficiary)              (Applicant)
            ↑                          ↓
            |                     [L/C Application]
            |                          ↓
     [Advise/Confirm L/C]         ISSUING BANK
            |                    (Importer's Bank)
            ↓                          ↓
      ADVISING/CONFIRMING           [Open L/C]
          BANK                        ↓
     (Exporter's Bank)          [Send L/C]
            ↑                          ↑
            |                          |
       [Present Documents]             |
            |                          |
            └──────────[Forward]───────┘
```

### Types of Letters of Credit

#### 1. Revocable vs Irrevocable

**Irrevocable L/C** ✅:
- Cannot be amended/cancelled without all parties' consent
- Provides certainty to exporter
- Standard for international trade
- UCP 600 default

**Revocable L/C** ❌:
- Can be cancelled by buyer/issuing bank at any time
- Little protection for exporter
- Rarely used
- Not recommended

#### 2. Confirmed vs Unconfirmed

**Confirmed L/C** ✅:
- Advising bank adds its guarantee
- Exporter has payment undertaking from two banks
- Higher cost
- Used when issuing bank risk is concern

**Unconfirmed L/C**:
- Only issuing bank's undertaking
- Advising bank merely transmits
- Lower cost
- Suitable for low-risk issuing banks

**Example**:
```typescript
interface LetterOfCreditType {
    unconfirmed: {
        guarantee: "Issuing Bank only";
        risk: "Country and bank risk on issuing bank";
        cost: "Lower (0.1-0.5% per quarter)";
        useWhen: "Reputable issuing bank, stable country";
    };
    
    confirmed: {
        guarantee: "Issuing Bank + Confirming Bank";
        risk: "Only confirming bank risk (usually domestic)";
        cost: "Higher (additional 0.5-1% per quarter)";
        useWhen: "Unknown bank, high country risk, large value";
    };
}
```

#### 3. Sight vs Deferred Payment

**Sight L/C**:
- Payment immediately upon compliant presentation
- "At sight" of documents
- Fastest payment to exporter

**Deferred Payment L/C**:
- Payment at specified future date (30/60/90/180 days)
- Provides buyer credit terms
- Exporter can discount for early payment

**Usance/Acceptance L/C**:
- Draft drawn on bank
- Bank accepts draft (commitment to pay at maturity)
- Draft can be negotiated/discounted

#### 4. Other Types

**Transferable L/C**:
- Can be transferred to one or more second beneficiaries
- Used when first beneficiary is intermediary
- Substitute invoices allowed

**Back-to-Back L/C**:
- Second L/C opened based on first L/C
- For same transaction with different parties
- Used by traders

**Standby L/C**:
- Backup payment guarantee
- Only drawn if primary obligation not met
- Similar to bank guarantee

**Red Clause L/C**:
- Allows advance payment to beneficiary before shipment
- Finance pre-shipment expenses
- Bank risk higher

### L/C Process Flow

**Step-by-Step**:

**Phase 1: L/C Opening**
```csharp
public class LCOpeningProcess
{
    public async Task<IssuedLC> OpenLetterOfCredit(LCApplication application)
    {
        // 1. Importer applies to bank
        var assessment = await AssessBuyerCreditworthiness(application.ApplicantNIF);
        
        if (!assessment.Approved)
            throw new Exception("Insufficient creditworthiness");
        
        // 2. Bank requires margin/collateral
        var marginRequired = application.LCAmount * 0.20m; // 20% margin typical
        await SecureMargin(application.ApplicantNIF, marginRequired);
        
        // 3. Bank issues L/C
        var lc = new IssuedLC
        {
            LCNumber = GenerateLCNumber(),
            IssueDate = DateTime.UtcNow,
            ExpiryDate = application.RequestedExpiry,
            Beneficiary = application.BeneficiaryDetails,
            Amount = application.LCAmount,
            Currency = "USD",
            Incoterm = application.Incoterm,
            LatestShipmentDate = application.LatestShipment,
            DocumentsRequired = application.DocumentList,
            PartialShipments = application.AllowPartial,
            Transhipment = application.AllowTranshipment
        };
        
        // 4. Send to advising bank
        await TransmitLC(lc, application.AdvisingBank);
        
        // 5. Notify applicant
        await NotifyApplicant(application.ApplicantNIF, lc.LCNumber);
        
        return lc;
    }
}
```

**Phase 2: L/C Advising**
```typescript
interface LCAdvisingProcess {
    // 1. Advising bank receives L/C via SWIFT
    receivedVia: 'SWIFT MT700';
    
    // 2. Verify authenticity (SWIFT key test)
    authentication: 'VERIFIED';
    
    // 3. Add confirmation (if requested)
    confirmation: {
        confirmingBank: 'Banco Nacional de Angola';
        confirmationFee: 'USD 1,500';
        undertaking: 'We hereby confirm this credit...';
    };
    
    // 4. Advise beneficiary (exporter)
    advisingMethod: 'Courier + Email + Portal';
    beneficiaryReceives: [
        'Full L/C text',
        'Terms and conditions',
        'Document checklist',
        'Presentation instructions'
    ];
}
```

**Phase 3: Shipment & Documentation**
```csharp
public class LCDocumentPreparation
{
    public async Task<DocumentPackage> PrepareDocuments(LetterOfCredit lc, Shipment shipment)
    {
        var docs = new DocumentPackage();
        
        // 1. Commercial Invoice
        docs.CommercialInvoice = new Invoice
        {
            InvoiceNumber = GenerateInvoiceNumber(),
            Date = DateTime.UtcNow,
            Seller = lc.Beneficiary,
            Buyer = lc.Applicant,
            Amount = lc.Amount,
            Currency = lc.Currency,
            PaymentTerms = $"Under L/C {lc.LCNumber}",
            Description = lc.GoodsDescription // EXACT wording from L/C
        };
        
        // 2. Bill of Lading
        docs.BillOfLading = await ObtainBillOfLading(shipment);
        docs.BillOfLading.Consignee = "TO ORDER"; // Typical for L/C
        docs.BillOfLading.Notify = lc.Applicant;
        docs.BillOfLading.FreightStatus = lc.Incoterm.Contains("C") ? "PREPAID" : "COLLECT";
        
        // 3. Certificate of Origin
        if (lc.RequiresCertificateOfOrigin)
        {
            docs.CertificateOfOrigin = await ObtainCertificateOfOrigin(shipment.OriginCountry);
        }
        
        // 4. Insurance Certificate (if required)
        if (lc.Incoterm == "CIF" || lc.Incoterm == "CIP")
        {
            docs.InsuranceCertificate = await ArrangeInsurance(
                shipment.Value * 1.10m, // 110% of invoice value typical
                "INSTITUTE CARGO CLAUSES (A)" // All risks
            );
        }
        
        // 5. Packing List
        docs.PackingList = GeneratePackingList(shipment);
        
        // 6. Other documents as specified
        if (lc.AdditionalDocuments != null)
        {
            foreach (var docType in lc.AdditionalDocuments)
            {
                docs.AdditionalDocs.Add(await ObtainDocument(docType));
            }
        }
        
        return docs;
    }
}
```

**Phase 4: Document Presentation**
```typescript
interface DocumentPresentation {
    presentedTo: 'Advising/Confirming Bank' | 'Issuing Bank';
    presentationDate: Date;
    
    // UCP 600 Article 14 - Presentation period
    maximumPeriod: '21 calendar days after shipment date';
    mustBe: 'Within L/C validity';
    
    // Documents checked for:
    complianceCheck: {
        appearOnFaceCompliant: boolean;  // UCP 600 Article 14a
        consistentWithEachOther: boolean; // Data consistency
        exactLCTerms: boolean;            // Strict compliance
        withinValidityPeriod: boolean;
        allDocumentsPresented: boolean;
    };
}
```

**Phase 5: Examination & Payment**
```csharp
public class LCDocumentExamination
{
    public async Task<ExaminationResult> ExamineDocuments(
        LetterOfCredit lc, 
        DocumentPackage docs)
    {
        var discrepancies = new List<Discrepancy>();
        
        // UCP 600 Article 14b: Maximum 5 banking days to examine
        var examinationDeadline = DateTime.UtcNow.AddDays(5);
        
        // Check 1: All required documents presented
        foreach (var requiredDoc in lc.RequiredDocuments)
        {
            if (!docs.Contains(requiredDoc))
            {
                discrepancies.Add(new Discrepancy
                {
                    Type = "MISSING_DOCUMENT",
                    Description = $"{requiredDoc} required but not presented"
                });
            }
        }
        
        // Check 2: Invoice compliance
        if (docs.CommercialInvoice.Amount > lc.Amount)
        {
            discrepancies.Add(new Discrepancy
            {
                Type = "INVOICE_AMOUNT_EXCEEDED",
                Description = $"Invoice {docs.CommercialInvoice.Amount} exceeds L/C {lc.Amount}"
            });
        }
        
        // Check 3: Description matches L/C
        if (!docs.CommercialInvoice.Description.Contains(lc.GoodsDescription))
        {
            discrepancies.Add(new Discrepancy
            {
                Type = "DESCRIPTION_MISMATCH",
                Description = "Goods description doesn't match L/C"
            });
        }
        
        // Check 4: Shipment date
        if (docs.BillOfLading.ShipmentDate > lc.LatestShipmentDate)
        {
            discrepancies.Add(new Discrepancy
            {
                Type = "LATE_SHIPMENT",
                Description = $"Shipment {docs.BillOfLading.ShipmentDate} after {lc.LatestShipmentDate}"
            });
        }
        
        // Check 5: Data consistency
        if (docs.CommercialInvoice.InvoiceNumber != docs.PackingList.InvoiceReference)
        {
            discrepancies.Add(new Discrepancy
            {
                Type = "DATA_INCONSISTENCY",
                Description = "Invoice number inconsistent between documents"
            });
        }
        
        if (discrepancies.Any())
        {
            // UCP 600 Article 16: Refuse documents, notify within 5 days
            await NotifyDiscrepancies(lc.Beneficiary, discrepancies);
            
            return new ExaminationResult
            {
                Status = "REFUSED",
                Discrepancies = discrepancies,
                Options = new[] 
                { 
                    "Correct and re-present", 
                    "Request waiver from applicant",
                    "Accept discrepancies and negotiate"
                }
            };
        }
        
        // Compliant presentation - Process payment
        await ProcessPayment(lc, docs.CommercialInvoice.Amount);
        
        // Send documents to issuing bank/applicant
        await ForwardDocuments(lc.IssuingBank, docs);
        
        return new ExaminationResult
        {
            Status = "HONORED",
            PaymentDate = DateTime.UtcNow,
            Amount = docs.CommercialInvoice.Amount
        };
    }
}
```

### Common Discrepancies

**Top 10 L/C Discrepancies**:

1. **Late Presentation**: Documents presented after 21 days from shipment
2. **Description Mismatch**: Goods description differs from L/C
3. **Amount Exceeded**: Invoice amount higher than L/C amount
4. **Late Shipment**: Shipped after latest shipment date
5. **Expired L/C**: Presented after L/C expiry
6. **Bill of Lading Issues**: 
   - Not clean (has clauses)
   - Not full set presented
   - Incorrect consignee
7. **Insurance Issues**:
   - Insufficient coverage (not 110%)
   - Wrong coverage type
   - Late insurance date
8. **Certificate of Origin**: Missing or incorrect
9. **Inconsistent Data**: Invoice # differs across documents
10. **Missing Documents**: Required document not presented

**Avoiding Discrepancies**:
```typescript
interface DiscrepancyPrevention {
    beforeShipment: {
        reviewLCCarefully: true;
        checkAllTermsAchievable: true;
        amendImpossibleTerms: true;
        confirmDocumentAvailability: true;
    };
    
    duringPreparation: {
        useExactLCWording: true;
        crossCheckAllDocuments: true;
        verifyDateConsistency: true;
        ensureAllDocsObtained: true;
    };
    
    beforePresentation: {
        professionalDocumentCheck: true;
        allowBufferTime: true;
        courierReliableDelivery: true;
    };
}
```

### L/C Amendments

**Common Reasons**:
- Extend expiry/shipment date
- Increase amount
- Change delivery terms
- Add/remove documents
- Correct beneficiary details

**Process**:
```csharp
public class LCAmendment
{
    public async Task<AmendmentResult> AmendLC(string lcNumber, Amendment amendment)
    {
        // 1. Beneficiary or Applicant requests
        var request = await SubmitAmendmentRequest(lcNumber, amendment);
        
        // 2. Issuing bank reviews
        if (request.Initiator == "BENEFICIARY")
        {
            // Need applicant consent
            var consent = await RequestApplicantConsent(request);
            if (!consent.Approved)
                return new AmendmentResult { Status = "REJECTED" };
        }
        
        // 3. Issue amendment
        var amendmentNumber = await IssueAmendment(lcNumber, amendment);
        
        // 4. Advise to beneficiary
        await AdviseAmendment(amendmentNumber);
        
        // 5. Beneficiary must accept
        // (Silence = rejection per UCP 600 Article 10)
        var acceptance = await WaitForBeneficiaryAcceptance(amendmentNumber, TimeSpan.FromDays(7));
        
        if (!acceptance.Accepted)
        {
            return new AmendmentResult 
            { 
                Status = "REJECTED_BY_BENEFICIARY",
                OriginalTermsRemain = true 
            };
        }
        
        return new AmendmentResult { Status = "EFFECTIVE" };
    }
}
```

**Important**: Beneficiary must explicitly accept. Silence = rejection (UCP 600 Article 10c).

### L/C Costs

**Typical Fees**:

| Fee | Who Pays | Amount |
|-----|----------|--------|
| **Opening/Issuance** | Applicant (Buyer) | 0.5-1.5% per quarter |
| **Advising** | Beneficiary (Seller) | USD 50-200 flat |
| **Confirmation** | Beneficiary (Seller) | 0.5-1% per quarter |
| **Amendment** | Requesting party | USD 50-150 per amendment |
| **Discrepancy** | Beneficiary (Seller) | USD 50-100 per notice |
| **Negotiation** | Beneficiary (Seller) | 0.25-0.75% of invoice |
| **Courier** | Beneficiary (Seller) | USD 50-100 |
| **Cable/SWIFT** | Both | USD 25-50 per message |

**Example Calculation**:
```
L/C Amount: USD 100,000
Tenor: 90 days (1 quarter)
Confirmed L/C

Buyer Costs:
- Issuance Fee (1%): USD 1,000
- Margin (20% tied up): USD 20,000 opportunity cost
- SWIFT: USD 50
= Total: USD 1,050 + opportunity cost

Seller Costs:
- Advising: USD 100
- Confirmation (0.75%): USD 750
- Negotiation (0.5%): USD 500
- Discounting (if early payment): 2-4% per annum
- Courier: USD 75
- SWIFT: USD 50
= Total: USD 1,475 (+ discounting if applicable)
```

### SWIFT Messages

**MT700 - Issue of Documentary Credit**:
```
:40A: IRREVOCABLE
:20: L/C Number
:31C: Issue Date
:31D: Expiry Date & Place
:50: Applicant Details
:59: Beneficiary Details
:32B: Currency & Amount
:41A: Available With (Bank)
:42C: Drafts at... (Sight/Usance)
:43P: Partial Shipments (Allowed/Not Allowed)
:43T: Transshipment (Allowed/Not Allowed)
:44A: Loading Port
:44B: Discharge Port
:44C: Latest Shipment Date
:45A: Description of Goods
:46A: Documents Required
:47A: Additional Conditions
:49: Confirmation Instructions
:71B: Charges
:78: Instructions to Paying Bank
```

---

## Documentary Collections

### What is a Documentary Collection?

**Definition**: An arrangement where exporter entrusts collection of payment to banks based on document handover.

**Types**:
1. **D/P (Documents against Payment)**: Documents released upon payment
2. **D/A (Documents against Acceptance)**: Documents released upon accepting draft

**Governing Rules**: **URC 522** (Uniform Rules for Collections, ICC Publication)

### D/P vs D/A

**Documents against Payment (D/P)**:
```typescript
interface DocumentsAgainstPayment {
    process: {
        step1: "Exporter ships goods";
        step2: "Exporter presents documents to bank";
        step3: "Bank sends documents to buyer's bank";
        step4: "Buyer pays to obtain documents";
        step5: "Bank remits payment to exporter";
    };
    
    payment: 'IMMEDIATE (at sight)';
    risk: 'Medium - Buyer may refuse documents/payment';
    use: 'Sight payment terms';
}
```

**Documents against Acceptance (D/A)**:
```typescript
interface DocumentsAgainstAcceptance {
    process: {
        step1: "Exporter ships goods";
        step2: "Exporter presents documents + time draft to bank";
        step3: "Bank sends to buyer's bank";
        step4: "Buyer accepts draft (promise to pay at maturity)";
        step5: "Bank releases documents to buyer";
        step6: "Buyer pays at draft maturity (30/60/90 days)";
    };
    
    payment: 'DEFERRED (30/60/90 days after acceptance)';
    risk: 'Higher - Buyer gets goods before payment';
    use: 'Credit terms for buyers';
}
```

### Collection Process

```csharp
public class DocumentaryCollectionService
{
    public async Task<CollectionResult> ProcessCollection(CollectionInstruction instruction)
    {
        // 1. Exporter (Principal) submits documents to remitting bank
        var collectionRef = await InitiateCollection(instruction);
        
        // 2. Remitting bank sends documents to collecting bank
        await TransmitDocuments(
            fromBank: instruction.RemittingBank,
            toBank: instruction.CollectingBank,
            documents: instruction.Documents,
            collectionInstruction: instruction.Terms
        );
        
        // 3. Collecting bank notifies drawee (buyer)
        await NotifyDrawee(
            instruction.DraweeDetails,
            collectionRef,
            instruction.PaymentTerms
        );
        
        // 4. Process based on terms
        if (instruction.Terms == "D/P")
        {
            // Documents against payment
            var payment = await WaitForPayment(collectionRef);
            if (payment.Received)
            {
                await ReleaseDocuments(instruction.DraweeDetails);
                await RemitFunds(instruction.PrincipalAccount, payment.Amount);
            }
            else
            {
                // Payment refused
                return new CollectionResult { Status = "REFUSED" };
            }
        }
        else if (instruction.Terms == "D/A")
        {
            // Documents against acceptance
            var acceptance = await WaitForAcceptance(collectionRef);
            if (acceptance.Accepted)
            {
                await ReleaseDocuments(instruction.DraweeDetails);
                
                // Wait for maturity
                await WaitForMaturity(acceptance.MaturityDate);
                var payment = await CollectPayment(collectionRef);
                await RemitFunds(instruction.PrincipalAccount, payment.Amount);
            }
            else
            {
                return new CollectionResult { Status = "ACCEPTANCE_REFUSED" };
            }
        }
        
        return new CollectionResult 
        { 
            Status = "COMPLETED",
            PaymentReceived = true 
        };
    }
}
```

### Advantages and Disadvantages

**Advantages**:
- Less expensive than L/C
- Simpler process
- Suitable for established relationships
- Banks handle document transfer

**Disadvantages**:
- No bank payment guarantee
- Buyer can refuse documents
- Exporter ships before payment (D/P) or acceptance (D/A)
- No recourse if buyer doesn't pay
- Goods may be stuck at destination

**When to Use**:
- Moderate trust level
- Cost-sensitive transactions
- Lower-value shipments
- Within-group transfers

---

## Bank Guarantees

### Types of Guarantees

#### 1. Bid Bond (Tender Guarantee)

**Purpose**: Guarantees that bidder will honor bid if accepted.

**Amount**: Typically 2-5% of bid value

**Validity**: Until contract signed or bid period expires

**Claim Trigger**: Bidder withdraws bid or refuses to sign contract

#### 2. Performance Bond (Performance Guarantee)

**Purpose**: Guarantees performance of contractual obligations.

**Amount**: Typically 10-20% of contract value

**Validity**: Until contract completed + retention period

**Claim Trigger**: Contractor fails to perform per contract terms

```typescript
interface PerformanceGuarantee {
    beneficiary: "Project Owner/Buyer";
    principal: "Contractor/Seller";
    guarantor: "Bank";
    
    amount: "10-20% of contract value";
    validity: "Contract period + 3-6 months";
    
    claimConditions: {
        contractorDefault: true;
        poorPerformance: true;
        delayedCompletion: true;
        specification Breach: true;
    };
    
    callProcedure: 'Unconditional' | 'Conditional';
}
```

#### 3. Advance Payment Guarantee

**Purpose**: Guarantees repayment of advance payment if contract not performed.

**Amount**: Equal to advance payment (e.g., 30% of contract)

**Validity**: Reduced as work progresses

**Claim Trigger**: Contractor fails to perform after receiving advance

#### 4. Retention Money Guarantee

**Purpose**: Substitute for cash retention (usually 5-10% withheld).

**Amount**: Equal to retention money

**Validity**: Until defects liability period ends

**Claim Trigger**: Defects during warranty period

#### 5. Shipping Guarantee

**Purpose**: Allow cargo release without original B/L.

**Risk**: Bank indemnifies carrier for releasing without B/L

**Use**: When original B/L delayed but goods arrived

### Unconditional vs Conditional Guarantees

**Unconditional (On-Demand)**:
- Payable upon beneficiary's first demand
- No need to prove default
- Statement of breach sufficient
- Common in international trade
- Higher risk for principal

**Conditional**:
- Require proof of default
- Third-party certification may be needed
- Lower risk for principal
- Less common internationally

### URDG 758

**Uniform Rules for Demand Guarantees** (ICC Publication):
- International standard for demand guarantees
- Defines procedures and obligations
- Protects all parties
- Alternative to national laws

---

## Cargo Insurance

### Why Cargo Insurance?

**Risks in Transit**:
- Physical damage (accident, rough handling)
- Theft/pilferage
- Weather damage
- Fire/explosion
- Vessel sinking
- Aircraft crash
- Container lost overboard

**Not Covered by Carrier**:
- Carrier liability very limited
  - Sea: 2 SDR/kg (~$3/kg)
  - Air: 19 SDR/kg (~$25/kg)
  - Road: 8.33 SDR/kg (~$11/kg)
- Insufficient for most cargo

### Institute Cargo Clauses (ICC)

**ICC (A) - All Risks** ✅:
- Broadest coverage
- All risks except specific exclusions
- Recommended for most cargo
- Slightly higher premium

**ICC (B) - Named Perils**:
- Fire/explosion
- Vessel/vehicle collision
- Discharge at distress port
- General average
- Jettison
- Washing overboard
- Earthquake/volcanic eruption
- Lightning

**ICC (C) - Minimum Cover**:
- Fire/explosion only
- Vessel sinking/collision
- Discharge at distress port
- General average
- Jettison
- Very narrow coverage
- Lowest premium

**Comparison**:
```typescript
interface CargoInsuranceComparison {
    clauseA: {
        coverage: "ALL RISKS except exclusions";
        excludes: [
            "Willful misconduct",
            "Ordinary leakage/loss in weight",
            "Inherent vice",
            "Delay",
            "Insolvency of carrier",
            "War (unless additional premium)",
            "Strikes (unless additional premium)"
        ];
        premium: "0.3-0.5% of insured value";
        recommendation: "Standard choice for most cargo";
    };
    
    clauseB: {
        coverage: "Named perils only";
        covers: 9; // specific perils
        premium: "0.2-0.35% of insured value";
        recommendation: "Low-value or less vulnerable cargo";
    };
    
    clauseC: {
        coverage: "Minimum (basic perils only)";
        covers: 7; // very limited
        premium: "0.1-0.2% of insured value";
        recommendation: "Bulk commodities, supplementary to other coverage";
    };
}
```

### Additional Coverage

**War and Strikes Coverage**:
- Separate endorsement
- Additional premium
- Covers war, civil commotion, strikes, riots
- Essential for high-risk routes

**Theft, Pilferage & Non-Delivery (TPND)**:
- Covers theft by third parties
- Important for high-value consumer goods
- Additional to ICC (A)/(B)

### Insured Value

**Typical Formula**:
```
Insured Value = (CIF Value + Expected Profit) × 110%
```

**Example**:
```typescript
interface InsuredValueCalculation {
    cifValue: 100000;           // Invoice value
    expectedProfit: 10000;      // 10% profit margin
    subtotal: 110000;
    
    inflationFactor: 1.10;      // 110% (industry standard)
    
    insuredValue: 121000;       // 110000 × 1.10
    
    premium_ICC_A: 605;         // 121000 × 0.5%
    premium_WarRisk: 242;       // 121000 × 0.2%
    
    totalPremium: 847;
}
```

**Why 110%**:
- Covers freight and insurance costs
- Accounts for price increases
- Profit margin protection
- Claim settlement costs

### Claims Process

**In Case of Loss/Damage**:

1. **Immediate Actions**:
   - Notify carrier immediately
   - Note damage on delivery receipt
   - Preserve damaged goods and packaging
   - Take photographs
   - Obtain survey report if substantial

2. **Notify Insurer**:
   - Within 30-60 days (policy terms)
   - Provide all documentation

3. **Submit Claim**:
   ```typescript
   interface InsuranceClaim {
       documents: [
           "Insurance certificate/policy",
           "Commercial invoice",
           "Packing list",
           "Bill of lading",
           "Carrier's delivery receipt (noting damage)",
           "Survey report (if obtained)",
           "Photographs of damage",
           "Repair estimates or replacement costs",
           "Correspondence with carrier"
       ];
       
       claimAmount: number;
       incidentDescription: string;
       dateOfLoss: Date;
   }
   ```

4. **Investigation**:
   - Insurer appoints surveyor
   - Damage assessed
   - Cause determined
   - Coverage verified

5. **Settlement**:
   - Agreed amount paid
   - Deductible applied (if any)
   - Subrogation rights to insurer (pursue carrier)

### Incoterms and Insurance

**Who Arranges Insurance**:

| Incoterm | Insurance Responsibility |
|----------|-------------------------|
| **EXW** | Buyer (for entire transit) |
| **FCA/FAS/FOB** | Buyer (from named point) |
| **CFR/CPT** | Buyer (seller only arranges freight) |
| **CIF/CIP** | Seller (minimum coverage required) |
| **DAP/DPU/DDP** | Buyer (seller bears risk but no obligation to insure) |

**CIF/CIP Requirements**:
- Seller must obtain insurance
- Minimum coverage: ICC (C) or equivalent
- 110% of contract value
- In contract currency
- Buyer can request broader coverage (at buyer's cost)

---

## Incoterms 2020

### What are Incoterms?

**International Commercial Terms**: Standardized trade terms published by International Chamber of Commerce (ICC).

**Purpose**:
- Define seller and buyer responsibilities
- Allocate costs between parties
- Determine risk transfer point
- Specify delivery obligations
- Clarify documentation duties

**Not Covered by Incoterms**:
- Transfer of ownership
- Payment terms
- Applicable law
- Dispute resolution

### Incoterms 2020 Categories

**Group E - Departure**:
- **EXW** (Ex Works)

**Group F - Main Carriage Unpaid**:
- **FCA** (Free Carrier)
- **FAS** (Free Alongside Ship)
- **FOB** (Free On Board)

**Group C - Main Carriage Paid**:
- **CFR** (Cost and Freight)
- **CIF** (Cost, Insurance and Freight)
- **CPT** (Carriage Paid To)
- **CIP** (Carriage and Insurance Paid To)

**Group D - Arrival**:
- **DAP** (Delivered at Place)
- **DPU** (Delivered at Place Unloaded)
- **DDP** (Delivered Duty Paid)

### Detailed Incoterm Descriptions

#### EXW (Ex Works)

**Delivery**: Seller's premises
**Risk Transfer**: When goods placed at buyer's disposal
**Seller Obligations**: Minimal - pack goods, notify buyer
**Buyer Obligations**: Everything - export clearance, main carriage, import clearance, delivery

**Use**: Rarely recommended (buyer has no control at origin)

#### FCA (Free Carrier)

**Delivery**: Named place (seller's premises or carrier)
**Risk Transfer**: When goods delivered to carrier
**Seller**: Export clearance, deliver to carrier
**Buyer**: Main carriage, insurance, import clearance

**Use**: Very versatile, suitable for all transport modes

#### FOB (Free On Board)

**Delivery**: On board vessel at named port
**Risk Transfer**: When goods on board
**Seller**: Export clearance, deliver on board
**Buyer**: Ocean freight, insurance, import clearance

**Use**: Sea/inland waterway only, very common

**Example**:
```
FOB Shanghai

Seller Pays:
- Production costs
- Export packing
- Transport to Shanghai port
- Loading charges
- Export customs clearance
- Export duties (if any)

Buyer Pays:
- Ocean freight Shanghai → Luanda
- Marine insurance
- Unloading at Luanda
- Import customs clearance
- Import duties & taxes
- Transport to final destination
```

#### CIF (Cost, Insurance & Freight)

**Delivery**: On board vessel at port of shipment
**Risk Transfer**: When goods on board (same as FOB)
**Seller**: Export clearance, deliver on board, freight, insurance
**Buyer**: Import clearance, import costs

**Important**: Risk transfers when on board, but seller pays freight/insurance

**Use**: Traditional sea freight term

#### CIP (Carriage and Insurance Paid To)

**Delivery**: To carrier at place of shipment
**Risk Transfer**: When delivered to first carrier
**Seller**: Export clearance, freight to destination, insurance
**Insurance**: ICC (A) All Risks minimum (higher than CIF!)
**Buyer**: Import clearance, import costs

**Use**: Any transport mode, enhanced insurance vs CIF

#### DDP (Delivered Duty Paid)

**Delivery**: Named place in import country
**Risk Transfer**: When ready for unloading at destination
**Seller**: Everything - export clearance, freight, insurance, import clearance, duties
**Buyer**: Only unloading

**Use**: Maximum obligation for seller, buyer convenience

**Caution**: Seller must be able to clear import customs (challenging)

### Incoterms Selection Matrix

```typescript
interface IncotermsSelector {
    factors: {
        experienceLevel: 'NEW' | 'INTERMEDIATE' | 'EXPERIENCED';
        transportMode: 'SEA' | 'AIR' | 'ROAD' | 'RAIL' | 'MULTIMODAL';
        controlDesired: 'FULL' | 'SHARED' | 'MINIMAL';
        riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH';
    };
    
    recommendations: {
        newExporter: ['FCA', 'CPT', 'CIP'];  // Transfer risk early
        experiencedExporter: ['DDP', 'DAP']; // Control entire process
        seaFreight: ['FOB', 'CFR', 'CIF'];   // Traditional maritime
        multimodal: ['FCA', 'CPT', 'CIP', 'DAP']; // Flexible
        riskAverse: ['EXW', 'FCA'];          // Minimal seller risk
        buyerConvenience: ['DDP'];           // All-inclusive
    };
}
```

### Common Mistakes

**Errors to Avoid**:

1. **Using FOB for Air Freight** ❌
   - FOB is sea/waterway only
   - Use FCA for air freight

2. **Assuming Risk = Cost** ❌
   - CIF: Risk transfers on board but seller pays freight
   - Parties can suffer loss for costs they paid

3. **Using DDP Without Ability to Clear** ❌
   - Seller must handle import clearance
   - Need local customs knowledge/agent

4. **Not Specifying Location Precisely** ❌
   - "FOB Shanghai" - which terminal?
   - "FCA Frankfurt" - seller's premises or airport?
   - Always specify: "FCA Seller's Warehouse, 123 Main St, Shanghai"

5. **Mixing Incoterms with Payment Terms** ❌
   - Incoterms ≠ payment terms
   - Must specify both: "CIF Luanda, Payment by L/C at sight"

---

## Trade Finance Solutions

### Export Financing

#### Pre-Shipment Financing

**Purpose**: Finance production/procurement before shipment

**Sources**:
- Packing credit from bank
- Red clause L/C (advance under L/C)
- Export working capital loan

**Example**:
```typescript
interface PreShipmentFinance {
    scenario: "Exporter receives order for USD 100,000";
    
    financing: {
        amount: 80000;           // 80% of order value
        purpose: "Purchase raw materials + manufacturing";
        tenure: "90 days (until shipment)";
        securityL: "Export L/C or purchase order";
        interestRate: "8-12% per annum";
    };
    
    repayment: {
        source: "Export proceeds";
        method: "Bill discounting or direct payment";
    };
}
```

#### Post-Shipment Financing

**Purpose**: Bridge gap between shipment and payment receipt

**Types**:

**Export Bill Discounting**:
```csharp
public class BillDiscounting
{
    public decimal CalculateDiscountedAmount(
        decimal billAmount, 
        int daysToMaturity, 
        decimal annualRate)
    {
        // Discount rate for period
        decimal periodRate = (annualRate / 365) * daysToMaturity;
        
        // Discount amount
        decimal discount = billAmount * (periodRate / 100);
        
        // Net proceeds to exporter
        return billAmount - discount;
    }
}

// Example:
// Bill Amount: USD 100,000
// Days to Maturity: 60 days
// Discount Rate: 6% per annum
// Discount: 100,000 × (6% / 365 × 60) = 986
// Net Proceeds: 100,000 - 986 = 99,014
```

**Export Factoring**:
- Sell receivables to factor
- Factor pays 80-90% upfront
- Balance paid upon collection (less fees)
- Factor handles collection

**Export Forfaiting**:
- Sell medium/long-term receivables
- Without recourse (factor bears risk)
- Typical for capital goods export
- 180 days to 7 years tenor

### Import Financing

#### Trust Receipt

**Mechanism**:
```typescript
interface TrustReceipt {
    scenario: "Importer receives docs under L/C but cannot pay immediately";
    
    arrangement: {
        bankPayesLC: true;
        goodsReleasedToImporter: true;
        importerSellsGoods: true;
        proceedsHeldInTrust: true;
        repayBankFromProceeds: true;
    };
    
    terms: {
        period: "30-90 days";
        collateral: "Goods or proceeds";
        interest: "6-10% per annum";
    };
}
```

#### Usance L/C Discounting

**Process**:
- Importer opens usance L/C (60/90/180 days)
- Exporter presents docs, receives acceptance
- Exporter discounts acceptance at bank for immediate payment
- Discount cost borne by importer (usually)

### Supply Chain Finance

#### Reverse Factoring (Confirming)

**Structure**:
```
BUYER (Strong Credit) ← → BANK ← → SUPPLIER (Needs Early Payment)
```

**Benefits**:
- Supplier gets immediate payment (at discount)
- Buyer gets extended payment terms
- Lower financing cost (based on buyer's credit)

**Example**:
```typescript
interface ReverseFactoring {
    invoice: {
        amount: 50000;
        terms: "Net 90 days";
        issueDate: "2026-01-01";
    };
    
    supplierOption: {
        waitForPayment: {
            paymentDate: "2026-03-31";
            amountReceived: 50000;
        };
        
        earlyPayment: {
            discountRate: "3% per annum";
            paymentDate: "2026-01-05"; // Immediate
            discount: 370;             // 50000 × 3% × (85/365)
            amountReceived: 49630;
        };
    };
    
    buyerBenefit: {
        paymentDate: "2026-03-31"; // Still pays on day 90
        amount: 50000;
        improveSSupplierRelationship: true;
    };
}
```

---

## Summary

### Payment Method Selection Guide

**Decision Framework**:

```
Is this first transaction with buyer?
│
├─ YES → Use L/C (preferably confirmed)
│
└─ NO → Trust level?
    │
    ├─ LOW → L/C or Documentary Collection (D/P)
    │
    ├─ MEDIUM → Documentary Collection or Open Account with insurance
    │
    └─ HIGH → Open Account

Order Value?
│
├─ HIGH (>$100k) → L/C strongly recommended
└─ LOW (<$10k) → Consider documentary collection or open account

Buyer Country Risk?
│
├─ HIGH → Confirmed L/C or cash in advance
└─ LOW → Can use unconfirmed L/C or collection
```

### Best Practices

**For Exporters**:
1. Assess buyer creditworthiness before offering terms
2. Use L/C for new/unknown buyers
3. Ensure L/C terms are achievable before accepting
4. Present documents carefully (avoid discrepancies)
5. Insure cargo adequately (ICC A recommended)
6. Consider export credit insurance for open account sales

**For Importers**:
7. Request realistic L/C terms from supplier
8. Verify documents thoroughly upon receipt
9. Use trust receipts if short-term liquidity needed
10. Consider supply chain finance for working capital optimization
11. Maintain good banking relationships for competitive rates

**For Both**:
12. Understand Incoterms responsibilities clearly
13. Specify Incoterm precisely in contracts
14. Keep L/C amendments to minimum (costly)
15. Maintain complete documentation
16. Consult trade finance specialists for complex transactions

### Resources

**ICC Publications**:
- UCP 600 - Uniform Customs & Practice for Documentary Credits
- URC 522 - Uniform Rules for Collections
- URDG 758 - Uniform Rules for Demand Guarantees
- Incoterms 2020

**Insurance**:
- Institute Cargo Clauses (A/B/C)
- Institute War Clauses
- Institute Strikes Clauses

**Online Tools**:
- ICC Digital Library
- SWIFT Standards
- Trade Finance Global

By understanding and properly utilizing trade finance instruments and cargo insurance, importers and exporters can manage risks effectively, optimize working capital, and facilitate smooth international trade transactions.
