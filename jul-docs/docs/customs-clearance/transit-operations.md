# Transit Operations

**Complete Guide to Customs Transit and Transshipment Procedures**

---

## Overview

Transit operations allow goods to pass through Angola's territory en route to another country without payment of import duties. This facilitates regional trade and positions Angola as a transit corridor for landlocked neighboring countries.

### Types of Transit

1. **International Transit** - Goods crossing Angola to reach another country
2. **Internal Transit** - Movement between customs offices within Angola
3. **Transshipment** - Transfer between vessels/vehicles at Angolan ports
4. **Transit via Warehouse** - Temporary storage during transit

---

## International Transit

### Transit Countries Using Angola

**Primary Routes**:
- **Democratic Republic of Congo (DRC)** → Port of Lobito → Kinshasa/Lubumbashi
- **Zambia** → Port of Lobito → Lusaka (Lobito Corridor)
- **Zimbabwe** → Via Zambia route
- **Namibia** → Cunene border crossings

### Transit Process Flow

```
Entry Point (Border/Port) → Transit Declaration → Guarantee Deposit
    ↓                            ↓                      ↓
Customs Sealing → Transit Route → Monitoring (GPS/Escort)
    ↓                            ↓                      ↓
Exit Point → Exit Confirmation → Guarantee Release
```

---

## Transit Declaration (T1 Document)

### Declaration Requirements

```typescript
interface TransitDeclaration {
  // Identification
  transitType: 'T1' | 'T2'; // T1=International, T2=Community
  mrnNumber: string; // Movement Reference Number
  
  // Parties
  principal: {
    id: string;
    name: string;
    country: string;
    guaranteeNumber: string;
  };
  
  // Route
  officeOfDeparture: string;
  officeOfDestination: string;
  countryOfDestination: string;
  guaranteedRoute: RoutePoint[];
  estimatedTime: number; // hours
  
  // Goods
  items: TransitItem[];
  totalPackages: number;
  totalGrossMass: number;
  
  // Transport
  meansOfTransport: {
    type: 'TRUCK' | 'RAIL' | 'CONTAINER';
    identification: string;
    nationality: string;
  };
  
  // Seals
  seals: string[];
  
  // Guarantee
  guarantee: {
    type: 'CASH' | 'BANK_GUARANTEE' | 'CARNET_TIR';
    amount: number;
    reference: string;
  };
}

interface TransitItem {
  itemNumber: number;
  hsCode: string;
  description: string;
  packages: number;
  packageType: string;
  grossMass: number;
  customsValue: number;
  countryOfOrigin: string;
}
```

### Transit Declaration Submission

```csharp
public class TransitDeclarationService
{
    public async Task<TransitDeclarationResult> SubmitTransitDeclaration(
        TransitDeclarationRequest request)
    {
        var result = new TransitDeclarationResult();
        
        try
        {
            // Step 1: Validate principal/carrier
            var principalValid = await ValidatePrincipal(request.Principal);
            if (!principalValid.IsValid)
            {
                result.Errors.AddRange(principalValid.Errors);
                return result;
            }
            
            // Step 2: Validate route
            var routeValid = await ValidateTransitRoute(
                request.OfficeOfDeparture,
                request.OfficeOfDestination
            );
            
            if (!routeValid.IsApproved)
            {
                result.Errors.Add("Invalid transit route");
                return result;
            }
            
            // Step 3: Calculate guarantee amount
            var guaranteeAmount = CalculateGuaranteeAmount(request.Items);
            
            // Step 4: Verify guarantee
            var guaranteeValid = await VerifyGuarantee(
                request.Guarantee,
                guaranteeAmount
            );
            
            if (!guaranteeValid)
            {
                result.Errors.Add($"Guarantee insufficient. Required: ${guaranteeAmount}");
                return result;
            }
            
            // Step 5: Generate MRN
            var mrn = GenerateMovementReferenceNumber();
            
            // Step 6: Assign customs seals
            var seals = await AssignCustomsSeals(request.MeansOfTransport);
            
            // Step 7: Calculate time limit
            var timeLimit = CalculateTransitTimeLimit(
                request.OfficeOfDeparture,
                request.OfficeOfDestination,
                request.MeansOfTransport
            );
            
            // Step 8: Create transit document
            var transitDoc = new TransitDocument
            {
                MRN = mrn,
                DeclarationDate = DateTime.UtcNow,
                OfficeOfDeparture = request.OfficeOfDeparture,
                OfficeOfDestination = request.OfficeOfDestination,
                Principal = request.Principal,
                Items = request.Items,
                Seals = seals,
                TimeLimit = timeLimit,
                GuaranteeAmount = guaranteeAmount,
                GuaranteeReference = request.Guarantee.Reference,
                Status = TransitStatus.Registered
            };
            
            await SaveTransitDocument(transitDoc);
            
            result.IsSuccess = true;
            result.MRN = mrn;
            result.Seals = seals;
            result.TimeLimit = timeLimit;
            result.GuaranteeAmount = guaranteeAmount;
            
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Transit declaration submission failed");
            result.Errors.Add("System error during submission");
            return result;
        }
    }
    
    private decimal CalculateGuaranteeAmount(List<TransitItem> items)
    {
        // Guarantee = (Customs Value + Potential Duties) * Safety Factor
        var totalValue = items.Sum(i => i.CustomsValue);
        var estimatedDuties = totalValue * 0.30m; // Assume 30% duties
        var guaranteeAmount = (totalValue + estimatedDuties) * 1.10m; // +10% buffer
        
        return Math.Round(guaranteeAmount, 2);
    }
    
    private DateTime CalculateTransitTimeLimit(
        string departure,
        string destination,
        MeansOfTransport transport)
    {
        // Get standard route time
        var routeTime = _routeService.GetEstimatedTime(departure, destination);
        
        // Add buffer based on transport type
        var buffer = transport.Type switch
        {
            "TRUCK" => 24, // +1 day
            "RAIL" => 48,  // +2 days
            "CONTAINER" => 72, // +3 days
            _ => 24
        };
        
        return DateTime.UtcNow.AddHours(routeTime + buffer);
    }
}
```

---

## Customs Guarantee

### Guarantee Types

**1. Cash Deposit**
- Direct payment to customs
- 100% of potential duties
- Refunded upon successful transit completion

**2. Bank Guarantee**
- Letter of guarantee from approved bank
- Valid for specific period
- Released after transit completion

**3. TIR Carnet**
- International customs document
- Issued by IRU (International Road Transport Union)
- Covers multiple transits
- Valid for 1 year

**4. Comprehensive Guarantee**
- For regular transit operators
- Covers multiple simultaneous transits
- Requires authorization from customs

```csharp
public class TransitGuaranteeService
{
    public async Task<GuaranteeValidation> ValidateGuarantee(
        GuaranteeRequest guarantee,
        decimal requiredAmount)
    {
        var validation = new GuaranteeValidation();
        
        switch (guarantee.Type)
        {
            case GuaranteeType.Cash:
                validation = await ValidateCashDeposit(guarantee, requiredAmount);
                break;
                
            case GuaranteeType.BankGuarantee:
                validation = await ValidateBankGuarantee(guarantee, requiredAmount);
                break;
                
            case GuaranteeType.TirCarnet:
                validation = await ValidateTirCarnet(guarantee);
                break;
                
            case GuaranteeType.Comprehensive:
                validation = await ValidateComprehensiveGuarantee(
                    guarantee, 
                    requiredAmount
                );
                break;
        }
        
        return validation;
    }
    
    private async Task<GuaranteeValidation> ValidateTirCarnet(
        GuaranteeRequest guarantee)
    {
        var validation = new GuaranteeValidation();
        
        // Verify carnet exists in IRU database
        var carnetValid = await _iruService.ValidateCarnet(guarantee.Reference);
        
        if (!carnetValid.IsValid)
        {
            validation.IsValid = false;
            validation.Errors.Add("TIR Carnet not valid or expired");
            return validation;
        }
        
        // Check if carnet has available vouchers
        if (carnetValid.UsedVouchers >= carnetValid.TotalVouchers)
        {
            validation.IsValid = false;
            validation.Errors.Add("No available vouchers in TIR Carnet");
            return validation;
        }
        
        // Check expiry date
        if (carnetValid.ExpiryDate < DateTime.UtcNow)
        {
            validation.IsValid = false;
            validation.Errors.Add("TIR Carnet expired");
            return validation;
        }
        
        validation.IsValid = true;
        validation.GuaranteeDetails = carnetValid;
        
        return validation;
    }
}
```

---

## Customs Sealing

### Seal Types

1. **Electronic Seals** - GPS-tracked, tamper-evident
2. **Mechanical Seals** - Physical bolt seals
3. **Cable Seals** - Wire/cable with seal
4. **Container Seals** - ISO-compliant container seals

### Sealing Procedure

```typescript
class CustomsSealingService {
  async applySeal(
    transitMRN: string,
    transport: MeansOfTransport
  ): Promise<SealingResult> {
    const seals: CustomsSeal[] = [];
    
    // Determine number of seals required
    const sealCount = this.determineSealCount(transport);
    
    for (let i = 0; i < sealCount; i++) {
      const seal: CustomsSeal = {
        sealNumber: this.generateSealNumber(),
        sealType: 'ELECTRONIC', // Preferred
        appliedDate: new Date(),
        appliedBy: 'CUSTOMS_OFFICER',
        location: this.determineSealLocation(transport, i),
        status: 'INTACT'
      };
      
      // Register seal in system
      await this.registerSeal(transitMRN, seal);
      
      // Activate GPS tracking if electronic
      if (seal.sealType === 'ELECTRONIC') {
        await this.activateGpsTracking(seal.sealNumber, transitMRN);
      }
      
      seals.push(seal);
    }
    
    return {
      success: true,
      seals: seals,
      instructions: this.getSealingInstructions(transport)
    };
  }
  
  async verifySeal(sealNumber: string): Promise<SealVerification> {
    const seal = await this.getSeal(sealNumber);
    
    // Check seal status
    if (seal.status === 'BROKEN') {
      return {
        isValid: false,
        reason: 'Seal has been broken',
        action: 'IMMEDIATE_INSPECTION_REQUIRED'
      };
    }
    
    // For electronic seals, check GPS tracking
    if (seal.sealType === 'ELECTRONIC') {
      const tracking = await this.getTrackingData(sealNumber);
      
      // Verify route compliance
      if (!tracking.isOnApprovedRoute) {
        return {
          isValid: false,
          reason: 'Deviation from approved route',
          action: 'ROUTE_INVESTIGATION'
        };
      }
    }
    
    return {
      isValid: true,
      sealCondition: seal.status,
      lastVerified: new Date()
    };
  }
}
```

---

## Transit Monitoring

### GPS Tracking System

```csharp
public class TransitMonitoringService
{
    public async Task<TrackingUpdate> RecordPosition(
        string mrn,
        GpsCoordinates coordinates)
    {
        var transitDoc = await GetTransitDocument(mrn);
        
        if (transitDoc == null)
        {
            throw new NotFoundException($"Transit MRN {mrn} not found");
        }
        
        // Record position
        var position = new TransitPosition
        {
            MRN = mrn,
            Latitude = coordinates.Latitude,
            Longitude = coordinates.Longitude,
            Timestamp = DateTime.UtcNow,
            Speed = coordinates.Speed,
            Heading = coordinates.Heading
        };
        
        await SavePosition(position);
        
        // Check if on approved route
        var routeCheck = await CheckRouteCompliance(transitDoc, position);
        
        if (!routeCheck.IsCompliant)
        {
            // Generate alert
            await GenerateRouteDeviationAlert(transitDoc, position, routeCheck);
        }
        
        // Check time limit
        if (DateTime.UtcNow > transitDoc.TimeLimit)
        {
            await GenerateTimeLimitAlert(transitDoc);
        }
        
        // Estimate arrival
        var eta = CalculateETA(transitDoc, position);
        
        return new TrackingUpdate
        {
            CurrentPosition = position,
            IsOnRoute = routeCheck.IsCompliant,
            EstimatedArrival = eta,
            TimeRemaining = transitDoc.TimeLimit - DateTime.UtcNow
        };
    }
    
    private async Task<RouteCompliance> CheckRouteCompliance(
        TransitDocument transit,
        TransitPosition position)
    {
        var compliance = new RouteCompliance { IsCompliant = true };
        
        // Get approved route corridor
        var route = await _routeService.GetApprovedRoute(
            transit.OfficeOfDeparture,
            transit.OfficeOfDestination
        );
        
        // Check if position is within corridor (e.g., 10km buffer)
        var distance = GeoCalculator.DistanceFromRoute(
            position,
            route.Waypoints
        );
        
        if (distance > route.CorridorWidth)
        {
            compliance.IsCompliant = false;
            compliance.DeviationDistance = distance;
            compliance.NearestPoint = GeoCalculator.NearestPointOnRoute(
                position,
                route.Waypoints
            );
        }
        
        return compliance;
    }
}
```

---

## Exit Procedures

### Office of Destination Processing

```typescript
class TransitExitService {
  async processTransitExit(
    mrn: string,
    exitDetails: TransitExitDetails
  ): Promise<ExitResult> {
    const transit = await this.getTransitDocument(mrn);
    
    if (!transit) {
      throw new Error(`Transit MRN ${mrn} not found`);
    }
    
    // Step 1: Verify arrival at correct office
    if (exitDetails.officeCode !== transit.officeOfDestination) {
      throw new Error('Transit arrived at wrong office of destination');
    }
    
    // Step 2: Verify seals
    const sealVerification = await this.verifySeals(
      transit.seals,
      exitDetails.sealsPresented
    );
    
    if (!sealVerification.allSealsIntact) {
      // Require physical inspection
      return {
        status: 'INSPECTION_REQUIRED',
        reason: 'Seal irregularity detected',
        brokenSeals: sealVerification.brokenSeals
      };
    }
    
    // Step 3: Verify time limit
    if (new Date() > transit.timeLimit) {
      // Transit took longer than allowed
      await this.flagTimeLimitViolation(transit);
    }
    
    // Step 4: Physical verification (if required)
    if (transit.requiresPhysicalCheck || !sealVerification.allSealsIntact) {
      const inspection = await this.conductPhysicalInspection(transit);
      
      if (!inspection.passed) {
        return {
          status: 'DISCREPANCY_FOUND',
          discrepancies: inspection.findings
        };
      }
    }
    
    // Step 5: Complete transit
    await this.completeTransit(mrn, exitDetails);
    
    // Step 6: Release guarantee
    await this.releaseGuarantee(transit.guaranteeReference);
    
    // Step 7: Notify parties
    await this.notifyTransitCompletion(transit);
    
    return {
      status: 'COMPLETED',
      completionDate: new Date(),
      guaranteeReleased: true
    };
  }
  
  async verifySeals(
    originalSeals: string[],
    presentedSeals: string[]
  ): Promise<SealVerificationResult> {
    const result: SealVerificationResult = {
      allSealsIntact: true,
      brokenSeals: [],
      missingSeals: []
    };
    
    // Check all original seals are present
    for (const originalSeal of originalSeals) {
      if (!presentedSeals.includes(originalSeal)) {
        result.allSealsIntact = false;
        result.missingSeals.push(originalSeal);
      }
    }
    
    // Check for additional seals (tampering indicator)
    for (const presentedSeal of presentedSeals) {
      if (!originalSeals.includes(presentedSeal)) {
        result.allSealsIntact = false;
        result.brokenSeals.push(presentedSeal);
      }
    }
    
    return result;
  }
}
```

---

## Transshipment Operations

### Port Transshipment

**Definition**: Transfer of goods between vessels at an Angolan port without customs clearance.

### Transshipment Process

```
Vessel Arrival → Discharge Notification → Transshipment Declaration
       ↓                  ↓                          ↓
Container Verification → Temporary Storage → Loading Authorization
       ↓                  ↓                          ↓
Loading Completion → Vessel Departure → Transshipment Completion
```

### Transshipment Declaration

```csharp
public class TransshipmentService
{
    public async Task<TransshipmentResult> CreateTransshipment(
        TransshipmentRequest request)
    {
        // Validate incoming vessel
        var inboundVessel = await _vesselService.GetVessel(
            request.InboundVesselId
        );
        
        if (inboundVessel == null || inboundVessel.Status != VesselStatus.InPort)
        {
            throw new ValidationException("Invalid inbound vessel");
        }
        
        // Validate outbound vessel
        var outboundVessel = await _vesselService.GetVessel(
            request.OutboundVesselId
        );
        
        // Create transshipment record
        var transshipment = new Transshipment
        {
            TransshipmentNumber = GenerateTransshipmentNumber(),
            InboundVesselId = request.InboundVesselId,
            InboundBillOfLading = request.InboundBillOfLading,
            OutboundVesselId = request.OutboundVesselId,
            OutboundBillOfLading = request.OutboundBillOfLading,
            Port = request.Port,
            Containers = request.Containers,
            Status = TransshipmentStatus.Registered,
            RegistrationDate = DateTime.UtcNow
        };
        
        // No customs duties for transshipment
        // But port charges apply
        var portCharges = await CalculatePortCharges(transshipment);
        
        await SaveTransshipment(transshipment);
        
        return new TransshipmentResult
        {
            TransshipmentNumber = transshipment.TransshipmentNumber,
            PortCharges = portCharges,
            Status = "APPROVED"
        };
    }
    
    public async Task<DischargeAuthorization> AuthorizeDischarge(
        string transshipmentNumber)
    {
        var transshipment = await GetTransshipment(transshipmentNumber);
        
        // Verify payment of port charges
        if (!transshipment.PortChargesPaid)
        {
            throw new ValidationException("Port charges not paid");
        }
        
        // Generate discharge authorization
        var authorization = new DischargeAuthorization
        {
            TransshipmentNumber = transshipmentNumber,
            AuthorizedContainers = transshipment.Containers,
            DischargeLocation = transshipment.Port,
            ValidFrom = DateTime.UtcNow,
            ValidUntil = DateTime.UtcNow.AddHours(48),
            Conditions = new[]
            {
                "Containers must remain sealed",
                "Direct transfer to designated storage area",
                "No opening or inspection of goods"
            }
        };
        
        return authorization;
    }
}
```

---

## Special Transit Scenarios

### 1. Transit via Warehouse

**Use Case**: Goods require temporary storage during transit.

```typescript
interface TransitWarehouseRequest {
  transitMRN: string;
  warehouseId: string;
  reason: string;
  estimatedStorageDays: number;
}

class TransitWarehouseService {
  async requestWarehouseStorage(
    request: TransitWarehouseRequest
  ): Promise<StorageAuthorization> {
    const transit = await this.getTransitDocument(request.transitMRN);
    
    // Verify warehouse is authorized for transit storage
    const warehouse = await this.getWarehouse(request.warehouseId);
    if (!warehouse.authorizedForTransit) {
      throw new Error('Warehouse not authorized for transit storage');
    }
    
    // Calculate additional guarantee for storage period
    const additionalGuarantee = this.calculateStorageGuarantee(
      transit,
      request.estimatedStorageDays
    );
    
    // Create storage authorization
    const authorization: StorageAuthorization = {
      authorizationNumber: this.generateAuthNumber(),
      transitMRN: request.transitMRN,
      warehouseId: request.warehouseId,
      storageFrom: new Date(),
      storageUntil: new Date(
        Date.now() + request.estimatedStorageDays * 24 * 60 * 60 * 1000
      ),
      additionalGuarantee: additionalGuarantee,
      conditions: [
        'Goods must remain in customs-sealed area',
        'No manipulation except repackaging',
        'Regular reporting required'
      ]
    };
    
    // Suspend transit time limit during storage
    await this.suspendTimeLimit(request.transitMRN);
    
    return authorization;
  }
}
```

### 2. Combined Transit-Import

**Scenario**: Part of transit goods are imported in Angola, rest continues in transit.

```csharp
public async Task<CombinedOperationResult> ProcessCombinedTransitImport(
    string transitMRN,
    List<string> containersForImport)
{
    var transit = await GetTransitDocument(transitMRN);
    
    // Split transit into two operations
    var importContainers = transit.Containers
        .Where(c => containersForImport.Contains(c.ContainerNumber))
        .ToList();
        
    var continueTransitContainers = transit.Containers
        .Except(importContainers)
        .ToList();
    
    // Create import declaration for selected containers
    var importDeclaration = await CreateImportFromTransit(
        transit,
        importContainers
    );
    
    // Update transit with remaining containers
    if (continueTransitContainers.Any())
    {
        transit.Containers = continueTransitContainers;
        await UpdateTransitDocument(transit);
    }
    else
    {
        // All goods imported, close transit
        await CloseTransit(transitMRN);
    }
    
    // Adjust guarantee
    var guaranteeAdjustment = CalculateGuaranteeAdjustment(
        transit.GuaranteeAmount,
        importContainers,
        continueTransitContainers
    );
    
    return new CombinedOperationResult
    {
        ImportDeclarationReference = importDeclaration.Reference,
        ContinuingTransitMRN = continueTransitContainers.Any() ? transitMRN : null,
        GuaranteeAdjustment = guaranteeAdjustment
    };
}
```

---

## Transit Violations and Penalties

### Common Violations

1. **Seal Tampering**
   - Broken or missing seals
   - Penalty: Full duties + 50% fine

2. **Route Deviation**
   - Deviation from approved route without authorization
   - Penalty: Warning (first time), then guarantee forfeiture

3. **Time Limit Exceeded**
   - Arrival after time limit
   - Penalty: Daily penalty 1% of guarantee

4. **Goods Shortage**
   - Delivered quantity less than declared
   - Penalty: Duties on missing goods + 100% fine

5. **Incorrect Destination**
   - Arrival at wrong office
   - Penalty: Administrative fine + re-routing costs

### Penalty Calculation

```csharp
public class TransitPenaltyService
{
    public async Task<PenaltyCalculation> CalculatePenalty(
        TransitViolation violation)
    {
        var calculation = new PenaltyCalculation
        {
            ViolationType = violation.Type,
            BaseAmount = 0
        };
        
        switch (violation.Type)
        {
            case ViolationType.SealTampering:
                calculation.BaseAmount = violation.TransitValue * 1.50m; // 150%
                calculation.Description = "Full duties plus 50% penalty";
                break;
                
            case ViolationType.TimeLimitExceeded:
                var daysLate = (violation.ActualDate - violation.TimeLimit).Days;
                calculation.BaseAmount = violation.GuaranteeAmount * 0.01m * daysLate;
                calculation.Description = $"1% of guarantee per day ({daysLate} days)";
                break;
                
            case ViolationType.RouteDeviation:
                if (violation.IsFirstOffense)
                {
                    calculation.BaseAmount = 0;
                    calculation.Description = "Warning issued";
                }
                else
                {
                    calculation.BaseAmount = violation.GuaranteeAmount * 0.10m;
                    calculation.Description = "10% of guarantee";
                }
                break;
                
            case ViolationType.GoodsShortage:
                var missingValue = violation.MissingQuantity / violation.TotalQuantity 
                    * violation.TransitValue;
                calculation.BaseAmount = missingValue * 2.00m; // 200%
                calculation.Description = "Duties on missing goods plus 100% penalty";
                break;
        }
        
        return calculation;
    }
}
```

---

## Best Practices

### For Transit Operators

1. **Plan Route Carefully**
   - Use approved routes only
   - Account for road conditions
   - Build in time buffer

2. **Maintain Communication**
   - Report position regularly (if no GPS)
   - Notify of any delays
   - Contact customs for issues

3. **Protect Seals**
   - Inspect seals regularly
   - Report damage immediately
   - Document seal condition with photos

4. **Keep Documents**
   - Carry transit documents
   - Have guarantee proof
   - Maintain driver logs

### For Customs Authorities

1. **Risk-Based Approach**
   - Profile transit operators
   - Monitor high-risk routes
   - Use intelligence data

2. **Technology Integration**
   - Implement GPS tracking
   - Use electronic seals
   - Automate monitoring

3. **Regional Cooperation**
   - Share data with neighboring countries
   - Coordinate on transit procedures
   - Align time limits and routes

---

## Integration with Regional Systems

### COMESA Transit

**COMESA Yellow Card**: Regional transit insurance scheme

```typescript
interface ComesaTransit {
  yellowCardNumber: string;
  issuingCountry: string;
  validFrom: Date;
  validUntil: Date;
  coverageAmount: number;
  coveredCountries: string[];
}

class ComesaTransitService {
  async validateYellowCard(cardNumber: string): Promise<ValidationResult> {
    // Connect to COMESA regional database
    const card = await this.comesaApi.getYellowCard(cardNumber);
    
    if (!card) {
      return {
        isValid: false,
        error: 'Yellow Card not found'
      };
    }
    
    // Check validity
    const now = new Date();
    if (now < card.validFrom || now > card.validUntil) {
      return {
        isValid: false,
        error: 'Yellow Card expired or not yet valid'
      };
    }
    
    // Check Angola is covered
    if (!card.coveredCountries.includes('AO')) {
      return {
        isValid: false,
        error: 'Angola not covered by this Yellow Card'
      };
    }
    
    return {
      isValid: true,
      card: card
    };
  }
}
```

### SADC Transit

**SADC Protocol**: Southern African Development Community transit facilitation

---

## Summary

Transit operations enable:
- ✅ Movement of goods through Angola without import duties
- ✅ Regional trade facilitation
- ✅ Angola as trade corridor
- ✅ Controlled movement with guarantees
- ✅ GPS tracking and monitoring
- ✅ Quick exit procedures when compliant

**Key Success Factors**:
- Valid guarantee (TIR, bank guarantee, or cash)
- Approved route compliance
- Intact customs seals
- Arrival within time limit
- Accurate documentation

---

## Related Documents

- [Import Clearance](./import-clearance.md)
- [Export Clearance](./export-clearance.md)
- [Customs Warehousing](./customs-warehousing.md)
