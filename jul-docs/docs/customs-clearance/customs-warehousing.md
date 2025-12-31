# Customs Warehousing

**Complete Guide to Customs Warehouse Operations and Procedures**

---

## Overview

Customs warehousing allows imported goods to be stored in designated facilities without payment of import duties and taxes until they are cleared for home use, re-exported, or destroyed.

### Benefits
- Deferred payment of duties
- Cash flow management
- Storage for market timing
- Processing and repacking allowed
- Re-export without duty payment

---

## Types of Customs Warehouses

### Type A: Public Warehouse
- Operated by authorized warehouse keeper
- Available to any importer
- Subject to customs supervision
- Full customs security

### Type B: Private Warehouse
- For exclusive use by authorization holder
- Usually manufacturing or distribution facilities
- AEO certification beneficial
- Reduced supervision

### Type C: Free Zone Warehouse
- Within designated free zones
- Minimal customs formalities
- Extended storage periods
- Manufacturing allowed

### Type D: Duty-Free Shop
- At international airports/borders
- For departing passengers only
- Specific licensing requirements

---

## Warehousing Procedures

### Procedure Codes
- **71**: Warehousing (standard)
- **76**: Free zone warehousing
- **78**: Temporary storage

### Authorization Process

```typescript
interface WarehouseAuthorization {
  facilityId: string;
  warehouseType: 'A' | 'B' | 'C' | 'D';
  operator: {
    name: string;
    nif: string;
    aeoStatus?: string;
  };
  capacity: {
    totalArea: number; // square meters
    storageCapacity: number; // kg or cubic meters
    specialFacilities: string[];
  };
  securityMeasures: {
    fencing: boolean;
    surveillance: boolean;
    accessControl: boolean;
    fireProtection: boolean;
  };
  validFrom: Date;
  validUntil: Date;
}
```

### Goods Entry to Warehouse

```csharp
public class WarehouseEntryService
{
    public async Task<WarehouseEntryResult> RegisterWarehouseEntry(
        WarehouseEntryRequest request)
    {
        // Validate warehouse authorization
        var warehouse = await _warehouseRepository.GetWarehouse(
            request.WarehouseId
        );
        
        if (warehouse == null || !warehouse.IsActive)
        {
            throw new ValidationException("Warehouse not authorized");
        }
        
        // Check capacity
        var currentStock = await GetCurrentStock(request.WarehouseId);
        var availableSpace = warehouse.Capacity - currentStock.TotalVolume;
        
        if (request.GoodsVolume > availableSpace)
        {
            throw new ValidationException("Insufficient warehouse capacity");
        }
        
        // Create warehouse entry declaration
        var entry = new WarehouseEntry
        {
            EntryNumber = GenerateEntryNumber(),
            WarehouseId = request.WarehouseId,
            ImportDeclarationRef = request.ImportDeclarationRef,
            Goods = request.Goods,
            EntryDate = DateTime.UtcNow,
            DepositorId = request.DepositorId,
            MaxStoragePeriod = warehouse.Type == 'A' ? 24 : 36 // months
        };
        
        // Calculate deferred duties
        var duties = await CalculateDeferredDuties(request.Goods);
        entry.DeferredDuties = duties;
        
        // Create customs security (if required)
        if (warehouse.RequiresSecurity)
        {
            var security = await CreateCustomsSecurity(
                entry.EntryNumber,
                duties.TotalAmount
            );
            entry.SecurityReference = security.Reference;
        }
        
        await SaveWarehouseEntry(entry);
        
        // Update warehouse stock
        await UpdateWarehouseStock(request.WarehouseId, request.Goods, 1);
        
        return new WarehouseEntryResult
        {
            EntryNumber = entry.EntryNumber,
            DeferredDuties = duties.TotalAmount,
            MaxStorageDate = DateTime.UtcNow.AddMonths(entry.MaxStoragePeriod),
            SecurityRequired = entry.SecurityReference != null
        };
    }
}
```

---

## Stock Management

### Inventory Control

```typescript
interface WarehouseInventory {
  warehouseId: string;
  items: WarehouseStockItem[];
  lastAuditDate: Date;
  nextAuditDue: Date;
}

interface WarehouseStockItem {
  stockId: string;
  entryNumber: string;
  depositorId: string;
  goods: {
    hsCode: string;
    description: string;
    quantity: number;
    unit: string;
    packageCount: number;
  };
  location: {
    zone: string;
    row: string;
    bay: string;
    level: string;
  };
  entryDate: Date;
  maxStorageDate: Date;
  deferredDuties: number;
  status: 'STORED' | 'RELEASED' | 'DESTROYED' | 'EXPIRED';
}

class WarehouseInventoryService {
  async recordStockMovement(
    movement: StockMovement
  ): Promise<MovementResult> {
    const warehouse = await this.getWarehouse(movement.warehouseId);
    
    // Verify authorization
    if (!this.isAuthorizedUser(movement.userId, warehouse)) {
      throw new UnauthorizedException('User not authorized for this warehouse');
    }
    
    // Update stock records
    switch (movement.type) {
      case 'ENTRY':
        await this.addStock(movement);
        break;
      case 'WITHDRAWAL':
        await this.removeStock(movement);
        break;
      case 'TRANSFER':
        await this.transferStock(movement);
        break;
      case 'ADJUSTMENT':
        await this.adjustStock(movement);
        break;
    }
    
    // Create audit trail
    await this.createAuditLog(movement);
    
    return {
      success: true,
      newStockLevel: await this.getStockLevel(
        movement.warehouseId,
        movement.goodsId
      )
    };
  }
}
```

---

## Authorized Operations

### Permitted Activities in Warehouse

1. **Storage** (all types)
2. **Inspection and sampling**
3. **Repacking and relabeling**
4. **Normal maintenance**
5. **Sorting and grading**
6. **Assembly of packages**

### Restricted Activities

Require special authorization:
- **Processing/manufacturing**
- **Mixing of goods**
- **Quality improvements**
- **Major repairs**

```csharp
public async Task<OperationAuthorization> AuthorizeWarehouseOperation(
    OperationRequest request)
{
    var entry = await GetWarehouseEntry(request.EntryNumber);
    
    // Check if operation is permitted
    if (!IsPermittedOperation(request.OperationType, entry.WarehouseType))
    {
        throw new ValidationException(
            $"Operation {request.OperationType} not permitted in this warehouse type"
        );
    }
    
    // For restricted operations, require special approval
    if (IsRestrictedOperation(request.OperationType))
    {
        var approval = await RequestSpecialApproval(request);
        
        if (!approval.IsApproved)
        {
            return new OperationAuthorization
            {
                Authorized = false,
                Reason = approval.RejectionReason
            };
        }
    }
    
    // Create operation record
    var operation = new WarehouseOperation
    {
        OperationId = Guid.NewGuid().ToString(),
        EntryNumber = request.EntryNumber,
        OperationType = request.OperationType,
        AuthorizedDate = DateTime.UtcNow,
        ValidUntil = DateTime.UtcNow.AddDays(30),
        Conditions = GetOperationConditions(request.OperationType)
    };
    
    await SaveWarehouseOperation(operation);
    
    return new OperationAuthorization
    {
        Authorized = true,
        OperationId = operation.OperationId,
        ValidUntil = operation.ValidUntil,
        Conditions = operation.Conditions
    };
}
```

---

## Goods Release from Warehouse

### Release for Home Use

```csharp
public class WarehouseReleaseService
{
    public async Task<ReleaseResult> ReleaseForHomeUse(
        string entryNumber,
        ReleaseRequest request)
    {
        var entry = await GetWarehouseEntry(entryNumber);
        
        // Verify depositor authorization
        if (request.DepositorId != entry.DepositorId)
        {
            throw new UnauthorizedException("Not authorized to release these goods");
        }
        
        // Create import declaration for home use
        var importDeclaration = new ImportDeclaration
        {
            ProcedureCode = "40", // Release from warehouse
            WarehouseEntryNumber = entryNumber,
            Items = MapWarehouseGoodsToImportItems(entry.Goods),
            DeclarantId = request.DepositorId
        };
        
        // Calculate duties (based on rates at time of release, not entry)
        var duties = await _dutyService.CalculateImportDuties(
            importDeclaration,
            DateTime.UtcNow // Current date rates
        );
        
        // Submit declaration
        var declResult = await _declarationService.SubmitImportDeclaration(
            importDeclaration
        );
        
        // After customs clearance and payment
        if (declResult.Status == DeclarationStatus.Cleared)
        {
            // Remove from warehouse
            await RemoveFromWarehouse(entryNumber);
            
            // Release security if applicable
            if (entry.SecurityReference != null)
            {
                await ReleaseSecurity(entry.SecurityReference);
            }
            
            entry.Status = WarehouseEntryStatus.Released;
            entry.ReleaseDate = DateTime.UtcNow;
            await SaveWarehouseEntry(entry);
        }
        
        return new ReleaseResult
        {
            ImportDeclarationRef = declResult.DeclarationReference,
            DutiesPayable = duties.TotalAmount,
            Status = declResult.Status
        };
    }
}
```

### Release for Re-Export

```typescript
async releaseForReExport(
  entryNumber: string,
  reExportDetails: ReExportRequest
): Promise<ReExportResult> {
  const entry = await this.getWarehouseEntry(entryNumber);
  
  // No duties payable on re-export
  const exportDeclaration = await this.createExportDeclaration({
    procedureCode: '31', // Re-export from warehouse
    warehouseEntryNumber: entryNumber,
    goods: entry.goods,
    destinationCountry: reExportDetails.destinationCountry
  });
  
  // Process export
  const exportResult = await this.exportService.processExport(
    exportDeclaration
  );
  
  if (exportResult.status === 'RELEASED') {
    // Remove from warehouse
    await this.removeFromWarehouse(entryNumber);
    
    // Release deferred duties (no payment required)
    await this.cancelDeferredDuties(entry.deferredDuties);
    
    // Release security
    if (entry.securityReference) {
      await this.releaseSecurity(entry.securityReference);
    }
    
    entry.status = 'RE_EXPORTED';
    entry.exitDate = new Date();
    await this.updateWarehouseEntry(entry);
  }
  
  return {
    exportReference: exportResult.declarationReference,
    dutiesWaived: entry.deferredDuties,
    securityReleased: entry.securityReference !== null
  };
}
```

---

## Warehousing Charges

### Cost Components

1. **Storage Fees**
   - Daily/monthly rate
   - Based on volume or weight
   - Tiered pricing

2. **Handling Charges**
   - Entry fee
   - Exit fee
   - Movement charges

3. **Security Costs**
   - Customs supervision
   - Warehouse security
   - Insurance

4. **Service Charges**
   - Repacking
   - Inspection facilitation
   - Reporting services

```csharp
public class WarehouseChargeCalculationService
{
    public async Task<ChargeCalculation> CalculateWarehouseCharges(
        string entryNumber,
        DateTime calculationDate)
    {
        var entry = await GetWarehouseEntry(entryNumber);
        var calculation = new ChargeCalculation();
        
        // Storage days
        var storageDays = (calculationDate - entry.EntryDate).Days;
        
        // Storage fee (tiered)
        var storageRate = GetStorageRate(storageDays, entry.WarehouseId);
        var storageFee = entry.GoodsVolume * storageRate * storageDays;
        
        calculation.StorageFee = storageFee;
        
        // Handling charges
        calculation.EntryCharge = 50; // Fixed entry fee
        calculation.ExitCharge = 50; // Fixed exit fee
        
        // Additional operations
        var operations = await GetWarehouseOperations(entryNumber);
        calculation.OperationCharges = operations.Sum(op => op.Charge);
        
        // Customs supervision fee (if applicable)
        if (entry.RequiresSupervision)
        {
            calculation.SupervisionFee = storageDays * 10; // $10 per day
        }
        
        // Total
        calculation.TotalCharges = calculation.StorageFee +
                                   calculation.EntryCharge +
                                   calculation.ExitCharge +
                                   calculation.OperationCharges +
                                   calculation.SupervisionFee;
        
        return calculation;
    }
    
    private decimal GetStorageRate(int days, string warehouseId)
    {
        // Tiered pricing: cheaper for longer storage
        if (days <= 30)
            return 0.50m; // $0.50 per cubic meter per day
        else if (days <= 90)
            return 0.40m; // $0.40 for month 2-3
        else
            return 0.30m; // $0.30 for 3+ months
    }
}
```

---

## Compliance and Auditing

### Periodic Warehouse Audits

```typescript
interface WarehouseAudit {
  auditId: string;
  warehouseId: string;
  auditDate: Date;
  auditor: string;
  auditType: 'ROUTINE' | 'SPOT_CHECK' | 'COMPLAINT';
  
  findings: AuditFinding[];
  overallRating: 'SATISFACTORY' | 'DEFICIENCIES' | 'SERIOUS_VIOLATIONS';
  
  correctiveActions: CorrectiveAction[];
}

class WarehouseAuditService {
  async conductAudit(warehouseId: string): Promise<WarehouseAudit> {
    const warehouse = await this.getWarehouse(warehouseId);
    const audit: WarehouseAudit = {
      auditId: this.generateAuditId(),
      warehouseId: warehouseId,
      auditDate: new Date(),
      auditor: this.getCurrentAuditor(),
      auditType: 'ROUTINE',
      findings: []
    };
    
    // 1. Physical stock verification
    const stockCheck = await this.verifyPhysicalStock(warehouse);
    if (!stockCheck.matches) {
      audit.findings.push({
        category: 'STOCK_DISCREPANCY',
        severity: 'HIGH',
        description: 'Physical stock does not match records',
        details: stockCheck.discrepancies
      });
    }
    
    // 2. Documentation review
    const docCheck = await this.reviewDocumentation(warehouse);
    if (docCheck.hasIssues) {
      audit.findings.push({
        category: 'DOCUMENTATION',
        severity: 'MEDIUM',
        description: 'Documentation issues found',
        details: docCheck.issues
      });
    }
    
    // 3. Security measures
    const securityCheck = await this.assessSecurity(warehouse);
    if (!securityCheck.adequate) {
      audit.findings.push({
        category: 'SECURITY',
        severity: 'HIGH',
        description: 'Inadequate security measures',
        details: securityCheck.deficiencies
      });
    }
    
    // 4. Compliance with conditions
    const complianceCheck = await this.checkComplianceConditions(warehouse);
    if (!complianceCheck.compliant) {
      audit.findings.push({
        category: 'COMPLIANCE',
        severity: 'HIGH',
        description: 'Non-compliance with authorization conditions',
        details: complianceCheck.violations
      });
    }
    
    // Determine overall rating
    audit.overallRating = this.determineOverallRating(audit.findings);
    
    // Generate corrective actions if needed
    if (audit.findings.length > 0) {
      audit.correctiveActions = this.generateCorrectiveActions(
        audit.findings
      );
    }
    
    return audit;
  }
}
```

---

## Best Practices

### For Warehouse Operators

1. **Record Keeping**
   - Maintain accurate stock records
   - Document all movements
   - Keep audit trail

2. **Security**
   - Implement access controls
   - Use surveillance systems
   - Regular security audits

3. **Compliance**
   - Train staff on procedures
   - Conduct self-audits
   - Report issues promptly

4. **Customer Service**
   - Clear communication
   - Timely processing
   - Transparent pricing

### For Depositors

1. **Planning**
   - Understand storage costs
   - Plan release timing
   - Monitor storage limits

2. **Documentation**
   - Keep entry documents
   - Track storage periods
   - Plan exit procedures

3. **Cost Management**
   - Compare warehouse options
   - Optimize storage duration
   - Consider re-export vs import

---

## Summary

Customs warehousing provides:
- ✅ Deferred duty payment
- ✅ Flexible storage options
- ✅ Re-export capability
- ✅ Cash flow benefits
- ✅ Market timing flexibility

**Key Requirements**:
- Authorized warehouse
- Proper documentation
- Stock management
- Time limit compliance
- Accurate record keeping

---

## Related Documents

- [Import Clearance](./import-clearance.md)
- [Temporary Admission](./temporary-admission.md)
- [Transit Operations](./transit-operations.md)
- [Simplified Procedures](./simplified-procedures.md)
