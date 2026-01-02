# Customs Clearance Process Guide

**End-to-End Declaration Processing in JUL System**

---

## Table of Contents

1. [Introduction](#introduction)
2. [Pre-Clearance Phase](#pre-clearance-phase)
3. [Declaration Submission](#declaration-submission)
4. [Risk Assessment](#risk-assessment)
5. [Customs Examination](#customs-examination)
6. [Duty Assessment & Payment](#duty-assessment--payment)
7. [Clearance & Release](#clearance--release)
8. [Post-Clearance Activities](#post-clearance-activities)
9. [Special Procedures](#special-procedures)

---

## Introduction

### Overview

The customs clearance process in Angola through the JUL system follows international best practices aligned with multiple international frameworks:

- **Revised Kyoto Convention (RKC)**: Simplification and harmonization principles
- **WCO SAFE Framework**: Security and facilitation through partnerships
- **WTO Trade Facilitation Agreement (TFA)**: Expedited movement and clearance of goods
- **WCO Coordinated Border Management (CBM)**: Multi-agency cooperation

The process is designed to facilitate legitimate trade while maintaining effective border control, balancing trade facilitation with regulatory compliance.

### Key Objectives

- **Trade Facilitation**: Minimize clearance time for compliant traders (TFA Article 7)
- **Risk Management**: Focus resources on high-risk consignments (RKC General Annex)
- **Revenue Collection**: Ensure accurate duty and tax collection
- **Regulatory Compliance**: Enforce trade regulations and restrictions
- **Data Quality**: Maintain accurate trade statistics
- **Transparency**: Publish all customs procedures and requirements (TFA Article 1)
- **Advance Rulings**: Provide binding decisions before importation (TFA Article 3)
- **Single Window**: One-stop submission of documentation (TFA Article 10.4)
- **Authorized Operators**: Simplified procedures for compliant traders (RKC Specific Annex)
- **Coordinated Interventions**: Multi-agency cooperation at borders (CBM Framework)

### Process Timeline

| Stage | Target Time | Description |
|-------|-------------|-------------|
| Pre-arrival | -24 hours | Manifest submission, document preparation |
| Declaration Submission | Day 0 | Electronic declaration lodgment |
| Risk Assessment | < 1 hour | Automated risk profiling |
| Document Review | 2-4 hours | Officer review of declaration |
| Physical Inspection | 4-8 hours | If required based on risk |
| Duty Payment | 2-4 hours | Electronic payment processing |
| Clearance Certificate | < 1 hour | After payment confirmation |
| **Total (Green Channel)** | **4-6 hours** | Low-risk declarations |
| **Total (Standard)** | **1-2 days** | Medium-risk declarations |
| **Total (Red Channel)** | **2-5 days** | High-risk or complex declarations |

---

## Pre-Clearance Phase

### Step 1: Cargo Manifest Submission

**Actor**: Carrier/Shipping Agent  
**Timeline**: 24 hours before arrival  
**System**: ASYCUDA CUSCAR message

```
┌─────────┐        Manifest        ┌──────────┐
│ Carrier │ ═══════════════════> │ ASYCUDA  │
└─────────┘      (CUSCAR)          └──────────┘
                                         │
                                         │ Notification
                                         ▼
                                    ┌─────────┐
                                    │   JUL   │
                                    └─────────┘
```

**Required Information**:
- Vessel/Flight/Vehicle identification
- Cargo description and quantities
- Consignee information
- Port of loading and discharge
- Expected arrival date/time

**JUL Notification**:
```csharp
public class ManifestNotification
{
    public string VoyageNumber { get; set; }
    public DateTime ExpectedArrival { get; set; }
    public List<CargoItem> Items { get; set; }
    public string ConsigneeNIF { get; set; }
}

// System automatically notifies registered importers
await _notificationService.NotifyConsignee(
    consigneeNIF,
    $"Cargo manifest received for voyage {voyageNumber}. " +
    $"Expected arrival: {expectedArrival:yyyy-MM-dd HH:mm}");
```

### Step 2: Company Registration Verification

**Actor**: Importer/Exporter  
**Prerequisite**: Active company registration in JUL

**Verification Checklist**:
- ✅ Company registered in JUL system
- ✅ NIF (Tax ID) active and valid
- ✅ CNCA license current (if required)
- ✅ Agent nomination active (if using broker)
- ✅ Bank account registered for duty payments

**JUL Validation**:
```csharp
public async Task<CompanyEligibility> CheckClearanceEligibility(string nif)
{
    var company = await _database.Companies
        .Include(c => c.Licenses)
        .Include(c => c.BankAccounts)
        .FirstOrDefaultAsync(c => c.NIF == nif);
    
    var eligibility = new CompanyEligibility
    {
        IsRegistered = company != null,
        IsActive = company?.Status == CompanyStatus.Active,
        HasCNCA = company?.Licenses.Any(l => 
            l.LicenseType == "CNCA" && 
            l.ExpiryDate > DateTime.UtcNow) ?? false,
        HasPaymentMethod = company?.BankAccounts.Any() ?? false
    };
    
    eligibility.IsEligible = eligibility.IsRegistered && 
                            eligibility.IsActive && 
                            eligibility.HasPaymentMethod;
    
    return eligibility;
}
```

### Step 3: Document Preparation

**Actor**: Importer/Customs Broker  
**Timeline**: Before declaration submission

**Required Documents**:

#### Commercial Documents
- ✅ Commercial Invoice (original)
- ✅ Packing List
- ✅ Bill of Lading / Airway Bill
- ✅ Insurance Certificate
- ✅ Purchase Order / Pro Forma Invoice

#### Regulatory Documents
- ✅ Certificate of Origin (if claiming preference)
- ✅ Import License (for restricted goods)
- ✅ Health/Phytosanitary Certificates (OGA requirements)
- ✅ Standards/Quality Certificates
- ✅ Pre-Shipment Inspection Certificate (if applicable)

**JUL Document Upload**:
```typescript
// Angular component for document upload
export class DocumentUploadComponent {
  uploadDocument(file: File, documentType: string): void {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('declarationId', this.declarationId);
    
    this.documentService.upload(formData).subscribe({
      next: (response) => {
        this.documents.push(response);
        this.notifySuccess('Document uploaded successfully');
      },
      error: (error) => {
        this.notifyError(`Upload failed: ${error.message}`);
      }
    });
  }
  
  validateDocument(documentType: string): boolean {
    const required = this.getRequiredDocuments();
    return required.includes(documentType) && 
           this.documents.some(d => d.type === documentType);
  }
}
```

---

## Declaration Submission

### Step 4: Declaration Creation

**Actor**: Customs Broker / Importer  
**System**: JUL Web Portal  
**Timeline**: After cargo arrival

**Declaration Types**:
- **IM**: Import Declaration
- **EX**: Export Declaration
- **T1**: Transit Declaration (non-EU goods)
- **T2**: Transit Declaration (EU goods)

#### Import Declaration Wizard

```typescript
export interface DeclarationWizardStep {
  step: number;
  title: string;
  isComplete: boolean;
  isValid: boolean;
}

export class DeclarationWizard {
  steps: DeclarationWizardStep[] = [
    { step: 1, title: 'Declaration Header', isComplete: false, isValid: false },
    { step: 2, title: 'Parties Information', isComplete: false, isValid: false },
    { step: 3, title: 'Goods Items', isComplete: false, isValid: false },
    { step: 4, title: 'Transport Details', isComplete: false, isValid: false },
    { step: 5, title: 'Documents', isComplete: false, isValid: false },
    { step: 6, title: 'Review & Submit', isComplete: false, isValid: false }
  ];
  
  currentStep = 1;
  declaration: Declaration = new Declaration();
  
  nextStep(): void {
    if (this.validateCurrentStep()) {
      this.steps[this.currentStep - 1].isComplete = true;
      this.currentStep++;
    }
  }
  
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validateHeader();
      case 2:
        return this.validateParties();
      case 3:
        return this.validateGoodsItems();
      case 4:
        return this.validateTransport();
      case 5:
        return this.validateDocuments();
      case 6:
        return this.validateComplete();
      default:
        return false;
    }
  }
}
```

### Step 5: Declaration Validation

**System**: Automatic validation engine  
**Timeline**: Real-time during data entry

**Validation Levels**:

#### Level 1: Format Validation
```csharp
public class FormatValidator
{
    public ValidationResult ValidateFormat(Declaration declaration)
    {
        var errors = new List<string>();
        
        // HS Code format
        foreach (var item in declaration.GoodsItems)
        {
            if (!Regex.IsMatch(item.CommodityCode, @"^\d{6,10}$"))
            {
                errors.Add($"Item {item.SequenceNumeric}: Invalid HS code format");
            }
        }
        
        // Country code format (ISO 3166-1 alpha-2)
        if (!Regex.IsMatch(declaration.OriginCountryCode, @"^[A-Z]{2}$"))
        {
            errors.Add("Invalid origin country code");
        }
        
        // Currency code format (ISO 4217)
        if (!Regex.IsMatch(declaration.CurrencyCode, @"^[A-Z]{3}$"))
        {
            errors.Add("Invalid currency code");
        }
        
        return new ValidationResult(errors.Count == 0, errors);
    }
}
```

#### Level 2: Business Rule Validation
```csharp
public class BusinessRuleValidator
{
    public async Task<ValidationResult> ValidateBusinessRules(Declaration declaration)
    {
        var errors = new List<string>();
        var warnings = new List<string>();
        
        // Check HS code exists in master data
        foreach (var item in declaration.GoodsItems)
        {
            var hsCode = await _masterDataService.GetHSCode(item.CommodityCode);
            if (hsCode == null)
            {
                errors.Add($"Item {item.SequenceNumeric}: HS code {item.CommodityCode} not found");
            }
            else if (!string.IsNullOrEmpty(hsCode.RestrictionCode))
            {
                warnings.Add($"Item {item.SequenceNumeric}: Restricted goods - additional documents may be required");
            }
        }
        
        // Validate total weights
        var declaredTotalWeight = declaration.TotalGrossMass;
        var calculatedTotalWeight = declaration.GoodsItems.Sum(i => i.GrossWeightMeasure);
        
        if (Math.Abs(declaredTotalWeight - calculatedTotalWeight) > 0.01m)
        {
            warnings.Add($"Total declared weight ({declaredTotalWeight} kg) differs from sum of items ({calculatedTotalWeight} kg)");
        }
        
        // Check required licenses
        var requiredLicenses = await CheckRequiredLicenses(declaration);
        if (requiredLicenses.Any())
        {
            errors.Add($"Required licenses missing: {string.Join(", ", requiredLicenses)}");
        }
        
        return new ValidationResult(errors.Count == 0, errors, warnings);
    }
}
```

#### Level 3: WCO Compliance Validation
```csharp
public class WCOComplianceValidator
{
    public ValidationResult ValidateWCOCompliance(Declaration declaration)
    {
        var errors = new List<string>();
        
        // WCO 2/5: Functional Reference ID (mandatory)
        if (string.IsNullOrEmpty(declaration.FunctionalReferenceId))
        {
            errors.Add("WCO 2/5: Functional Reference ID is required");
        }
        
        // WCO 1/1: Declaration Type Code (mandatory)
        if (string.IsNullOrEmpty(declaration.DeclarationTypeCode))
        {
            errors.Add("WCO 1/1: Declaration Type Code is required");
        }
        
        // WCO 5/27: Declaration Office (mandatory)
        if (string.IsNullOrEmpty(declaration.DeclarationOfficeId))
        {
            errors.Add("WCO 5/27: Declaration Office is required");
        }
        
        // Each goods item must have required elements
        foreach (var item in declaration.GoodsItems)
        {
            if (string.IsNullOrEmpty(item.CommodityCode))
            {
                errors.Add($"Item {item.SequenceNumeric} - WCO 6/14: Commodity code is required");
            }
            
            if (!item.CustomsValueAmount.HasValue || item.CustomsValueAmount <= 0)
            {
                errors.Add($"Item {item.SequenceNumeric} - WCO 4/14: Customs value is required");
            }
            
            if (!item.GrossWeightMeasure.HasValue || item.GrossWeightMeasure <= 0)
            {
                errors.Add($"Item {item.SequenceNumeric} - WCO 6/5: Gross weight is required");
            }
        }
        
        return new ValidationResult(errors.Count == 0, errors);
    }
}
```

### Step 6: Declaration Submission to ASYCUDA

**System**: ASYCUDA Integration Service  
**Timeline**: Immediate after validation  
**Protocol**: SOAP/XML CUSDEC message

```csharp
public async Task<SubmissionResult> SubmitToASYCUDA(Declaration declaration)
{
    try
    {
        // Build CUSDEC message
        var cusdecMessage = _messageBuilder.BuildCusdecMessage(declaration);
        
        // Log outgoing message
        await _auditService.LogIntegration("ASYCUDA", "CUSDEC_SENT", cusdecMessage);
        
        // Send to ASYCUDA
        var response = await _asycudaClient.SendCusdecAsync(cusdecMessage);
        
        // Parse CUSRES response
        var cusresResponse = _messageParser.ParseCusresMessage(response);
        
        // Log incoming message
        await _auditService.LogIntegration("ASYCUDA", "CUSRES_RECEIVED", response);
        
        // Update declaration status
        declaration.Status = cusresResponse.HasErrors ? 
            DeclarationStatus.Rejected : 
            DeclarationStatus.Submitted;
        declaration.ASYCUDAReferenceNumber = cusresResponse.ResponseReferenceId;
        declaration.SubmissionDateTime = DateTime.UtcNow;
        
        await _database.SaveChangesAsync();
        
        // Notify user
        await _notificationService.NotifyDeclarant(
            declaration.DeclarantPartyId,
            cusresResponse.HasErrors ?
                $"Declaration {declaration.FunctionalReferenceId} rejected: {cusresResponse.ErrorDescription}" :
                $"Declaration {declaration.FunctionalReferenceId} submitted successfully");
        
        return new SubmissionResult
        {
            Success = !cusresResponse.HasErrors,
            ASYCUDAReferenceNumber = cusresResponse.ResponseReferenceId,
            Message = cusresResponse.StatusMessage,
            Errors = cusresResponse.HasErrors ? 
                new List<string> { cusresResponse.ErrorDescription } : 
                new List<string>()
        };
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to submit declaration to ASYCUDA");
        throw new ASYCUDAIntegrationException("Submission failed", ex);
    }
}
```

---

## Risk Assessment

### Step 7: Automated Risk Profiling

**System**: ASYCUDA Risk Management Module  
**Timeline**: Within 1 hour of submission  
**Method**: Automated scoring algorithm

**Risk Factors**:

#### Trader Profile (30% weight)
- History of compliance violations
- CNCA license status
- AEO (Authorized Economic Operator) status
- Years in business
- Declaration volume and accuracy

#### Commodity Risk (25% weight)
- HS code risk classification
- Prohibited or restricted goods
- High-value commodities
- Goods subject to special duties
- Counterfeit-prone items

#### Value and Duty Risk (20% weight)
- Declared value vs. market value
- Under/over-valuation indicators
- Value compared to historical data
- Duty amount threshold

#### Origin and Route (15% weight)
- Country of origin risk rating
- Port of loading risk rating
- Transit route and countries
- Transhipment points

#### Document Completeness (10% weight)
- All required documents present
- Document quality and authenticity
- License validity
- Certification completeness

**Risk Classification**:
```csharp
public enum RiskLevel
{
    Green = 1,    // Low risk - Auto-clear
    Yellow = 2,   // Medium risk - Document review
    Orange = 3,   // High risk - Physical inspection
    Red = 4       // Very high risk - Intensive examination
}

public class RiskAssessmentEngine
{
    public async Task<RiskAssessment> AssessRisk(Declaration declaration)
    {
        var scores = new Dictionary<string, decimal>();
        
        // Trader profile score (0-30)
        scores["TraderProfile"] = await CalculateTraderRisk(declaration.DeclarantPartyId);
        
        // Commodity risk score (0-25)
        scores["CommodityRisk"] = await CalculateCommodityRisk(declaration.GoodsItems);
        
        // Value risk score (0-20)
        scores["ValueRisk"] = await CalculateValueRisk(declaration);
        
        // Origin risk score (0-15)
        scores["OriginRisk"] = await CalculateOriginRisk(declaration);
        
        // Document completeness score (0-10)
        scores["DocumentRisk"] = await CalculateDocumentRisk(declaration);
        
        // Total risk score (0-100)
        var totalScore = scores.Values.Sum();
        
        // Determine risk level
        var riskLevel = totalScore switch
        {
            <= 20 => RiskLevel.Green,
            <= 40 => RiskLevel.Yellow,
            <= 70 => RiskLevel.Orange,
            _ => RiskLevel.Red
        };
        
        return new RiskAssessment
        {
            DeclarationId = declaration.DeclarationId,
            TotalScore = totalScore,
            ScoreBreakdown = scores,
            RiskLevel = riskLevel,
            RecommendedAction = GetRecommendedAction(riskLevel),
            AssessmentDateTime = DateTime.UtcNow
        };
    }
    
    private string GetRecommendedAction(RiskLevel riskLevel)
    {
        return riskLevel switch
        {
            RiskLevel.Green => "Auto-clear after duty payment",
            RiskLevel.Yellow => "Document review by officer",
            RiskLevel.Orange => "Physical inspection required",
            RiskLevel.Red => "Intensive examination and verification",
            _ => "Manual review"
        };
    }
}
```

### Step 8: Channel Assignment

**System**: Customs Officer Interface / Automated  
**Channels**:

| Channel | Risk Level | Action Required | Processing Time |
|---------|-----------|-----------------|-----------------|
| 🟢 Green | Low | Auto-clear after payment | 4-6 hours |
| 🟡 Yellow | Medium | Document review | 1-2 days |
| 🟠 Orange | High | Physical inspection | 2-3 days |
| 🔴 Red | Very High | Intensive examination | 3-5 days |

---

## Customs Examination

### Step 9: Document Review (Yellow/Orange/Red Channels)

**Actor**: Customs Officer  
**System**: ASYCUDA Workstation  
**Timeline**: 2-8 hours

**Review Checklist**:
```typescript
export interface DocumentReviewChecklist {
  declaration: {
    referenceNumber: string;
    completed: boolean;
    notes: string;
  };
  commercialInvoice: {
    authentic: boolean;
    valuesMatch: boolean;
    notes: string;
  };
  packingList: {
    quantitiesMatch: boolean;
    weightsMatch: boolean;
    notes: string;
  };
  billOfLading: {
    authentic: boolean;
    consigneeCorrect: boolean;
    notes: string;
  };
  certificates: {
    originCertificate?: boolean;
    healthCertificate?: boolean;
    qualityC Certificate?: boolean;
    notes: string;
  };
  licenses: {
    importLicenseValid: boolean;
    cnca Valid: boolean;
    notes: string;
  };
  overallAssessment: {
    approved: boolean;
    requiresInspection: boolean;
    rejectionReasons?: string[];
    officerId: string;
    reviewDateTime: Date;
  };
}
```

**Officer Actions**:
```csharp
public async Task<ReviewDecision> ReviewDeclaration(
    Guid declarationId,
    string officerId,
    DocumentReviewChecklist checklist)
{
    var declaration = await _database.Declarations
        .Include(d => d.GoodsItems)
        .Include(d => d.Documents)
        .FirstOrDefaultAsync(d => d.DeclarationId == declarationId);
    
    // Create review record
    var review = new DeclarationReview
    {
        ReviewId = Guid.NewGuid(),
        DeclarationId = declarationId,
        OfficerId = officerId,
        ReviewDateTime = DateTime.UtcNow,
        ReviewType = "DOCUMENT_REVIEW",
        Checklist = JsonSerializer.Serialize(checklist),
        Decision = checklist.OverallAssessment.Approved ? "APPROVED" : "REQUIRES_INSPECTION"
    };
    
    await _database.DeclarationReviews.AddAsync(review);
    
    // Update declaration status
    if (checklist.OverallAssessment.Approved)
    {
        declaration.Status = DeclarationStatus.Approved;
        await _notificationService.NotifyDeclarant(
            declaration.DeclarantPartyId,
            $"Declaration {declaration.FunctionalReferenceId} approved. Proceed to payment.");
    }
    else if (checklist.OverallAssessment.RequiresInspection)
    {
        declaration.Status = DeclarationStatus.InspectionRequired;
        await ScheduleInspection(declaration);
    }
    else
    {
        declaration.Status = DeclarationStatus.Rejected;
        await _notificationService.NotifyDeclarant(
            declaration.DeclarantPartyId,
            $"Declaration {declaration.FunctionalReferenceId} rejected: " +
            string.Join(", ", checklist.OverallAssessment.RejectionReasons));
    }
    
    await _database.SaveChangesAsync();
    
    // Audit log
    await _auditService.LogActivity(
        officerId,
        "DECLARATION_REVIEW",
        declarationId.ToString(),
        review.Decision);
    
    return new ReviewDecision
    {
        Approved = checklist.OverallAssessment.Approved,
        RequiresInspection = checklist.OverallAssessment.RequiresInspection,
        Message = review.Decision
    };
}
```

### Step 10: Physical Inspection (Orange/Red Channels)

**Actor**: Customs Inspector  
**Location**: Examination Area  
**Timeline**: 4-24 hours

**Inspection Types**:

#### Non-Intrusive Inspection (NII)
- X-ray scanning of containers
- Gamma-ray inspection
- Automated manifest verification

#### Physical Inspection
- Container opening and examination
- Sample taking for laboratory analysis
- Quantity verification
- Product identification

**Inspection Process**:
```csharp
public class PhysicalInspection
{
    public Guid InspectionId { get; set; }
    public Guid DeclarationId { get; set; }
    public DateTime ScheduledDateTime { get; set; }
    public DateTime? ActualDateTime { get; set; }
    public string InspectorId { get; set; }
    public string InspectionLocation { get; set; }
    public InspectionType Type { get; set; }
    public List<InspectionFinding> Findings { get; set; }
    public InspectionResult Result { get; set; }
    public string Notes { get; set; }
}

public enum InspectionType
{
    NonIntrusive,      // X-ray/Gamma-ray
    PartialPhysical,   // Sample inspection
    FullPhysical,      // 100% examination
    Laboratory         // Sample testing
}

public enum InspectionResult
{
    Conforming,        // Matches declaration
    MinorDiscrepancy,  // Small differences, acceptable
    MajorDiscrepancy,  // Significant differences
    Fraudulent         // False declaration
}

public class InspectionFinding
{
    public int GoodsItemSequence { get; set; }
    public string FindingType { get; set; }
    public string DeclaredValue { get; set; }
    public string ActualValue { get; set; }
    public string Description { get; set; }
    public bool RequiresAction { get; set; }
}
```

**Inspection Outcomes**:
1. **Conforming**: Proceed to duty assessment
2. **Minor Discrepancy**: Adjust declaration, recalculate duties
3. **Major Discrepancy**: Administrative penalty, duty adjustment
4. **Fraudulent**: Seizure, legal proceedings

---

## Duty Assessment & Payment

### Step 11: Duty Calculation

**System**: ASYCUDA Assessment Module  
**Timeline**: Within 2 hours of approval  
**Method**: Automated calculation

**Calculation Formula**:
```
CIF Value = FOB + Freight + Insurance
Customs Duty = CIF Value × Duty Rate
Dutiable Value = CIF Value + Customs Duty
VAT = Dutiable Value × VAT Rate
Total Tax = Customs Duty + VAT + Other Taxes
Grand Total = CIF Value + Total Tax
```

**Implementation**:
```csharp
public class DutyCalculator
{
    public async Task<TariffCalculation> CalculateDuties(Declaration declaration)
    {
        var calculation = new TariffCalculation
        {
            DeclarationId = declaration.DeclarationId,
            CalculationDateTime = DateTime.UtcNow,
            ItemCalculations = new List<ItemTariffCalculation>()
        };
        
        foreach (var item in declaration.GoodsItems)
        {
            var hsCode = await _masterDataService.GetHSCode(item.CommodityCode);
            
            // Get applicable duty rate (considering preferences)
            var dutyRate = await GetApplicableDutyRate(
                item.CommodityCode,
                item.OriginCountryCode,
                declaration.DeclarationDate);
            
            // CIF Value calculation
            var cifValue = item.StatisticalValueAmount; // Already includes FOB + Freight + Insurance
            
            // Customs Duty
            var customsDuty = cifValue * (dutyRate / 100);
            
            // Dutiable Value for VAT
            var dutiableValue = cifValue + customsDuty;
            
            // VAT
            var vat = dutiableValue * (hsCode.VATRate / 100);
            
            // Excise duty (if applicable)
            var exciseDuty = await CalculateExciseDuty(item);
            
            // Total for this item
            var totalTax = customsDuty + vat + exciseDuty;
            
            calculation.ItemCalculations.Add(new ItemTariffCalculation
            {
                SequenceNumeric = item.SequenceNumeric,
                HSCode = item.CommodityCode,
                CIFValue = cifValue,
                DutyRate = dutyRate,
                CustomsDuty = customsDuty,
                VATRate = hsCode.VATRate,
                VAT = vat,
                ExciseDuty = exciseDuty,
                TotalTax = totalTax,
                GrandTotal = cifValue + totalTax
            });
        }
        
        // Sum all items
        calculation.TotalCIFValue = calculation.ItemCalculations.Sum(i => i.CIFValue);
        calculation.TotalCustomsDuty = calculation.ItemCalculations.Sum(i => i.CustomsDuty);
        calculation.TotalVAT = calculation.ItemCalculations.Sum(i => i.VAT);
        calculation.TotalExciseDuty = calculation.ItemCalculations.Sum(i => i.ExciseDuty);
        calculation.TotalTax = calculation.ItemCalculations.Sum(i => i.TotalTax);
        calculation.GrandTotal = calculation.ItemCalculations.Sum(i => i.GrandTotal);
        
        return calculation;
    }
    
    private async Task<decimal> GetApplicableDutyRate(
        string hsCode,
        string originCountry,
        DateTime declarationDate)
    {
        // Check for preferential rates (SADC, EU, etc.)
        var preferential = await _database.PreferentialRates
            .Where(p => 
                p.HSCode == hsCode &&
                p.OriginCountry == originCountry &&
                p.EffectiveDate <= declarationDate &&
                (p.ExpiryDate == null || p.ExpiryDate > declarationDate))
            .FirstOrDefaultAsync();
        
        if (preferential != null)
        {
            return preferential.PreferentialRate;
        }
        
        // Use standard MFN rate
        var hsCodeData = await _masterDataService.GetHSCode(hsCode);
        return hsCodeData.DutyRate;
    }
}
```

### Step 12: Payment Processing

**Actor**: Importer/Broker  
**System**: JUL Payment Gateway (integrated in Declaration Service)  
**Timeline**: Within 24 hours of assessment

**Payment Methods**:
1. **Electronic Bank Transfer**: Direct transfer to customs account
2. **Credit/Debit Card**: Online payment via gateway
3. **Mobile Money**: M-Pesa, other mobile payment platforms
4. **Bank Guarantee**: For deferred payment (AEO members)

**Payment Implementation**:
```csharp
public async Task<PaymentResult> ProcessPayment(
    Guid declarationId,
    PaymentMethod method,
    PaymentDetails details)
{
    var declaration = await _database.Declarations
        .Include(d => d.TariffCalculation)
        .FirstOrDefaultAsync(d => d.DeclarationId == declarationId);
    
    if (declaration == null)
    {
        throw new NotFoundException("Declaration not found");
    }
    
    if (declaration.Status != DeclarationStatus.Approved)
    {
        throw new InvalidOperationException("Declaration not approved for payment");
    }
    
    var payment = new Payment
    {
        PaymentId = Guid.NewGuid(),
        DeclarationId = declarationId,
        Amount = declaration.TariffCalculation.TotalTax,
        Currency = "AOA",
        PaymentMethod = method,
        Status = PaymentStatus.Pending,
        InitiatedDateTime = DateTime.UtcNow
    };
    
    try
    {
        // Process payment through gateway
        var result = await _paymentGateway.ProcessPayment(payment, details);
        
        if (result.Success)
        {
            payment.Status = PaymentStatus.Completed;
            payment.CompletedDateTime = DateTime.UtcNow;
            payment.TransactionReference = result.TransactionId;
            payment.BankReference = result.BankReference;
            
            // Update declaration status
            declaration.Status = DeclarationStatus.DutiesPaid;
            declaration.PaymentDateTime = DateTime.UtcNow;
            
            // Notify ASYCUDA of payment
            await NotifyASYCUDAPayment(declaration, payment);
            
            // Send receipt
            await _notificationService.SendPaymentReceipt(
                declaration.DeclarantPartyId,
                payment);
        }
        else
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailureReason = result.ErrorMessage;
        }
        
        await _database.Payments.AddAsync(payment);
        await _database.SaveChangesAsync();
        
        return new PaymentResult
        {
            Success = result.Success,
            PaymentId = payment.PaymentId,
            TransactionReference = payment.TransactionReference,
            Message = result.Success ? 
                "Payment processed successfully" : 
                $"Payment failed: {result.ErrorMessage}"
        };
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Payment processing failed for declaration {DeclarationId}", declarationId);
        throw new PaymentProcessingException("Payment processing failed", ex);
    }
}
```

---

## Clearance & Release

### Step 13: Clearance Certificate Generation

**System**: ASYCUDA  
**Timeline**: Within 1 hour of payment confirmation  
**Format**: PDF with QR code and digital signature

```csharp
public async Task<ClearanceCertificate> GenerateClearanceCertificate(Guid declarationId)
{
    var declaration = await _database.Declarations
        .Include(d => d.DeclarantParty)
        .Include(d => d.ConsigneeParty)
        .Include(d => d.GoodsItems)
        .Include(d => d.Payment)
        .FirstOrDefaultAsync(d => d.DeclarationId == declarationId);
    
    var certificate = new ClearanceCertificate
    {
        CertificateId = Guid.NewGuid(),
        DeclarationId = declarationId,
        CertificateNumber = GenerateCertificateNumber(),
        IssueDateTime = DateTime.UtcNow,
        ExpiryDateTime = DateTime.UtcNow.AddDays(30), // Valid for 30 days
        DeclarationReference = declaration.FunctionalReferenceId,
        ASYCUDAReferenceNumber = declaration.ASYCUDAReferenceNumber,
        Consignee = declaration.ConsigneeParty.Name,
        TotalDutyPaid = declaration.Payment.Amount,
        Status = CertificateStatus.Valid
    };
    
    // Generate PDF
    var pdf Bytes = await _pdfGenerator.GenerateClearanceCertificatePDF(certificate, declaration);
    
    // Store in MinIO
    var storagePath = await _minioService.UploadDocument(
        pdfBytes,
        $"clearance-certificates/{certificate.CertificateNumber}.pdf",
        "application/pdf");
    
    certificate.DocumentPath = storagePath;
    
    // Generate QR code for verification
    certificate.QRCode = GenerateQRCode(certificate.CertificateNumber);
    
    // Digital signature
    certificate.DigitalSignature = await _cryptoService.SignDocument(pdfBytes);
    
    await _database.ClearanceCertificates.AddAsync(certificate);
    
    // Update declaration status
    declaration.Status = DeclarationStatus.Cleared;
    declaration.ClearanceDateTime = DateTime.UtcNow;
    
    await _database.SaveChangesAsync();
    
    // Notify all parties
    await _notificationService.NotifyCleared(declaration, certificate);
    
    return certificate;
}
```

### Step 14: Cargo Release

**Actor**: Terminal Operator  
**System**: Terminal Operating System + JUL Integration  
**Timeline**: Immediate after clearance

**Release Process**:
```csharp
public async Task<ReleaseOrder> GenerateReleaseOrder(Guid declarationId)
{
    var declaration = await _database.Declarations
        .Include(d => d.ClearanceCertificate)
        .Include(d => d.Containers)
        .FirstOrDefaultAsync(d => d.DeclarationId == declarationId);
    
    if (declaration.Status != DeclarationStatus.Cleared)
    {
        throw new InvalidOperationException("Declaration not cleared");
    }
    
    var releaseOrder = new ReleaseOrder
    {
        ReleaseOrderId = Guid.NewGuid(),
        DeclarationId = declarationId,
        ReleaseOrderNumber = GenerateReleaseOrderNumber(),
        IssueDateTime = DateTime.UtcNow,
        Containers = declaration.Containers.Select(c => c.IdentificationId).ToList(),
        ClearanceCertificateNumber = declaration.ClearanceCertificate.CertificateNumber,
        ValidUntil = DateTime.UtcNow.AddDays(7) // Release within 7 days
    };
    
    await _database.ReleaseOrders.AddAsync(releaseOrder);
    await _database.SaveChangesAsync();
    
    // Send to terminal system
    await _terminalIntegration.SendReleaseOrder(releaseOrder);
    
    // Notify freight forwarder
    await _notificationService.NotifyCargoRelease(
        declaration.ConsigneePartyId,
        releaseOrder);
    
    return releaseOrder;
}
```

---

## Post-Clearance Activities

### Step 15: Post-Clearance Audit

**Timeline**: Within 3 years of clearance  
**Frequency**: Risk-based selection  
**Scope**: Comprehensive verification

**Audit Types**:
1. **Documentary Audit**: Review of records and documents
2. **Physical Audit**: Verification of goods received
3. **Value Audit**: Verification of declared values
4. **Origin Audit**: Certificate of origin verification

**Audit Process**:
```csharp
public class PostClearanceAudit
{
    public Guid AuditId { get; set; }
    public Guid DeclarationId { get; set; }
    public DateTime InitiationDate { get; set; }
    public string AuditorId { get; set; }
    public AuditType Type { get; set; }
    public AuditScope Scope { get; set; }
    public List<AuditFinding> Findings { get; set; }
    public AuditResult Result { get; set; }
    public decimal? AdditionalDutyAssessed { get; set; }
    public decimal? PenaltyAmount { get; set; }
}

public enum AuditResult
{
    Compliant,              // No issues found
    MinorDiscrepancies,     // Small errors, no penalty
    SignificantErrors,      // Additional duty assessed
    FraudDetected          // Legal action
}
```

### Step 16: Amendment and Rectification

**Timeline**: Up to 30 days after clearance  
**Allowed Changes**: Minor errors only

```csharp
public async Task<Amendment> AmendDeclaration(
    Guid declarationId,
    AmendmentRequest request)
{
    var declaration = await _database.Declarations
        .FirstOrDefaultAsync(d => d.DeclarationId == declarationId);
    
    if (declaration.Status != DeclarationStatus.Cleared)
    {
        throw new InvalidOperationException("Only cleared declarations can be amended");
    }
    
    var daysSinceClearance = (DateTime.UtcNow - declaration.ClearanceDateTime.Value).Days;
    if (daysSinceClearance > 30)
    {
        throw new InvalidOperationException("Amendment period expired (30 days)");
    }
    
    var amendment = new Amendment
    {
        AmendmentId = Guid.NewGuid(),
        DeclarationId = declarationId,
        RequestDateTime = DateTime.UtcNow,
        RequestedBy = request.UserId,
        AmendmentType = request.Type,
        OriginalValue = request.OriginalValue,
        NewValue = request.NewValue,
        Justification = request.Justification,
        Status = AmendmentStatus.Pending
    };
    
    // Recalculate duties if value changed
    if (request.Type == AmendmentType.Value)
    {
        var newCalculation = await _dutyCalculator.RecalculateDuties(
            declaration,
            request.NewValue);
        
        amendment.DutyDifference = newCalculation.TotalTax - 
            declaration.TariffCalculation.TotalTax;
    }
    
    await _database.Amendments.AddAsync(amendment);
    await _database.SaveChangesAsync();
    
    // Notify customs for approval
    await _notificationService.NotifyAmendmentRequest(amendment);
    
    return amendment;
}
```

---

## Special Procedures

### Temporary Importation

**Purpose**: Goods imported temporarily for specific purposes  
**Duration**: Up to 12 months  
**Duty**: Suspended or reduced

**Use Cases**:
- Exhibition goods
- Professional equipment
- Repair materials
- Samples

### Transit Declarations

**Purpose**: Goods passing through Angola to another destination  
**Types**: T1 (non-EU), T2 (EU goods)  
**Requirement**: Guarantee or bond

### Bonded Warehouse

**Purpose**: Duty-suspended storage  
**Duration**: Up to 2 years  
**Conditions**: Approved warehouse, regular inspections

---

## References

- [WCO Data Model](../standards/wco-data-model.md)
- [UN/EDIFACT Standards](../standards/un-edifact.md)
- [ASYCUDA Integration](../single-window-overview#integration-service)
- JUL High Level Design Document

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Author**: JUL Technical Team  
**Status**: Production Ready
