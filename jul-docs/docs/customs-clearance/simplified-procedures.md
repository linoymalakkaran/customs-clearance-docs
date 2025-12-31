# Simplified Procedures

**Guide to AEO Programs and Simplified Customs Clearance**

---

## Overview

Simplified procedures allow pre-authorized traders to clear goods with reduced formalities, accelerated processing, and lower guarantee requirements. These procedures are primarily available to Authorized Economic Operators (AEO).

### Benefits
- Faster clearance (Green channel priority)
- Reduced physical inspections
- Lower guarantee requirements (50-70% reduction)
- Simplified declarations
- Deferred payment options
- Priority treatment

---

## Authorized Economic Operator (AEO)

### AEO Certification Levels

**1. AEO-Customs (AEO-C)**
- Simplified customs procedures
- Reduced inspections
- Priority treatment

**2. AEO-Security (AEO-S)**
- Security and safety facilitation
- Reduced security checks
- International recognition

**3. AEO-Full (AEO-F)**
- Combined benefits of AEO-C and AEO-S
- Maximum facilitation
- Mutual recognition agreements

### AEO Requirements

```typescript
interface AeoApplication {
  applicant: {
    businessName: string;
    nif: string;
    yearsInBusiness: number;
    annualTurnover: number;
  };
  
  complianceHistory: {
    customsViolations: number;
    taxCompliance: boolean;
    pendingCases: string[];
  };
  
  recordKeeping: {
    hasElectronicSystem: boolean;
    dataRetentionYears: number;
    auditTrailAvailable: boolean;
  };
  
  financialSolvency: {
    creditRating: string;
    bankruptcyHistory: boolean;
    taxArrears: number;
  };
  
  securityStandards: {
    physicalSecurity: SecurityMeasures;
    personnelSecurity: PersonnelChecks;
    informationSecurity: ITSecurity;
    cargoSecurity: CargoMeasures;
  };
}
```

---

## Simplified Declaration Procedures

### Immediate Release (WCO Guidelines)

For low-value shipments and express consignments, immediate release procedures apply:

**Thresholds**:
- **De Minimis Value**: Shipments up to $200 USD
- **Low-Value Goods**: Shipments $200-$1,000 USD
- **Express Consignments**: Commercial documents, time-sensitive goods

**Procedure**:
1. Simplified declaration with minimal data elements
2. Risk-based selectivity (95%+ automatic clearance)
3. Release within 6 hours of arrival
4. Post-clearance audit for compliance verification

```csharp
public async Task<ImmediateReleaseResult> ProcessImmediateRelease(
    ExpressConsignment consignment)
{
    // Check value threshold
    if (consignment.Value <= 200)
    {
        // De minimis - duty free, minimal data
        return await GrantImmediateRelease(
            consignment,
            requiresFullDeclaration: false,
            dutyExempt: true
        );
    }
    else if (consignment.Value <= 1000)
    {
    // Low value - simplified declaration
        return await GrantImmediateRelease(
            consignment,
            requiresFullDeclaration: false,
            dutyExempt: false
        );
    }
    
    // Standard processing required
    return await ProcessStandardDeclaration(consignment);
}
```

### Pre-Declaration System

Goods can be released before full declaration submitted:

```csharp
public async Task<PreDeclarationResult> SubmitPreDeclaration(
    PreDeclarationRequest request)
{
    // Verify AEO status
    var aeoStatus = await _aeoService.GetAeoStatus(request.DeclarantId);
    
    if (aeoStatus != AeoStatus.Certified)
    {
        throw new UnauthorizedException("AEO certification required");
    }
    
    // Minimal data required for pre-declaration
    var preDecl = new PreDeclaration
    {
        Reference = GeneratePreDeclReference(),
        DeclarantId = request.DeclarantId,
        ArrivalReference = request.ManifestNumber,
        EstimatedValue = request.EstimatedValue,
        GoodsDescription = request.BriefDescription
    };
    
    // Immediate release authorization
    var release = new ReleaseAuthorization
    {
        ReleaseNumber = GenerateReleaseNumber(),
        PreDeclarationRef = preDecl.Reference,
        ValidUntil = DateTime.UtcNow.AddDays(5), // Must complete in 5 days
        Conditions = new[]
        {
            "Full declaration must be submitted within 5 days",
            "Goods subject to post-clearance audit"
        }
    };
    
    return new PreDeclarationResult
    {
        PreDeclarationRef = preDecl.Reference,
        ReleaseAuthorization = release,
        FullDeclarationDeadline = release.ValidUntil
    };
}
```

---

## Centralized Clearance

AEO operators can clear goods at a single customs office regardless of entry point:

```typescript
async processCentralizedClearance(
  declaration: ImportDeclaration
): Promise<ClearanceResult> {
  // Verify centralized clearance authorization
  const auth = await this.getCentralizedAuth(declaration.declarantId);
  
  if (!auth.isAuthorized) {
    throw new Error('Not authorized for centralized clearance');
  }
  
  // Clear at designated office
  const clearance = await this.customsOfficeService.processAtOffice(
    auth.designatedOffice,
    declaration  );
  
  // Notify actual entry point for physical release
  await this.notifyEntryPoint(
    declaration.actualEntryPoint,
    clearance
  );
  
  return clearance;
}
```

---

## Deferred Payment

### Payment Deferral Authorization

AEO operators can defer duty payments, improving cash flow:

**Eligibility**:
- AEO-C or AEO-F certification required
- Good compliance record (no arrears)
- Financial guarantee provided
- Minimum annual customs activity threshold

**Benefits**:
- Release goods immediately without payment
- Consolidate multiple declarations
- Monthly payment cycle
- Improved working capital

```csharp
public async Task<DeferredPaymentResult> ProcessDeferredPayment(
    ImportDeclaration declaration)
{
    // Verify deferred payment authorization
    var auth = await _deferredPaymentService.GetAuthorization(
        declaration.ImporterId
    );
    
    if (!auth.IsAuthorized)
    {
        throw new UnauthorizedException(
            "Deferred payment not authorized for this operator"
        );
    }
    
    // Check guarantee limit
    var currentDebt = await GetCurrentDeferredDebt(declaration.ImporterId);
    var newAmount = declaration.TotalDutiesAndTaxes;
    
    if (currentDebt + newAmount > auth.GuaranteeAmount)
    {
        throw new ValidationException(
            $"Guarantee limit exceeded. Current: {currentDebt:C}, " +
            $"New: {newAmount:C}, Limit: {auth.GuaranteeAmount:C}"
        );
    }
    
    // Record deferred payment
    var deferral = new DeferredPayment
    {
        DeclarationRef = declaration.Reference,
        ImporterId = declaration.ImporterId,
        Amount = newAmount,
        DeferredDate = DateTime.UtcNow,
        DueDate = GetNextPaymentCycleDate(auth.PaymentCycle),
        GuaranteeRef = auth.GuaranteeReference,
        Status = PaymentStatus.Deferred
    };
    
    await SaveDeferredPayment(deferral);
    
    // Grant immediate release
    return new DeferredPaymentResult
    {
        Success = true,
        DeferralReference = deferral.Reference,
        PaymentDueDate = deferral.DueDate,
        ReleaseAuthorization = await GrantRelease(declaration)
    };
}

private DateTime GetNextPaymentCycleDate(PaymentCycle cycle)
{
    return cycle switch
    {
        PaymentCycle.Weekly => DateTime.UtcNow.AddDays(7),
        PaymentCycle.Biweekly => DateTime.UtcNow.AddDays(14),
        PaymentCycle.Monthly => DateTime.UtcNow.AddMonths(1),
        _ => DateTime.UtcNow.AddDays(30)
    };
}
```

**Payment Cycles**:
- **Weekly**: Small/medium operators
- **Biweekly**: Medium operators
- **Monthly**: Large AEO operators (most common)

**Guarantee Calculation**:
```typescript
function calculateGuaranteeRequired(
  historicalData: OperatorHistory
): number {
  // Calculate average monthly duty liability
  const avgMonthlyDuty = historicalData.totalDutiesPaid / 
                         historicalData.monthsActive;
  
  // Multiply by coverage factor
  const coverageFactor = historicalData.aeoLevel === 'AEO-F' ? 1.5 : 2.0;
  
  return avgMonthlyDuty * coverageFactor;
}
```  );
  
  // Release at actual entry point
  await this.notifyEntryPoint(
    declaration.actualEntryPoint,
    clearance.releaseAuthorization
  );
  
  return clearance;
}
```

---

## Self-Assessment

Trusted traders can self-assess classification, origin, and value:

```csharp
public class SelfAssessmentService
{
    public async Task<AssessmentResult> ProcessSelfAssessment(
        SelfAssessmentDeclaration declaration)
    {
        // Verify self-assessment authorization
        var trader = await _traderRepository.GetById(declaration.TraderId);
        
        if (!trader.HasSelfAssessmentAuth)
        {
            throw new UnauthorizedException(
                "Self-assessment not authorized for this trader"
            );
        }
        
        // Accept trader's assessment
        var assessment = new Assessment
        {
            HsCode = declaration.DeclaredHsCode, // Trader's classification
            Origin = declaration.DeclaredOrigin, // Trader's origin
            Value = declaration.DeclaredValue, // Trader's valuation
            TrustLevel = TrustLevel.SelfAssessed,
            VerificationStatus = VerificationStatus.PostClearanceAudit
        };
        
        // Immediate clearance
        var clearance = await _clearanceService.IssueClearance(
            declaration,
            assessment
        );
        
        // Schedule for audit
        await _auditService.SchedulePostClearanceAudit(
            declaration.DeclarationRef,
            priority: AuditPriority.Routine
        );
        
        return new AssessmentResult
        {
            Accepted = true,
            ClearanceRef = clearance.Reference,
            AuditScheduled = true
        };
    }
}
```

---

## Periodic Declaration

Multiple shipments declared in single periodic declaration:

```typescript
interface PeriodicDeclaration {
  period: {
    from: Date;
    to: Date;
  };
  declarantId: string;
  shipments: Shipment[];
  consolidatedDuties: TaxCalculation;
  paymentDue: Date;
}

async submitPeriodicDeclaration(
  declaration: PeriodicDeclaration
): Promise<DeclarationResult> {
  // Verify periodic declaration authorization
  const auth = await this.getPeriodicAuth(declaration.declarantId);
  
  if (!auth.isValid) {
    throw new Error('Periodic declaration not authorized');
  }
  
  // Validate all shipments were pre-released
  for (const shipment of declaration.shipments) {
    const preRelease = await this.getPreRelease(shipment.id);
    if (!preRelease) {
      throw new Error(`Shipment ${shipment.id} not pre-released`);
    }
  }
  
  // Calculate consolidated duties
  const duties = declaration.shipments.reduce(
    (sum, s) => sum + s.estimatedDuties,
    0
  );
  
  // Create payment obligation
  await this.createPaymentObligation({
    declarationRef: declaration.reference,
    amount: duties,
    dueDate: declaration.paymentDue
  });
  
  return {
    status: 'ACCEPTED',
    totalDuties: duties,
    paymentDue: declaration.paymentDue
  };
}
```

---

## Economic Operator Registration System (EORI)

### Purpose

All traders must register in the Economic Operator Registry before conducting customs operations.

**Benefits of Registration**:
- Unique identification number (NIF Aduaneiro)
- Track compliance history
- Risk profiling for expedited clearance
- Access to online services
- Eligibility for simplified procedures

### Registration Process

```csharp
public class EconomicOperatorRegistration
{
    public async Task<RegistrationResult> RegisterOperator(
        OperatorApplication application)
    {
        // Validate business registration
        var businessCheck = await _businessRegistry.Verify(
            application.CommercialRegistrationNumber
        );
        
        if (!businessCheck.IsValid)
        {
            return RegistrationResult.Rejected(
                "Commercial registration not found"
            );
        }
        
        // Verify tax compliance
        var taxCheck = await _taxAuthority.CheckCompliance(
            application.TaxpayerNumber
        );
        
        if (taxCheck.HasArrears)
        {
            return RegistrationResult.Rejected(
                "Tax arrears must be cleared before registration"
            );
        }
        
        // Create operator profile
        var operator = new EconomicOperator
        {
            OperatorId = GenerateOperatorId(),
            BusinessName = application.BusinessName,
            TaxpayerNumber = application.TaxpayerNumber,
            OperatorType = application.OperatorType,
            RegistrationDate = DateTime.UtcNow,
            Status = OperatorStatus.Active,
            RiskLevel = DetermineInitialRiskLevel(application),
            Activities = application.IntendedActivities
        };
        
        await SaveOperator(operator);
        
        return RegistrationResult.Approved(operator.OperatorId);
    }
    
    private RiskLevel DetermineInitialRiskLevel(
        OperatorApplication application)
    {
        // New operators start at medium risk
        if (application.YearsInBusiness < 2)
            return RiskLevel.Medium;
        
        // Established businesses with good records start lower
        if (application.YearsInBusiness >= 5 && 
            application.HasCleanComplianceRecord)
            return RiskLevel.Low;
        
        return RiskLevel.Medium;
    }
}
```

**Operator Types**:
- **Importer**: Brings goods into Angola
- **Exporter**: Sends goods outside Angola
- **Customs Broker**: Acts on behalf of importers/exporters
- **Carrier**: Transports goods across borders
- **Warehouse Operator**: Stores goods in customs warehouses
- **Freight Forwarder**: Arranges shipment logistics

---

## Performance Monitoring

Customs monitors AEO operators continuously:

```typescript
interface PerformanceMonitoring {
  operatorId: string;
  
  metrics: {
    complianceRate: number;        // Target: >95%
    declarationAccuracy: number;   // Target: >98%
    dutyPaymentPunctuality: number; // Target: 100%
    responseToAudit: number;       // Target: <5 days
  };
  
  incidents: {
    classificationErrors: number;
    valuationAdjustments: number;
    documentDeficiencies: number;
    paymentDelays: number;
  };
  
  annualReview: {
    reviewDate: Date;
    overallRating: 'EXCELLENT' | 'SATISFACTORY' | 'NEEDS_IMPROVEMENT';
    actionRequired: string[];
  };
}
```

**Consequences of Non-Compliance**:
- **Minor Issues**: Warning, additional monitoring
- **Moderate Issues**: Temporary suspension of benefits
- **Serious Issues**: AEO status revocation

---

## Related Documents

- [Import Clearance](./import-clearance.md)
- [Risk-Based Clearance](./risk-based-clearance.md)
- [Post-Clearance Audit](./post-clearance-audit.md)
