# Temporary Admission

**Complete Guide to Temporary Import Procedures**

---

## Overview

Temporary admission allows foreign goods to enter Angola temporarily without payment of import duties, provided they are re-exported within a specified period. This facilitates business activities, cultural exchanges, and professional operations.

### Key Principles
- Goods must be re-exported in the same state
- Security/guarantee required
- Time-limited authorization
- Specific purposes only

---

## Eligible Goods and Purposes

### 1. Professional Equipment
- Scientific instruments
- Broadcasting equipment
- Photography/filming equipment
- Medical equipment for temporary use
- Construction machinery

### 2. Commercial Samples
- Product samples for exhibitions
- Demonstration models
- Samples for quality testing

### 3. Exhibition and Fair Goods
- Goods for trade fairs
- Exhibition displays
- Convention materials

### 4. Vehicles and Transport Equipment
- Temporary import of vehicles
- Containers
- Pallets and packaging

### 5. Goods for Repair
- Equipment sent for repair
- Goods under warranty

---

## Temporary Admission Procedures

### Procedure Codes
- **53**: Temporary admission
- **54**: Active processing - temporary admission
- **55**: Inward processing

### Time Limits
- **Standard**: 12 months
- **Professional equipment**: 24 months
- **Vehicles**: 6 months
- **Extension possible**: Up to maximum period

```typescript
interface TemporaryAdmissionDeclaration {
  procedure Code: '53' | '54' | '55';
  purpose: 'PROFESSIONAL' | 'EXHIBITION' | 'REPAIR' | 'SAMPLES' | 'TESTING';
  
  goods: {
    description: string;
    hsCode: string;
    value: number;
    serialNumbers?: string[];
  }[];
  
  temporaryPeriod: {
    admissionDate: Date;
    reExportBy: Date;
    requestedMonths: number;
  };
  
  guarantee: {
    type: 'CASH' | 'BANK_GUARANTEE' | 'ATA_CARNET';
    amount: number;
    reference: string;
  };
  
  reExportCommitment: {
    committedBy: string;
    signature: string;
    date: Date;
  };
}
```

### Processing Flow

```
Application → Document Review → Guarantee Assessment
     ↓              ↓                    ↓
Approval → Goods Arrival → Physical Verification
     ↓              ↓                    ↓
Release with Conditions → Monitoring → Re-export Processing
```

---

## ATA Carnet System

### What is ATA Carnet?

**ATA** = Admission Temporaire/Temporary Admission

International customs document that:
- Serves as temporary import declaration
- Provides customs guarantee
- Valid in 80+ countries
- Single document for multiple countries

### ATA Carnet Benefits
- ✅ No customs bonds required
- ✅ Simplified procedures
- ✅ Quick clearance
- ✅ Cost-effective for multiple trips

### Using ATA Carnet

```csharp
public class AtaCarnetService
{
    public async Task<CarnetValidation> ValidateAtaCarnet(
        string carnetNumber,
        string countryCode)
    {
        var validation = new CarnetValidation();
        
        // Connect to ICC World Chambers Federation system
        var carnet = await _iccService.GetCarnet(carnetNumber);
        
        if (carnet == null)
        {
            validation.IsValid = false;
            validation.Errors.Add("Carnet not found in ICC database");
            return validation;
        }
        
        // Check validity period
        if (DateTime.UtcNow < carnet.IssueDate || 
            DateTime.UtcNow > carnet.ExpiryDate)
        {
            validation.IsValid = false;
            validation.Errors.Add("Carnet expired or not yet valid");
            return validation;
        }
        
        // Check if Angola is covered
        if (!carnet.CoveredCountries.Contains(countryCode))
        {
            validation.IsValid = false;
            validation.Errors.Add("Carnet does not cover Angola");
            return validation;
        }
        
        // Check available vouchers
        if (carnet.UsedVouchers >= carnet.TotalVouchers)
        {
            validation.IsValid = false;
            validation.Errors.Add("No available vouchers");
            return validation;
        }
        
        // Verify guarantee is valid
        var guaranteeValid = await _iccService.CheckGuarantee(carnetNumber);
        
        if (!guaranteeValid)
        {
            validation.IsValid = false;
            validation.Errors.Add("Carnet guarantee invalid");
            return validation;
        }
        
        validation.IsValid = true;
        validation.CarnetDetails = carnet;
        validation.GuaranteeAmount = carnet.GuaranteeAmount;
        
        return validation;
    }
}
```

---

## Guarantee Calculation

### Standard Guarantee Formula

```
Guarantee = (Customs Value + Import Duties + Import VAT) × 110%
```

**Example Calculation**:
```
Customs Value:     $10,000
Import Duty (10%):  $1,000
Import VAT (14%):   $1,540 (on $11,000)
Total:             $12,540
Guarantee (110%):  $13,794
```

### Reduced Guarantee Rates

**Authorized Economic Operators (AEO)**:
- Certified AEO: 50% reduction
- Trusted trader: 30% reduction

**Professional Equipment**:
- Journalists: 50% reduction
- Scientific research: 70% reduction
- Medical missions: 90% reduction

```csharp
public decimal CalculateTemporaryAdmissionGuarantee(
    TemporaryAdmissionRequest request)
{
    // Calculate standard import charges
    var customsValue = request.Goods.Sum(g => g.Value);
    var importDuty = customsValue * 0.10m; // Assume 10% duty
    var importVAT = (customsValue + importDuty) * 0.14m; // 14% VAT
    var totalCharges = customsValue + importDuty + importVAT;
    
    // Apply 110% factor
    var guarantee = totalCharges * 1.10m;
    
    // Apply reductions if applicable
    if (request.IsAeoOperator)
    {
        guarantee *= 0.50m; // 50% reduction for AEO
    }
    else if (request.Purpose == "SCIENTIFIC_RESEARCH")
    {
        guarantee *= 0.30m; // 70% reduction
    }
    else if (request.Purpose == "MEDICAL_MISSION")
    {
        guarantee *= 0.10m; // 90% reduction
    }
    
    return Math.Round(guarantee, 2);
}
```

---

## Monitoring and Compliance

### Periodic Reporting

```typescript
interface TemporaryAdmissionMonitoring {
  admissionNumber: string;
  checkDate: Date;
  goodsLocation: string;
  goodsCondition: 'INTACT' | 'IN_USE' | 'DAMAGED' | 'MISSING';
  serialNumbersVerified: boolean;
  reExportPlan: {
    estimatedDate: Date;
    transportMethod: string;
    destination: string;
  };
}

class TemporaryAdmissionComplianceService {
  async conductPeriodicCheck(admissionNumber: string): Promise<ComplianceResult> {
    const admission = await this.getTemporaryAdmission(admissionNumber);
    
    // Check if still within authorized period
    if (new Date() > admission.reExportBy) {
      return {
        isCompliant: false,
        violation: 'TIME_LIMIT_EXCEEDED',
        action: 'DUTY_PAYMENT_REQUIRED'
      };
    }
    
    // Verify goods location
    const locationCheck = await this.verifyLocation(admission);
    if (!locationCheck.isAtDeclaredLocation) {
      return {
        isCompliant: false,
        violation: 'UNAUTHORIZED_LOCATION',
        action: 'INVESTIGATION_REQUIRED'
      };
    }
    
    // For serial-numbered goods, verify identity
    if (admission.hasSerialNumbers) {
      const serialCheck = await this.verifySerialNumbers(admission);
      if (!serialCheck.allMatched) {
        return {
          isCompliant: false,
          violation: 'GOODS_SUBSTITUTION',
          action: 'IMMEDIATE_INSPECTION'
        };
      }
    }
    
    return {
      isCompliant: true,
      nextCheckDue: this.calculateNextCheckDate(admission)
    };
  }
}
```

---

## Re-Export Procedures

### Standard Re-Export

```csharp
public class TemporaryAdmissionReExportService
{
    public async Task<ReExportResult> ProcessReExport(
        string admissionNumber,
        ReExportRequest request)
    {
        var admission = await GetTemporaryAdmission(admissionNumber);
        
        if (admission == null)
        {
            throw new NotFoundException("Temporary admission not found");
        }
        
        // Verify within time limit
        if (DateTime.UtcNow > admission.ReExportBy)
        {
            return new ReExportResult
            {
                Status = ReExportStatus.TimeLimitExceeded,
                RequiredAction = "Import duties must be paid before re-export"
            };
        }
        
        // Verify goods identity
        var goodsCheck = await VerifyGoodsIdentity(
            admission.Goods,
            request.GoodsBeingReExported
        );
        
        if (!goodsCheck.AllMatch)
        {
            return new ReExportResult
            {
                Status = ReExportStatus.GoodsMismatch,
                Discrepancies = goodsCheck.Discrepancies,
                RequiredAction = "Physical inspection required"
            };
        }
        
        // Create re-export declaration
        var reExportDecl = new ExportDeclaration
        {
            Reference = GenerateReExportReference(admissionNumber),
            ProcedureCode = "31", // Re-export after temporary admission
            OriginalAdmissionNumber = admissionNumber,
            Items = MapToExportItems(admission.Goods),
            DestinationCountry = admission.OriginCountry
        };
        
        await SubmitReExportDeclaration(reExportDecl);
        
        // Release guarantee
        await ReleaseGuarantee(admission.GuaranteeReference);
        
        // Close temporary admission
        admission.Status = TemporaryAdmissionStatus.Completed;
        admission.ActualReExportDate = DateTime.UtcNow;
        await SaveTemporaryAdmission(admission);
        
        return new ReExportResult
        {
            Status = ReExportStatus.Approved,
            ReExportReference = reExportDecl.Reference,
            GuaranteeReleased = true
        };
    }
}
```

### Partial Re-Export

**Scenario**: Only part of temporarily admitted goods are re-exported.

```typescript
async processPartialReExport(
  admissionNumber: string,
  itemsToReExport: string[]
): Promise<PartialReExportResult> {
  const admission = await this.getTemporaryAdmission(admissionNumber);
  
  // Calculate remaining goods
  const remainingItems = admission.goods.filter(
    g => !itemsToReExport.includes(g.id)
  );
  
  // Create re-export for selected items
  const reExport = await this.createReExportDeclaration(
    admission,
    admission.goods.filter(g => itemsToReExport.includes(g.id))
  );
  
  // Calculate new guarantee for remaining goods
  const newGuarantee = this.calculateGuarantee(remainingItems);
  
  // Adjust admission record
  admission.goods = remainingItems;
  admission.guaranteeAmount = newGuarantee;
  await this.updateTemporaryAdmission(admission);
  
  return {
    reExportReference: reExport.reference,
    remainingGoods: remainingItems,
    adjustedGuarantee: newGuarantee
  };
}
```

---

## Extension Requests

### Extending Temporary Admission Period

```csharp
public async Task<ExtensionResult> RequestExtension(
    string admissionNumber,
    ExtensionRequest request)
{
    var admission = await GetTemporaryAdmission(admissionNumber);
    
    // Check if extension is allowed
    var maxPeriod = GetMaximumPeriod(admission.Purpose);
    var currentPeriod = (admission.ReExportBy - admission.AdmissionDate).Days / 30;
    var requestedTotal = currentPeriod + request.AdditionalMonths;
    
    if (requestedTotal > maxPeriod)
    {
        return new ExtensionResult
        {
            Approved = false,
            Reason = $"Maximum period is {maxPeriod} months"
        };
    }
    
    // Verify extension reason is valid
    if (!IsValidExtensionReason(request.Reason, admission.Purpose))
    {
        return new ExtensionResult
        {
            Approved = false,
            Reason = "Extension reason not valid for this purpose"
        };
    }
    
    // Check compliance history
    var compliance = await CheckComplianceHistory(admissionNumber);
    if (!compliance.IsCompliant)
    {
        return new ExtensionResult
        {
            Approved = false,
            Reason = "Compliance violations detected"
        };
    }
    
    // Approve extension
    var newReExportDate = admission.ReExportBy.AddMonths(request.AdditionalMonths);
    admission.ReExportBy = newReExportDate;
    admission.ExtensionHistory.Add(new Extension
    {
        RequestDate = DateTime.UtcNow,
        ApprovedMonths = request.AdditionalMonths,
        Reason = request.Reason,
        NewDeadline = newReExportDate
    });
    
    await SaveTemporaryAdmission(admission);
    
    return new ExtensionResult
    {
        Approved = true,
        NewReExportDate = newReExportDate,
        ExtensionMonths = request.AdditionalMonths
    };
}
```

---

## Conversion to Regular Import

### When Extension Not Granted

If goods cannot be re-exported and extension is not possible, they must be regularized as normal imports.

```typescript
async convertToRegularImport(
  admissionNumber: string
): Promise<ConversionResult> {
  const admission = await this.getTemporaryAdmission(admissionNumber);
  
  // Calculate import duties retroactive to admission date
  const duties = await this.calculateImportDuties(admission.goods);
  
  // Calculate interest on delayed payment
  const daysSinceAdmission = Math.floor(
    (new Date().getTime() - admission.admissionDate.getTime()) / 
    (1000 * 60 * 60 * 24)
  );
  const interestRate = 0.05; // 5% annual
  const interest = duties.totalAmount * (interestRate / 365) * daysSinceAdmission;
  
  // Add administrative penalty
  const penalty = duties.totalAmount * 0.10; // 10% penalty
  
  // Create import declaration
  const importDeclaration = await this.createImportDeclaration({
    originalAdmissionNumber: admissionNumber,
    goods: admission.goods,
    declarationType: 'REGULARIZATION',
    customsValue: admission.goods.reduce((sum, g) => sum + g.value, 0)
  });
  
  // Use guarantee to offset payment
  const guaranteeOffset = Math.min(
    admission.guaranteeAmount,
    duties.totalAmount + interest + penalty
  );
  
  const totalDue = duties.totalAmount + interest + penalty - guaranteeOffset;
  
  return {
    importDeclarationReference: importDeclaration.reference,
    duties: duties.totalAmount,
    interest: interest,
    penalty: penalty,
    guaranteeApplied: guaranteeOffset,
    balanceDue: totalDue
  };
}
```

---

## Violations and Penalties

### Common Violations

1. **Time Limit Exceeded**
   - Penalty: Import duties + interest + 10% fine
   - Guarantee forfeiture

2. **Goods Not Re-Exported**
   - Penalty: Full import duties + 25% penalty
   - Criminal liability possible

3. **Unauthorized Use**
   - Commercial use of professional equipment
   - Penalty: Regularization + 50% fine

4. **Goods Substitution**
   - Different goods re-exported
   - Penalty: Duties on both sets + criminal charges

5. **Incomplete Re-Export**
   - Only part of goods re-exported
   - Penalty: Duties on remaining goods

---

## Special Cases

### Temporary Admission for Repairs

**Inward Processing Relief (IPR)**:

```csharp
public async Task<RepairAdmissionResult> ProcessRepairAdmission(
    RepairAdmissionRequest request)
{
    // For goods imported for repair, duties only on repair value
    var repairCosts = request.EstimatedRepairCost;
    var importDuty = repairCosts * 0.10m; // 10% on repair value only
    
    var admission = new TemporaryAdmissionRecord
    {
        Purpose = "REPAIR",
        OriginalGoodsValue = request.GoodsValue,
        TaxableValue = repairCosts, // Only repair cost is dutiable
        EstimatedCompletionDate = request.EstimatedCompletionDate,
        RepairFacility = request.RepairFacilityDetails
    };
    
    // Reduced guarantee (only on repair value)
    admission.GuaranteeAmount = (repairCosts + importDuty) * 1.10m;
    
    return new RepairAdmissionResult
    {
        AdmissionNumber = admission.AdmissionNumber,
        GuaranteeRequired = admission.GuaranteeAmount,
        TimeLimit = admission.EstimatedCompletionDate.AddDays(30)
    };
}
```

---

## Best Practices

### For Temporary Admission Holders

1. **Documentation**
   - Keep all admission documents accessible
   - Maintain inventory of items
   - Document any changes/damage

2. **Compliance**
   - Track expiry dates
   - Request extensions early
   - Report issues immediately

3. **Re-Export Planning**
   - Plan re-export well in advance
   - Arrange transport early
   - Have contingency plans

### For Customs Officers

1. **Verification**
   - Record serial numbers/identifiers
   - Take photos of unique items
   - Verify guarantee coverage

2. **Monitoring**
   - Conduct periodic checks
   - Verify goods location
   - Track time limits

3. **Facilitation**
   - Process ATA Carnets quickly
   - Allow reasonable extensions
   - Assist legitimate users

---

## Summary

Temporary admission enables:
- ✅ Business operations without duty payment
- ✅ Cultural and sporting events
- ✅ Professional activities
- ✅ International cooperation
- ✅ Trade promotion

**Key Requirements**:
- Valid purpose
- Appropriate guarantee
- Re-export commitment
- Compliance monitoring
- Timely re-export or regularization

---

## Related Documents

- [Import Clearance](./import-clearance.md)
- [Export Clearance](./export-clearance.md)
- [Simplified Procedures](./simplified-procedures.md)
- [Customs Warehousing](./customs-warehousing.md)
