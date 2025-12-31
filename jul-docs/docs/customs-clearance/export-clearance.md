# Export Clearance Process

**Complete Guide to Export Customs Clearance Operations**

---

## Overview

Export clearance is the customs procedure required before goods can legally leave Angola. This process ensures compliance with export regulations, proper tax treatment, and documentation requirements.

### Key Objectives
- Verify goods are legally exportable
- Apply correct customs procedures and duties
- Ensure compliance with international trade agreements
- Facilitate legitimate trade while preventing illegal exports
- Generate accurate export statistics

---

## Export Clearance Workflow

### Process Flow Diagram

```
Exporter Registration → Pre-Declaration (Optional) → Export Declaration
    ↓                          ↓                         ↓
Risk Assessment → Document Verification → Physical Inspection (if required)
    ↓                          ↓                         ↓
Payment Processing → Customs Release → Loading Authorization
    ↓                          ↓                         ↓
Departure Confirmation → Exit Processing → Post-Export Audit
```

---

## Phase 1: Pre-Export Preparation

### 1.1 Exporter Registration

**Requirements**:
- Valid commercial registration
- Tax Identification Number (NIF)
- Export license (for restricted goods)
- AEO certification (optional, for simplified procedures)

**System Implementation**:

```csharp
public class ExporterRegistrationService
{
    private readonly IExporterRepository _exporterRepository;
    private readonly ILicenseValidationService _licenseService;
    
    public async Task<ExporterRegistrationResult> ValidateExporter(
        string exporterId, 
        ExportDeclaration declaration)
    {
        var result = new ExporterRegistrationResult();
        
        // Validate exporter exists and is active
        var exporter = await _exporterRepository.GetByIdAsync(exporterId);
        if (exporter == null || exporter.Status != ExporterStatus.Active)
        {
            result.AddError("EXPORTER_NOT_ACTIVE", 
                "Exporter is not registered or inactive");
            return result;
        }
        
        // Check if special licenses required
        if (declaration.RequiresExportLicense())
        {
            var licenseValid = await _licenseService.ValidateExportLicense(
                exporterId, 
                declaration.HsCode
            );
            
            if (!licenseValid)
            {
                result.AddError("EXPORT_LICENSE_REQUIRED", 
                    $"Valid export license required for HS code {declaration.HsCode}");
            }
        }
        
        // Validate AEO status for simplified procedures
        if (declaration.ProcedureCode == "4200") // Simplified export
        {
            if (exporter.AeoStatus != AeoStatus.Certified)
            {
                result.AddError("AEO_REQUIRED", 
                    "AEO certification required for simplified procedures");
            }
        }
        
        result.IsValid = !result.Errors.Any();
        result.ExporterDetails = exporter;
        
        return result;
    }
}

public class ExporterRegistrationResult
{
    public bool IsValid { get; set; }
    public ExporterDetails ExporterDetails { get; set; }
    public List<ValidationError> Errors { get; set; } = new();
    
    public void AddError(string code, string message)
    {
        Errors.Add(new ValidationError { Code = code, Message = message });
    }
}
```

### 1.2 Commercial Documentation

**Required Documents**:
1. **Commercial Invoice**
   - Exporter and buyer details
   - Goods description
   - FOB value in USD
   - Payment terms
   - HS classification

2. **Packing List**
   - Number of packages
   - Package type and dimensions
   - Gross and net weight
   - Marks and numbers

3. **Certificate of Origin**
   - Required for preferential treatment
   - Issued by Chamber of Commerce
   - Valid for 12 months

4. **Export License** (if applicable)
   - For restricted goods (minerals, wildlife products)
   - Valid for specific quantity and period

**Document Validation**:

```typescript
interface ExportDocumentValidation {
  documentType: string;
  validationRules: ValidationRule[];
  required: boolean;
}

class ExportDocumentValidator {
  validateCommercialInvoice(invoice: CommercialInvoice): ValidationResult {
    const errors: string[] = [];
    
    // Validate exporter details
    if (!invoice.exporterName || !invoice.exporterAddress) {
      errors.push('Exporter details incomplete');
    }
    
    if (!invoice.exporterNIF) {
      errors.push('Exporter NIF missing');
    }
    
    // Validate buyer details
    if (!invoice.buyerName || !invoice.buyerCountry) {
      errors.push('Buyer details incomplete');
    }
    
    // Validate goods description
    invoice.items.forEach((item, index) => {
      if (!item.description || item.description.length < 10) {
        errors.push(`Item ${index + 1}: Insufficient description`);
      }
      
      if (!item.hsCode || !this.isValidHsCode(item.hsCode)) {
        errors.push(`Item ${index + 1}: Invalid HS code`);
      }
      
      if (!item.fobValue || item.fobValue <= 0) {
        errors.push(`Item ${index + 1}: Invalid FOB value`);
      }
      
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Invalid quantity`);
      }
    });
    
    // Validate totals
    const calculatedTotal = invoice.items.reduce(
      (sum, item) => sum + item.fobValue, 
      0
    );
    
    if (Math.abs(calculatedTotal - invoice.totalFobValue) > 0.01) {
      errors.push('Invoice total does not match sum of items');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
  
  private isValidHsCode(hsCode: string): boolean {
    // HS code must be 6-10 digits
    return /^\d{6,10}$/.test(hsCode);
  }
}
```

---

## Phase 2: Export Declaration Submission

### 2.1 Declaration Types

**Export Procedures**:
- **10** - Normal export (permanent)
- **11** - Re-export (goods previously imported)
- **23** - Temporary export (for repair, exhibition)
- **31** - Deemed export (to free zone)
- **42** - Simplified export procedure (AEO)

### 2.2 Export Declaration Form

**SAD (Single Administrative Document) Fields**:

```typescript
interface ExportDeclaration {
  // Box 1: Declaration type
  declarationType: 'EX' | 'RE' | 'TE';
  procedureCode: string; // e.g., "10" for normal export
  
  // Box 2: Exporter
  exporterId: string;
  exporterName: string;
  exporterAddress: string;
  exporterNIF: string;
  
  // Box 8: Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneeCountry: string;
  
  // Box 14: Declarant
  declarantId: string;
  declarantName: string;
  
  // Box 15: Country of dispatch/export
  countryOfExport: string; // "AO" for Angola
  
  // Box 17: Destination country
  destinationCountry: string;
  
  // Box 20: Terms of delivery
  incoterm: 'FOB' | 'CIF' | 'CFR' | 'EXW' | 'FCA';
  
  // Box 25: Mode of transport
  modeOfTransport: number; // 1=Sea, 2=Rail, 3=Road, 4=Air
  
  // Box 31-39: Goods items
  items: ExportItem[];
  
  // Box 40: Previous document
  previousDocuments: PreviousDocument[];
  
  // Box 44: Additional information
  additionalInfo: string;
  
  // Box 46: Statistical value
  statisticalValue: number;
  
  // Box 47: Calculation of taxes
  exportDuties: TaxCalculation[];
}

interface ExportItem {
  itemNumber: number;
  hsCode: string;
  description: string;
  countryOfOrigin: string;
  quantity: number;
  unitOfMeasure: string;
  grossMass: number; // in kg
  netMass: number; // in kg
  fobValue: number; // in USD
  statisticalValue: number;
  exportDuty: number;
  exportDutyRate: number;
}
```

### 2.3 Declaration Submission

```csharp
public class ExportDeclarationSubmissionService
{
    private readonly IDeclarationValidator _validator;
    private readonly IRiskEngine _riskEngine;
    private readonly IPaymentService _paymentService;
    
    public async Task<DeclarationSubmissionResult> SubmitExportDeclaration(
        ExportDeclarationRequest request)
    {
        var result = new DeclarationSubmissionResult();
        
        try
        {
            // Step 1: Validate declaration
            var validationResult = await _validator.ValidateExportDeclaration(
                request.Declaration
            );
            
            if (!validationResult.IsValid)
            {
                result.Status = SubmissionStatus.ValidationFailed;
                result.Errors = validationResult.Errors;
                return result;
            }
            
            // Step 2: Generate declaration reference
            var declarationRef = GenerateExportDeclarationReference(
                request.Declaration
            );
            
            // Step 3: Assign to risk assessment
            var riskProfile = await _riskEngine.AssessExportRisk(
                request.Declaration
            );
            
            // Step 4: Determine customs channel
            var channel = DetermineCustomsChannel(riskProfile);
            
            // Step 5: Calculate duties and taxes
            var taxCalculation = await CalculateExportDuties(
                request.Declaration
            );
            
            // Step 6: Create payment if required
            if (taxCalculation.TotalAmount > 0)
            {
                var payment = await _paymentService.CreatePayment(
                    declarationRef,
                    taxCalculation
                );
                
                result.PaymentReference = payment.Reference;
                result.PaymentAmount = taxCalculation.TotalAmount;
            }
            
            // Step 7: Persist declaration
            await SaveDeclaration(declarationRef, request.Declaration);
            
            result.Status = SubmissionStatus.Accepted;
            result.DeclarationReference = declarationRef;
            result.RiskChannel = channel;
            result.TaxAmount = taxCalculation.TotalAmount;
            result.SubmissionDate = DateTime.UtcNow;
            
            return result;
        }
        catch (Exception ex)
        {
            result.Status = SubmissionStatus.SystemError;
            result.Errors.Add(new ValidationError
            {
                Code = "SYSTEM_ERROR",
                Message = "System error occurred during submission"
            });
            
            // Log exception
            _logger.LogError(ex, "Export declaration submission failed");
            
            return result;
        }
    }
    
    private string GenerateExportDeclarationReference(
        ExportDeclaration declaration)
    {
        // Format: EX-YYYY-NNNNNNNN
        var year = DateTime.UtcNow.Year;
        var sequence = GetNextSequenceNumber();
        
        return $"EX-{year}-{sequence:D8}";
    }
    
    private CustomsChannel DetermineCustomsChannel(RiskProfile profile)
    {
        if (profile.RiskLevel == RiskLevel.High)
            return CustomsChannel.Red; // Physical inspection required
        
        if (profile.RiskLevel == RiskLevel.Medium)
            return CustomsChannel.Yellow; // Documentary check
        
        if (profile.RiskLevel == RiskLevel.Low)
            return CustomsChannel.Green; // Automatic clearance
        
        return CustomsChannel.Blue; // Simplified procedure
    }
}
```

---

## Phase 3: Risk Assessment

### 3.1 Export Risk Indicators

**High Risk Factors**:
- First-time exporter
- Restricted goods (minerals, precious stones)
- High-value shipment (>$100,000)
- Discrepancy in previous declarations
- Destination country on watch list
- Undervaluation suspected

**Low Risk Factors**:
- AEO certified exporter
- Regular export pattern
- Low-risk commodity
- Complete documentation
- Consistent pricing

### 3.2 Risk Assessment Engine

```csharp
public class ExportRiskAssessmentEngine
{
    public async Task<RiskProfile> AssessExportRisk(
        ExportDeclaration declaration)
    {
        var profile = new RiskProfile
        {
            DeclarationId = declaration.Id,
            AssessmentDate = DateTime.UtcNow
        };
        
        var riskScore = 0;
        var riskFactors = new List<RiskFactor>();
        
        // Factor 1: Exporter history
        var exporterRisk = await AssessExporterHistory(declaration.ExporterId);
        riskScore += exporterRisk.Score;
        riskFactors.AddRange(exporterRisk.Factors);
        
        // Factor 2: Commodity risk
        var commodityRisk = await AssessCommodityRisk(
            declaration.Items.Select(i => i.HsCode).ToList()
        );
        riskScore += commodityRisk.Score;
        riskFactors.AddRange(commodityRisk.Factors);
        
        // Factor 3: Destination country risk
        var countryRisk = AssessDestinationCountryRisk(
            declaration.DestinationCountry
        );
        riskScore += countryRisk.Score;
        riskFactors.AddRange(countryRisk.Factors);
        
        // Factor 4: Value analysis
        var valueRisk = await AssessValueRisk(declaration);
        riskScore += valueRisk.Score;
        riskFactors.AddRange(valueRisk.Factors);
        
        // Factor 5: Export restrictions
        var restrictionRisk = await CheckExportRestrictions(declaration);
        riskScore += restrictionRisk.Score;
        riskFactors.AddRange(restrictionRisk.Factors);
        
        // Determine risk level
        profile.RiskScore = riskScore;
        profile.RiskFactors = riskFactors;
        profile.RiskLevel = DetermineRiskLevel(riskScore);
        
        return profile;
    }
    
    private async Task<RiskAssessment> AssessExporterHistory(
        string exporterId)
    {
        var assessment = new RiskAssessment();
        var history = await _exporterRepository.GetExportHistory(
            exporterId, 
            months: 12
        );
        
        if (history.TotalExports == 0)
        {
            assessment.Score += 30;
            assessment.Factors.Add(new RiskFactor
            {
                Code = "NEW_EXPORTER",
                Description = "First-time exporter",
                Weight = 30
            });
        }
        else if (history.InfringementCount > 0)
        {
            assessment.Score += 40;
            assessment.Factors.Add(new RiskFactor
            {
                Code = "PREVIOUS_VIOLATIONS",
                Description = $"{history.InfringementCount} violations in last 12 months",
                Weight = 40
            });
        }
        else if (history.AeoStatus == AeoStatus.Certified)
        {
            assessment.Score -= 20; // Lower risk for AEO
            assessment.Factors.Add(new RiskFactor
            {
                Code = "AEO_CERTIFIED",
                Description = "Authorized Economic Operator",
                Weight = -20
            });
        }
        
        return assessment;
    }
    
    private RiskLevel DetermineRiskLevel(int score)
    {
        if (score >= 70) return RiskLevel.High;
        if (score >= 40) return RiskLevel.Medium;
        if (score >= 0) return RiskLevel.Low;
        return RiskLevel.VeryLow; // Negative score for trusted traders
    }
}
```

---

## Phase 4: Document Verification

### 4.1 Yellow Channel Processing

**Documentary Checks**:

```csharp
public class ExportDocumentVerificationService
{
    public async Task<VerificationResult> VerifyExportDocuments(
        string declarationId)
    {
        var result = new VerificationResult();
        var declaration = await GetDeclaration(declarationId);
        
        // Check 1: Commercial invoice
        var invoiceCheck = await VerifyCommercialInvoice(declaration);
        result.Checks.Add(invoiceCheck);
        
        // Check 2: Packing list consistency
        var packingCheck = VerifyPackingList(declaration);
        result.Checks.Add(packingCheck);
        
        // Check 3: Certificate of origin
        if (declaration.RequiresCertificateOfOrigin())
        {
            var originCheck = await VerifyCertificateOfOrigin(declaration);
            result.Checks.Add(originCheck);
        }
        
        // Check 4: Export license
        if (declaration.RequiresExportLicense())
        {
            var licenseCheck = await VerifyExportLicense(declaration);
            result.Checks.Add(licenseCheck);
        }
        
        // Check 5: Value verification
        var valueCheck = await VerifyExportValue(declaration);
        result.Checks.Add(valueCheck);
        
        result.AllChecksPassed = result.Checks.All(c => c.Status == CheckStatus.Passed);
        
        return result;
    }
    
    private async Task<DocumentCheck> VerifyCommercialInvoice(
        ExportDeclaration declaration)
    {
        var check = new DocumentCheck
        {
            DocumentType = "Commercial Invoice",
            CheckType = "Documentary"
        };
        
        var invoice = declaration.CommercialInvoice;
        
        // Verify exporter matches
        if (invoice.ExporterId != declaration.ExporterId)
        {
            check.Status = CheckStatus.Failed;
            check.Findings.Add("Exporter mismatch between invoice and declaration");
            return check;
        }
        
        // Verify totals match
        var invoiceTotal = invoice.Items.Sum(i => i.TotalValue);
        var declarationTotal = declaration.Items.Sum(i => i.FobValue);
        
        if (Math.Abs(invoiceTotal - declarationTotal) > 1.00m)
        {
            check.Status = CheckStatus.Failed;
            check.Findings.Add(
                $"Value mismatch: Invoice ${invoiceTotal} vs Declaration ${declarationTotal}"
            );
            return check;
        }
        
        // Verify quantities match
        foreach (var declItem in declaration.Items)
        {
            var invoiceItem = invoice.Items.FirstOrDefault(
                i => i.HsCode == declItem.HsCode
            );
            
            if (invoiceItem == null)
            {
                check.Status = CheckStatus.Failed;
                check.Findings.Add($"HS code {declItem.HsCode} not found in invoice");
                return check;
            }
            
            if (invoiceItem.Quantity != declItem.Quantity)
            {
                check.Status = CheckStatus.Failed;
                check.Findings.Add(
                    $"Quantity mismatch for {declItem.HsCode}: " +
                    $"Invoice {invoiceItem.Quantity} vs Declaration {declItem.Quantity}"
                );
                return check;
            }
        }
        
        check.Status = CheckStatus.Passed;
        check.VerifiedBy = "SYSTEM";
        check.VerificationDate = DateTime.UtcNow;
        
        return check;
    }
}
```

---

## Phase 5: Physical Inspection (Red Channel)

### 5.1 Inspection Procedures

**Inspection Types**:
1. **Full inspection** - 100% of goods
2. **Sampling inspection** - Random sample
3. **Targeted inspection** - Specific items
4. **X-ray/Scanner** - Non-intrusive

### 5.2 Inspection Process

```typescript
interface InspectionRequest {
  declarationId: string;
  inspectionType: 'FULL' | 'SAMPLE' | 'TARGETED' | 'SCANNER';
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  scheduledDate?: Date;
}

class ExportInspectionService {
  async scheduleInspection(request: InspectionRequest): Promise<InspectionSchedule> {
    // Find available inspector
    const inspector = await this.findAvailableInspector(
      request.scheduledDate || new Date()
    );
    
    // Check warehouse availability
    const warehouse = await this.findInspectionFacility(
      request.declarationId
    );
    
    // Create inspection schedule
    const schedule: InspectionSchedule = {
      inspectionId: this.generateInspectionId(),
      declarationId: request.declarationId,
      inspectorId: inspector.id,
      inspectorName: inspector.name,
      facilityId: warehouse.id,
      facilityName: warehouse.name,
      inspectionType: request.inspectionType,
      scheduledDate: request.scheduledDate || new Date(),
      status: 'SCHEDULED'
    };
    
    // Notify exporter
    await this.notifyExporter(schedule);
    
    // Notify inspector
    await this.notifyInspector(schedule);
    
    return schedule;
  }
  
  async conductInspection(
    inspectionId: string, 
    findings: InspectionFindings
  ): Promise<InspectionResult> {
    const inspection = await this.getInspection(inspectionId);
    const declaration = await this.getDeclaration(inspection.declarationId);
    
    const result: InspectionResult = {
      inspectionId: inspectionId,
      declarationId: inspection.declarationId,
      completedDate: new Date(),
      findings: findings,
      outcome: 'PENDING'
    };
    
    // Check findings
    if (findings.discrepancies.length === 0) {
      result.outcome = 'CLEARED';
      result.remarks = 'No discrepancies found. Goods match declaration.';
    } else {
      result.outcome = 'DISCREPANCY_FOUND';
      result.remarks = this.summarizeDiscrepancies(findings.discrepancies);
      
      // Create follow-up actions
      result.followUpActions = this.createFollowUpActions(
        findings.discrepancies
      );
    }
    
    // Update declaration status
    await this.updateDeclarationStatus(
      declaration.id,
      result.outcome
    );
    
    return result;
  }
  
  private summarizeDiscrepancies(discrepancies: Discrepancy[]): string {
    const summary = discrepancies.map(d => 
      `${d.type}: ${d.description}`
    ).join('; ');
    
    return `Discrepancies found - ${summary}`;
  }
}
```

### 5.3 Common Inspection Findings

**Typical Discrepancies**:
- **Quantity mismatch**: Actual quantity differs from declared
- **Description mismatch**: Goods not as described
- **HS code error**: Incorrect classification
- **Value discrepancy**: Under/over-valuation
- **Missing documents**: Required documents not provided
- **Quality issues**: Goods damaged or substandard

---

## Phase 6: Payment Processing

### 6.1 Export Duties and Charges

**Applicable Fees**:
1. **Export duty** (if applicable)
   - Rare for most goods
   - Applied to restrict exports (logs, minerals)
   
2. **Statistical fee**
   - 0.5% of FOB value
   - Minimum: $10, Maximum: $1,000

3. **Processing fee**
   - Standard: $25
   - Expedited: $50

4. **Inspection fee** (if required)
   - Full inspection: $100
   - Scanner: $50

### 6.2 Payment Calculation

```csharp
public class ExportDutyCalculationService
{
    public async Task<TaxCalculation> CalculateExportDuties(
        ExportDeclaration declaration)
    {
        var calculation = new TaxCalculation
        {
            DeclarationId = declaration.Id,
            CalculationDate = DateTime.UtcNow
        };
        
        decimal totalFobValue = declaration.Items.Sum(i => i.FobValue);
        
        // 1. Export duty (if applicable)
        foreach (var item in declaration.Items)
        {
            var dutyRate = await GetExportDutyRate(item.HsCode);
            
            if (dutyRate > 0)
            {
                var dutyAmount = item.FobValue * (dutyRate / 100);
                
                calculation.TaxLines.Add(new TaxLine
                {
                    TaxType = "Export Duty",
                    HsCode = item.HsCode,
                    TaxableValue = item.FobValue,
                    Rate = dutyRate,
                    Amount = dutyAmount
                });
            }
        }
        
        // 2. Statistical fee (0.5% of FOB)
        var statisticalFee = totalFobValue * 0.005m;
        statisticalFee = Math.Max(10, Math.Min(statisticalFee, 1000)); // $10-$1000
        
        calculation.TaxLines.Add(new TaxLine
        {
            TaxType = "Statistical Fee",
            TaxableValue = totalFobValue,
            Rate = 0.5m,
            Amount = statisticalFee
        });
        
        // 3. Processing fee
        var processingFee = declaration.IsExpedited ? 50 : 25;
        
        calculation.TaxLines.Add(new TaxLine
        {
            TaxType = "Processing Fee",
            Amount = processingFee
        });
        
        // 4. Inspection fee (if red channel)
        if (declaration.CustomsChannel == CustomsChannel.Red)
        {
            var inspectionFee = declaration.InspectionType == "SCANNER" ? 50 : 100;
            
            calculation.TaxLines.Add(new TaxLine
            {
                TaxType = "Inspection Fee",
                Amount = inspectionFee
            });
        }
        
        // Calculate totals
        calculation.TotalAmount = calculation.TaxLines.Sum(t => t.Amount);
        calculation.Currency = "USD";
        
        return calculation;
    }
}
```

---

## Phase 7: Customs Release

### 7.1 Release Authorization

```csharp
public class ExportReleaseService
{
    public async Task<ReleaseResult> IssueExportRelease(string declarationId)
    {
        var result = new ReleaseResult();
        var declaration = await GetDeclaration(declarationId);
        
        // Verify all prerequisites
        var prerequisites = await CheckReleasePrerequisites(declaration);
        
        if (!prerequisites.AllSatisfied)
        {
            result.Status = ReleaseStatus.Rejected;
            result.Reason = "Prerequisites not satisfied";
            result.MissingItems = prerequisites.MissingItems;
            return result;
        }
        
        // Generate release authorization
        var releaseAuth = new ExportReleaseAuthorization
        {
            ReleaseNumber = GenerateReleaseNumber(declaration),
            DeclarationReference = declaration.Reference,
            ReleaseDate = DateTime.UtcNow,
            ValidUntil = DateTime.UtcNow.AddDays(30),
            AuthorizedBy = "CUSTOMS_SYSTEM",
            Restrictions = GetExportRestrictions(declaration)
        };
        
        // Update declaration status
        declaration.Status = DeclarationStatus.Released;
        declaration.ReleaseDate = DateTime.UtcNow;
        declaration.ReleaseAuthorization = releaseAuth;
        
        await SaveDeclaration(declaration);
        
        // Notify stakeholders
        await NotifyExporter(declaration);
        await NotifyFreightForwarder(declaration);
        await NotifyPortAuthority(declaration);
        
        result.Status = ReleaseStatus.Authorized;
        result.ReleaseNumber = releaseAuth.ReleaseNumber;
        result.ValidUntil = releaseAuth.ValidUntil;
        
        return result;
    }
    
    private async Task<PrerequisiteCheck> CheckReleasePrerequisites(
        ExportDeclaration declaration)
    {
        var check = new PrerequisiteCheck();
        
        // 1. Payment verified
        if (declaration.TaxAmount > 0 && !declaration.PaymentConfirmed)
        {
            check.MissingItems.Add("Payment not confirmed");
        }
        
        // 2. Documents verified
        if (declaration.CustomsChannel == CustomsChannel.Yellow &&
            !declaration.DocumentsVerified)
        {
            check.MissingItems.Add("Document verification pending");
        }
        
        // 3. Inspection completed
        if (declaration.CustomsChannel == CustomsChannel.Red &&
            !declaration.InspectionCompleted)
        {
            check.MissingItems.Add("Physical inspection pending");
        }
        
        // 4. Export license validated
        if (declaration.RequiresExportLicense() &&
            !declaration.LicenseValidated)
        {
            check.MissingItems.Add("Export license not validated");
        }
        
        check.AllSatisfied = check.MissingItems.Count == 0;
        
        return check;
    }
}
```

### 7.2 Loading Authorization

**Port Integration**:

```typescript
interface LoadingAuthorization {
  authorizationNumber: string;
  declarationReference: string;
  vessel: VesselDetails;
  containerNumbers: string[];
  loadingPort: string;
  departurePort: string;
  validFrom: Date;
  validUntil: Date;
  restrictions: string[];
}

class PortLoadingService {
  async authorizeLoading(
    declarationId: string, 
    vesselInfo: VesselDetails
  ): Promise<LoadingAuthorization> {
    const declaration = await this.getDeclaration(declarationId);
    
    // Verify customs release
    if (declaration.status !== 'RELEASED') {
      throw new Error('Declaration not released by customs');
    }
    
    // Generate loading authorization
    const authorization: LoadingAuthorization = {
      authorizationNumber: this.generateAuthNumber(),
      declarationReference: declaration.reference,
      vessel: vesselInfo,
      containerNumbers: declaration.containerNumbers,
      loadingPort: declaration.portOfLoading,
      departurePort: declaration.portOfExit,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      restrictions: this.getLoadingRestrictions(declaration)
    };
    
    // Notify port authority
    await this.notifyPortAuthority(authorization);
    
    // Create gate pass
    await this.createGatePass(authorization);
    
    return authorization;
  }
  
  async confirmLoading(
    authorizationNumber: string,
    loadingDetails: LoadingConfirmation
  ): Promise<void> {
    const auth = await this.getAuthorization(authorizationNumber);
    
    // Update declaration status
    await this.updateDeclarationStatus(
      auth.declarationReference,
      'LOADED',
      loadingDetails
    );
    
    // Notify customs of loading completion
    await this.notifyCustoms({
      declarationReference: auth.declarationReference,
      loadingDate: loadingDetails.completedDate,
      vessel: auth.vessel,
      billOfLading: loadingDetails.billOfLading
    });
  }
}
```

---

## Phase 8: Departure and Exit Processing

### 8.1 Exit Declaration

**Exit Confirmation**:

```csharp
public class ExportExitService
{
    public async Task<ExitConfirmation> ProcessExit(
        ExitDeclarationRequest request)
    {
        // Verify declaration exists
        var declaration = await _repository.GetByReference(
            request.DeclarationReference
        );
        
        if (declaration == null)
        {
            throw new DeclarationNotFoundException(
                request.DeclarationReference
            );
        }
        
        // Verify goods were loaded
        if (declaration.Status != DeclarationStatus.Loaded)
        {
            throw new InvalidOperationException(
                "Goods must be loaded before exit processing"
            );
        }
        
        // Create exit record
        var exitRecord = new ExportExitRecord
        {
            DeclarationReference = declaration.Reference,
            ExitDate = request.ExitDate,
            ExitPoint = request.ExitPoint,
            MeansOfTransport = request.TransportDetails,
            BillOfLading = request.BillOfLading,
            Seals = request.SealNumbers,
            ExitOfficer = request.OfficerId
        };
        
        // Validate exit within validity period
        if (exitRecord.ExitDate > declaration.ReleaseValidUntil)
        {
            throw new ValidationException(
                "Exit after release validity period"
            );
        }
        
        // Update declaration status
        declaration.Status = DeclarationStatus.Exited;
        declaration.ExitDate = exitRecord.ExitDate;
        declaration.ExitRecord = exitRecord;
        
        await _repository.SaveAsync(declaration);
        
        // Generate statistics
        await _statisticsService.RecordExport(declaration);
        
        // Notify exporter
        await _notificationService.NotifyExportCompleted(declaration);
        
        return new ExitConfirmation
        {
            ExitNumber = exitRecord.ExitNumber,
            DeclarationReference = declaration.Reference,
            ExitDate = exitRecord.ExitDate,
            Status = "COMPLETED"
        };
    }
}
```

### 8.2 Export Statistics

**Statistical Reporting**:

```csharp
public class ExportStatisticsService
{
    public async Task RecordExport(ExportDeclaration declaration)
    {
        foreach (var item in declaration.Items)
        {
            var record = new ExportStatisticsRecord
            {
                ExportDate = declaration.ExitDate.Value,
                ExportMonth = declaration.ExitDate.Value.Month,
                ExportYear = declaration.ExitDate.Value.Year,
                
                HsCode = item.HsCode,
                CommodityDescription = item.Description,
                
                CountryOfOrigin = item.CountryOfOrigin,
                DestinationCountry = declaration.DestinationCountry,
                
                Quantity = item.Quantity,
                UnitOfMeasure = item.UnitOfMeasure,
                NetMass = item.NetMass,
                GrossMass = item.GrossMass,
                
                FobValue = item.FobValue,
                StatisticalValue = item.StatisticalValue,
                
                ModeOfTransport = declaration.ModeOfTransport,
                PortOfExit = declaration.PortOfExit,
                
                ExporterId = declaration.ExporterId,
                ExporterName = declaration.ExporterName
            };
            
            await _statisticsRepository.AddAsync(record);
        }
        
        await _statisticsRepository.SaveChangesAsync();
    }
    
    public async Task<ExportStatisticsReport> GenerateMonthlyReport(
        int year, 
        int month)
    {
        var data = await _statisticsRepository.GetMonthlyExports(year, month);
        
        var report = new ExportStatisticsReport
        {
            Period = $"{year}-{month:D2}",
            TotalExports = data.Count,
            TotalValue = data.Sum(d => d.FobValue),
            
            ByCountry = data.GroupBy(d => d.DestinationCountry)
                .Select(g => new CountryExportSummary
                {
                    Country = g.Key,
                    ExportCount = g.Count(),
                    TotalValue = g.Sum(d => d.FobValue)
                })
                .OrderByDescending(s => s.TotalValue)
                .ToList(),
                
            ByCommodity = data.GroupBy(d => d.HsCode.Substring(0, 2))
                .Select(g => new CommodityExportSummary
                {
                    HsChapter = g.Key,
                    ExportCount = g.Count(),
                    TotalValue = g.Sum(d => d.FobValue)
                })
                .OrderByDescending(s => s.TotalValue)
                .ToList(),
                
            ByPort = data.GroupBy(d => d.PortOfExit)
                .Select(g => new PortExportSummary
                {
                    Port = g.Key,
                    ExportCount = g.Count(),
                    TotalValue = g.Sum(d => d.FobValue)
                })
                .ToList()
        };
        
        return report;
    }
}
```

---

## Phase 9: Post-Export Procedures

### 9.1 Export Incentives and Drawback

**Duty Drawback**:
- Refund of import duties paid on goods that are later exported
- Must claim within 12 months of export
- Requires proof of export and original import documents

```csharp
public class ExportDrawbackService
{
    public async Task<DrawbackClaim> CreateDrawbackClaim(
        DrawbackClaimRequest request)
    {
        // Verify export declaration exists
        var exportDecl = await _repository.GetExportDeclaration(
            request.ExportDeclarationReference
        );
        
        if (exportDecl == null || exportDecl.Status != DeclarationStatus.Exited)
        {
            throw new ValidationException("Invalid export declaration");
        }
        
        // Verify import declarations
        var importDecls = new List<ImportDeclaration>();
        
        foreach (var importRef in request.ImportDeclarationReferences)
        {
            var importDecl = await _repository.GetImportDeclaration(importRef);
            
            if (importDecl == null)
            {
                throw new ValidationException($"Import declaration {importRef} not found");
            }
            
            // Verify within time limit (12 months)
            var monthsDiff = (exportDecl.ExitDate.Value - importDecl.ClearanceDate).TotalDays / 30;
            
            if (monthsDiff > 12)
            {
                throw new ValidationException(
                    $"Import {importRef} exceeds 12-month limit"
                );
            }
            
            importDecls.Add(importDecl);
        }
        
        // Calculate claimable amount
        var claimableAmount = CalculateDrawbackAmount(importDecls, exportDecl);
        
        // Create claim
        var claim = new DrawbackClaim
        {
            ClaimNumber = GenerateClaimNumber(),
            ExportDeclarationReference = request.ExportDeclarationReference,
            ImportDeclarationReferences = request.ImportDeclarationReferences,
            ClaimDate = DateTime.UtcNow,
            ClaimAmount = claimableAmount,
            Status = DrawbackStatus.Submitted,
            Claimant = request.ClaimantDetails
        };
        
        await _repository.SaveDrawbackClaim(claim);
        
        return claim;
    }
}
```

### 9.2 Post-Clearance Audit

**Audit Triggers**:
- Random selection
- Risk indicators
- Value discrepancies
- Pattern analysis

```typescript
class PostExportAuditService {
  async selectForAudit(criteria: AuditSelectionCriteria): Promise<string[]> {
    const declarations = await this.getExportDeclarations(criteria);
    const selected: string[] = [];
    
    for (const declaration of declarations) {
      const auditScore = await this.calculateAuditScore(declaration);
      
      if (auditScore >= criteria.threshold) {
        selected.push(declaration.reference);
      }
    }
    
    // Add random selection (5% of declarations)
    const randomCount = Math.floor(declarations.length * 0.05);
    const randomSelected = this.selectRandom(
      declarations.filter(d => !selected.includes(d.reference)),
      randomCount
    );
    
    selected.push(...randomSelected.map(d => d.reference));
    
    return selected;
  }
  
  async conductAudit(declarationRef: string): Promise<AuditResult> {
    const declaration = await this.getDeclaration(declarationRef);
    const audit = new AuditResult();
    
    // Verify documentation
    audit.documentReview = await this.reviewDocumentation(declaration);
    
    // Value verification
    audit.valueVerification = await this.verifyExportValue(declaration);
    
    // Classification check
    audit.classificationCheck = await this.verifyHsClassification(declaration);
    
    // Origin verification
    audit.originVerification = await this.verifyOrigin(declaration);
    
    // Determine outcome
    if (audit.hasFindings()) {
      audit.outcome = 'NON_COMPLIANT';
      audit.penalties = this.calculatePenalties(audit.findings);
    } else {
      audit.outcome = 'COMPLIANT';
    }
    
    return audit;
  }
}
```

---

## Special Export Scenarios

### 10.1 Re-Export

**Definition**: Export of goods previously imported without substantial processing.

**Requirements**:
- Original import declaration reference
- Proof of import duty payment (if any)
- Drawback claim (if applicable)
- Certificate that goods are unchanged

```csharp
public async Task<ReExportDeclaration> CreateReExportDeclaration(
    ReExportRequest request)
{
    // Verify original import
    var originalImport = await _repository.GetImportDeclaration(
        request.OriginalImportReference
    );
    
    if (originalImport == null)
    {
        throw new ValidationException("Original import declaration not found");
    }
    
    // Create re-export declaration
    var reExportDecl = new ReExportDeclaration
    {
        Reference = GenerateReExportReference(),
        OriginalImportReference = request.OriginalImportReference,
        ImportDate = originalImport.ClearanceDate,
        ExporterId = request.ExporterId,
        DestinationCountry = request.DestinationCountry,
        Items = MapFromImportItems(originalImport.Items),
        IsDrawbackClaim = request.ClaimDrawback
    };
    
    // Set procedure code
    reExportDecl.ProcedureCode = "11"; // Re-export code
    
    // If drawback claimed, create claim automatically
    if (request.ClaimDrawback && originalImport.DutiesPaid > 0)
    {
        var drawbackClaim = await CreateDrawbackClaim(
            reExportDecl.Reference,
            originalImport.Reference
        );
        
        reExportDecl.DrawbackClaimReference = drawbackClaim.ClaimNumber;
    }
    
    return reExportDecl;
}
```

### 10.2 Temporary Export

**Use Cases**:
- Goods for repair abroad
- Exhibition goods
- Professional equipment
- Samples

**ATA Carnet**:
- International customs document
- Allows temporary export/import without duties
- Valid for 12 months
- Guaranteed by issuing chamber

```typescript
interface TemporaryExportDeclaration {
  declarationType: 'TE'; // Temporary Export
  procedureCode: '23';
  purposeOfExport: 'REPAIR' | 'EXHIBITION' | 'PROFESSIONAL_USE' | 'SAMPLES';
  expectedReturnDate: Date;
  guarantee: GuaranteeDetails;
  ataCarnetNumber?: string;
}

class TemporaryExportService {
  async processTemporaryExport(
    request: TemporaryExportDeclaration
  ): Promise<DeclarationResult> {
    // Verify guarantee or ATA Carnet
    if (!request.ataCarnetNumber) {
      // Require customs guarantee
      const guaranteeAmount = this.calculateGuaranteeAmount(request);
      
      const guarantee = await this.createGuarantee({
        declarationReference: request.reference,
        amount: guaranteeAmount,
        validUntil: request.expectedReturnDate
      });
      
      request.guarantee = guarantee;
    }
    
    // Set return obligation
    const returnObligation: ReturnObligation = {
      mustReturnBy: request.expectedReturnDate,
      penaltyForNonReturn: 'GUARANTEE_FORFEITURE',
      extensionAllowed: true,
      maxExtension: 6 // months
    };
    
    // Process declaration
    const result = await this.submitExportDeclaration(request);
    result.returnObligation = returnObligation;
    
    return result;
  }
}
```

---

## Integration Points

### API Endpoints

**Export Declaration Submission**:

```http
POST /api/v1/export/declarations
Content-Type: application/json
Authorization: Bearer {token}

{
  "exporterId": "EXP123456",
  "destinationCountry": "BR",
  "incoterm": "FOB",
  "modeOfTransport": 1,
  "items": [
    {
      "hsCode": "090111",
      "description": "Coffee, not roasted, not decaffeinated",
      "quantity": 20000,
      "unitOfMeasure": "KGM",
      "fobValue": 50000.00,
      "countryOfOrigin": "AO"
    }
  ]
}
```

**Response**:

```json
{
  "status": "ACCEPTED",
  "declarationReference": "EX-2026-00012345",
  "submissionDate": "2026-01-01T10:30:00Z",
  "riskChannel": "GREEN",
  "taxAmount": 275.00,
  "paymentReference": "PAY-2026-00012345",
  "estimatedReleaseDate": "2026-01-02T10:00:00Z"
}
```

---

## Best Practices

### For Exporters

1. **Prepare Documentation Early**
   - Obtain all certificates before declaration
   - Verify HS classification accuracy
   - Ensure invoice values are correct

2. **Maintain AEO Status**
   - Benefits: Green channel, reduced inspections
   - Requirements: Compliance history, internal controls

3. **Use Electronic Systems**
   - Submit declarations electronically
   - Track status real-time
   - Receive notifications instantly

4. **Keep Records**
   - Maintain export records for 5 years
   - Document includes: declarations, invoices, shipping docs
   - Required for audits and drawback claims

### For Customs Brokers

1. **Verify Client Information**
   - Exporter registration valid
   - Required licenses in place
   - POA (Power of Attorney) on file

2. **Quality Control**
   - Double-check HS codes
   - Verify calculations
   - Ensure document consistency

3. **Communication**
   - Keep exporter informed of status
   - Respond promptly to customs queries
   - Notify of any issues immediately

---

## Common Issues and Solutions

### Issue 1: Export License Rejected

**Symptoms**:
- Declaration rejected
- Error: "Export license required"

**Solution**:
```
1. Check if commodity requires export license
2. Apply to Ministry of Commerce for license
3. Submit license reference in declaration
4. Resubmit declaration
```

### Issue 2: Value Discrepancy

**Symptoms**:
- Yellow/Red channel
- Query from customs valuation

**Solution**:
```
1. Provide supporting documentation:
   - Purchase orders
   - Price lists
   - Market research
   - Comparable exports
2. Explain pricing rationale
3. Accept adjusted value if warranted
```

### Issue 3: HS Classification Dispute

**Symptoms**:
- Customs suggests different HS code
- Different duty rate applied

**Solution**:
```
1. Review General Rules for Interpretation (GRI)
2. Consult Harmonized System Explanatory Notes
3. Provide product specifications
4. Request Binding Tariff Information (BTI)
5. Lodge appeal if necessary
```

---

## Summary

Export clearance involves:
1. ✅ Pre-export preparation and registration
2. ✅ Declaration submission with complete documentation
3. ✅ Risk assessment and channel assignment
4. ✅ Document verification and/or physical inspection
5. ✅ Payment of applicable duties and fees
6. ✅ Customs release and loading authorization
7. ✅ Exit processing and departure confirmation
8. ✅ Post-export procedures (statistics, audits, drawback)

**Average Processing Times**:
- Green Channel: 1-2 hours
- Yellow Channel: 4-8 hours
- Red Channel: 1-3 days

**Success Factors**:
- Accurate declaration
- Complete documentation
- Correct valuation
- Proper classification
- Timely submission

---

## Related Documents

- [Import Clearance Process](./import-clearance.md)
- [Transit Operations](./transit-operations.md)
- [Customs Warehousing](./customs-warehousing.md)
- [WCO Data Model](../standards/wco-data-model.md)
- [HS Classification Guide](../standards/hs-classification.md)
