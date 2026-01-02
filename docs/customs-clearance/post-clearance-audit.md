# Post-Clearance Audit

**Guide to Post-Release Verification and Audit Procedures**

---

## Overview

Post-clearance audit (PCA) verifies the accuracy of customs declarations after goods have been released. This approach facilitates trade while maintaining control through subsequent verification.

### Objectives
- Verify declaration accuracy
- Detect non-compliance
- Recover underpaid duties
- Educate traders
- Improve risk profiling

---

## Audit Selection

### Selection Criteria

**Risk-Based Selection**:
- High-value declarations
- First-time importers
- Sensitive commodities
- Valuation concerns
- Origin discrepancies

**Random Selection**:
- 5-10% of all declarations
- Ensures unpredictability
- Maintains deterrent effect

```csharp
public class AuditSelectionService
{
    public async Task<List<string>> SelectForAudit(
        AuditSelectionCriteria criteria)
    {
        var selected = new List<string>();
        
        // Risk-based selection
        var highRisk = await _riskService.GetHighRiskDeclarations(
            criteria.Period,
            criteria.RiskThreshold
        );
        selected.AddRange(highRisk);
        
        // Random selection
        var allDeclarations = await _declarationRepo.GetDeclarations(
            criteria.Period
        );
        
        var randomCount = (int)(allDeclarations.Count * criteria.RandomRate);
        var random = SelectRandom(allDeclarations, randomCount);
        selected.AddRange(random);
        
        // Targeted selection (intelligence)
        if (criteria.TargetedTraders?.Any() == true)
        {
            var targeted = await SelectTargetedDeclarations(
                criteria.TargetedTraders
            );
            selected.AddRange(targeted);
        }
        
        return selected.Distinct().ToList();
    }
}
```

---

## Audit Process

### Audit Phases

**1. Notification**
- Trader notified of audit
- Documents requested
- Timeline provided

**2. Document Review**
- Commercial invoice
- Purchase orders
- Payment evidence
- Transport documents
- Origin certificates

**3. On-Site Visit** (if required)
- Physical verification
- Systems review
- Interview staff
- Examine records

**4. Findings**
- Draft report
- Trader response opportunity
- Final report

**5. Follow-Up**
- Additional duties collection
- Penalties assessment
- Corrective actions
- Compliance monitoring

```typescript
interface AuditProgram {
  auditId: string;
  declarationRefs: string[];
  auditType: 'COMPREHENSIVE' | 'FOCUSED' | 'FOLLOW_UP';
  
  scope: {
    period: { from: Date; to: Date };
    focusAreas: AuditFocusArea[];
    sampleSize: number;
  };
  
  schedule: {
    notificationDate: Date;
    documentDeadline: Date;
    siteVisitDate?: Date;
    reportDueDate: Date;
  };
  
  findings: AuditFinding[];
  recommendations: string[];
}

interface AuditFinding {
  category: 'CLASSIFICATION' | 'VALUATION' | 'ORIGIN' | 'DOCUMENTATION';
  severity: 'MINOR' | 'SIGNIFICANT' | 'CRITICAL';
  description: string;
  financialImpact: number;
  recommendation: string;
}
```

---

## Common Audit Findings

### 1. Classification Errors
- Incorrect HS code
- Wrong duty rate applied
- Preferential treatment claimed incorrectly

### 2. Valuation Issues
- Under-valuation
- Related party transactions not adjusted
- Royalties not included
- Transport costs excluded

### 3. Origin Misrepresentation
- False origin certificates
- Insufficient origin evidence
- Trans-shipment manipulation

### 4. Documentation Deficiencies
- Missing documents
- Inconsistent information
- Forged certificates

---

## Audit Adjustments

```csharp
public class AuditAdjustmentService
{
    public async Task<AdjustmentResult> ProcessAuditAdjustment(
        AuditFinding finding)
    {
        var declaration = await GetDeclaration(finding.DeclarationRef);
        
        // Calculate additional duties
        var additionalDuties = await CalculateAdditionalDuties(
            declaration,
            finding
        );
        
        // Calculate interest
        var daysSinceRelease = (DateTime.UtcNow - declaration.ReleaseDate).Days;
        var interestRate = 0.05m; // 5% annual
        var interest = additionalDuties * (interestRate / 365) * daysSinceRelease;
        
        // Determine penalty
        var penalty = DeterminePenalty(finding.Severity, additionalDuties);
        
        // Create adjustment notice
        var adjustment = new AuditAdjustment
        {
            AdjustmentId = Guid.NewGuid().ToString(),
            DeclarationRef = declaration.Reference,
            FindingCategory = finding.Category,
            AdditionalDuties = additionalDuties,
            Interest = interest,
            Penalty = penalty,
            TotalDue = additionalDuties + interest + penalty,
            DueDate = DateTime.UtcNow.AddDays(30),
            AppealDeadline = DateTime.UtcNow.AddDays(60)
        };
        
        await SaveAdjustment(adjustment);
        await NotifyTrader(adjustment);
        
        return new AdjustmentResult
        {
            AdjustmentNotice = adjustment,
            PaymentInstructions = GeneratePaymentInstructions(adjustment)
        };
    }
    
    private decimal DeterminePenalty(string severity, decimal duties)
    {
        return severity switch
        {
            "MINOR" => 0, // Warning only
            "SIGNIFICANT" => duties * 0.10m, // 10% penalty
            "CRITICAL" => duties * 0.25m, // 25% penalty
            _ => 0
        };
    }
}
```

---

## Trader Rights

### During Audit
- Right to representation
- Advance notice of visit
- Copy of findings
- Opportunity to respond
- Appeal rights

### Appeal Process
- 60 days to appeal
- Independent review
- Suspension of collection (with guarantee)
- Administrative tribunal
- Court appeal

---

## Best Practices

### For Traders
1. Maintain complete records (5 years)
2. Implement internal controls
3. Conduct self-audits
4. Cooperate with auditors
5. Seek voluntary disclosure

### For Customs
1. Risk-based selection
2. Professional conduct
3. Clear communication
4. Fair assessment
5. Educational approach

---

## Related Documents

- [Import Clearance](./import-clearance.md)
- [Risk-Based Clearance](./risk-based-clearance.md)
- [Appeals and Disputes](./appeals-disputes.md)
