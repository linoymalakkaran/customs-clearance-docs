# Port to Door Delivery Operations

**Complete Guide to Last-Mile Delivery from Port to Customer**

---

## Overview

This document covers the complete delivery process from customs release at the port to final delivery at the customer's premises. Understanding this process is critical for importers, freight forwarders, and logistics operators.

---

## Table of Contents

1. [Delivery Process Overview](#delivery-process-overview)
2. [Document Flow](#document-flow)
3. [Port Gate-Out Procedures](#port-gate-out-procedures)
4. [Transportation Modes](#transportation-modes)
5. [Delivery Types by Incoterms](#delivery-types-by-incoterms)
6. [Last-Mile Delivery](#last-mile-delivery)
7. [Proof of Delivery](#proof-of-delivery)
8. [Delivery Challenges](#delivery-challenges)

---

## Delivery Process Overview

### End-to-End Timeline

```
Customs Release → Container Release → Gate Out → Transport → Delivery
   (2-6 hours)      (2-4 hours)      (1-2 hours)  (4-48 hours) (2-4 hours)
```

### Key Stakeholders

1. **Customs Authority (AGT)** - Issues customs release
2. **Port Authority (INAMAR)** - Port security clearance
3. **Terminal Operator** - Physical container release
4. **Freight Forwarder** - Coordinates delivery
5. **Trucking Company** - Physical transport
6. **Importer/Consignee** - Receives goods

---

## Document Flow

### Critical Documents for Delivery

#### 1. Customs Release Documents

**Customs Release Order (CRO)**:
```typescript
interface CustomsReleaseOrder {
  releaseNumber: string;
  declarationRef: string;
  importerName: string;
  importerNIF: string;
  releaseDate: Date;
  validUntil: Date;  // Usually 30 days
  
  goods: {
    description: string;
    quantity: number;
    hsCode: string;
    containerNumbers: string[];
  }[];
  
  conditions: {
    dutiesPaid: boolean;
    inspectionCompleted: boolean;
    documentsVerified: boolean;
  };
  
  qrCode: string;  // For verification
}
```

**Required for Gate-Out**:
- Customs Release Order (original or electronic)
- Proof of payment (receipt)
- Import declaration reference
- Container release authorization

#### 2. Shipping Line Documents

**Delivery Order (D/O)**:
- Issued by shipping line/agent
- Authorizes container release from terminal
- Valid for specific time period (usually 3-7 days)
- Requires payment of freight charges

```csharp
public class DeliveryOrderRequest
{
    public async Task<DeliveryOrder> IssueDeliveryOrder(
        DORequest request)
    {
        // Verify Bill of Lading
        var bl = await _blRepository.GetByNumber(request.BLNumber);
        if (bl == null)
        {
            throw new ValidationException("Bill of Lading not found");
        }
        
        // Check consignee authorization
        if (request.ConsigneeNIF != bl.ConsigneeNIF && 
            !request.HasEndorsement)
        {
            throw new UnauthorizedException(
                "Not authorized to collect cargo"
            );
        }
        
        // Verify freight paid
        if (!bl.FreightPrepaid && !request.FreightPaymentProof)
        {
            throw new ValidationException(
                "Freight charges must be paid before D/O issuance"
            );
        }
        
        // Issue Delivery Order
        var deliveryOrder = new DeliveryOrder
        {
            DONumber = GenerateDONumber(),
            BLNumber = request.BLNumber,
            ConsigneeName = bl.ConsigneeName,
            ConsigneeNIF = bl.ConsigneeNIF,
            ContainerNumbers = bl.Containers,
            IssueDate = DateTime.UtcNow,
            ValidUntil = DateTime.UtcNow.AddDays(7),
            Terminal = bl.DischargeTerminal,
            Status = DOStatus.Active
        };
        
        await SaveDeliveryOrder(deliveryOrder);
        
        return deliveryOrder;
    }
}
```

**Equipment Interchange Receipt (EIR)**:
- Container condition report
- Issued at gate-out
- Documents container number, seal number, condition
- Driver signs to accept container

#### 3. Port/Terminal Documents

**Gate Pass**:
- Electronic or paper authorization
- Container location in yard
- Slot/block information
- Chassis assignment (if applicable)

**Vehicle Entry Permit (VEP)**:
- Truck registration
- Driver identification
- Company authorization
- Valid insurance

---

## Port Gate-Out Procedures

### Step-by-Step Gate-Out Process

#### Step 1: Pre-Gate Documentation (2-4 hours before)

**Freight Forwarder Actions**:

```typescript
async prepareGateOut(
  containerDetails: ContainerInfo
): Promise<GateOutPreparation> {
  // 1. Obtain Delivery Order from shipping line
  const deliveryOrder = await this.shippingLineService.getDeliveryOrder(
    containerDetails.blNumber
  );
  
  // 2. Verify customs release
  const customsRelease = await this.customsService.checkRelease(
    containerDetails.declarationRef
  );
  
  if (!customsRelease.isReleased) {
    throw new Error('Customs release pending');
  }
  
  // 3. Book terminal appointment
  const appointment = await this.terminalService.bookGateOutSlot({
    containerNumber: containerDetails.containerNumber,
    deliveryOrderRef: deliveryOrder.number,
    proposedTime: containerDetails.preferredPickupTime
  });
  
  // 4. Arrange truck and driver
  const transport = await this.transportService.assignTruck({
    containerSize: containerDetails.size,
    containerType: containerDetails.type,
    pickupLocation: appointment.terminal,
    deliveryAddress: containerDetails.finalDestination,
    pickupTime: appointment.confirmedTime
  });
  
  // 5. Generate gate pass
  const gatePass = await this.terminalService.generateGatePass({
    appointmentRef: appointment.reference,
    truckPlate: transport.truckPlate,
    driverLicense: transport.driverLicense,
    deliveryOrder: deliveryOrder.number
  });
  
  return {
    gatePass: gatePass,
    appointment: appointment,
    transportDetails: transport,
    instructions: this.generateDriverInstructions(appointment, transport)
  };
}
```

#### Step 2: Terminal Entry (15-30 minutes)

**Entry Gate Procedures**:

1. **Driver arrives at terminal**
2. **Document check**:
   - Gate pass (electronic or physical)
   - Delivery order
   - Customs release order
   - Driver's license and ID
   - Truck registration
   - Insurance certificate

3. **System verification**:
```csharp
public async Task<GateEntryResult> ProcessGateEntry(
    GateEntryRequest request)
{
    var validation = new GateEntryValidation();
    
    // Verify gate pass
    var gatePass = await _gatePassService.Verify(request.GatePassNumber);
    if (!gatePass.IsValid)
    {
        validation.AddError("Invalid or expired gate pass");
    }
    
    // Verify delivery order
    var deliveryOrder = await _deliveryOrderService.Verify(
        request.DeliveryOrderNumber
    );
    if (!deliveryOrder.IsValid)
    {
        validation.AddError("Invalid delivery order");
    }
    
    // Verify customs release
    var customsCheck = await _customsService.VerifyRelease(
        request.CustomsReleaseNumber
    );
    if (!customsCheck.IsReleased)
    {
        validation.AddError("Customs release not verified");
    }
    
    // Verify driver and vehicle
    var vehicleCheck = await _vehicleService.VerifyRegistration(
        request.TruckPlate
    );
    if (!vehicleCheck.IsValid || vehicleCheck.HasViolations)
    {
        validation.AddError("Vehicle registration issues");
    }
    
    if (!validation.IsValid)
    {
        return GateEntryResult.Rejected(validation.Errors);
    }
    
    // Grant entry
    var entry = new TerminalEntry
    {
        EntryNumber = GenerateEntryNumber(),
        TruckPlate = request.TruckPlate,
        DriverName = request.DriverName,
        EntryTime = DateTime.UtcNow,
        Purpose = "Container Pickup",
        ContainerNumber = request.ContainerNumber,
        ExpectedExitTime = DateTime.UtcNow.AddHours(2)
    };
    
    await SaveEntry(entry);
    
    // Direct to yard location
    return GateEntryResult.Approved(
        entry.EntryNumber,
        GetContainerLocation(request.ContainerNumber)
    );
}
```

4. **Entry recorded** - Truck enters terminal
5. **Directed to container location**

#### Step 3: Container Pickup (30-60 minutes)

**Yard Operations**:

1. **Truck proceeds to designated block/stack**
2. **Reach stacker/top loader retrieves container**
3. **Container placed on truck chassis**
4. **Visual inspection**:
   - Container number matches
   - Seal integrity check
   - External damage assessment
5. **Driver signs Equipment Interchange Receipt (EIR)**

**Container Condition Check**:
```typescript
interface ContainerInspection {
  containerNumber: string;
  sealNumber: string;
  sealIntact: boolean;
  
  damages: {
    location: 'DOOR' | 'ROOF' | 'SIDE' | 'FLOOR' | 'CORNER';
    type: 'DENT' | 'HOLE' | 'RUST' | 'PAINT_DAMAGE';
    severity: 'MINOR' | 'MAJOR';
    photos: string[];
  }[];
  
  weight: {
    verifiedGrossMass: number; // VGM
    tareWeight: number;
    cargoWeight: number;
  };
  
  cleanliness: 'CLEAN' | 'DIRTY' | 'CONTAMINATED';
  
  inspectedBy: string;
  inspectionTime: Date;
  driverSignature: string;
}
```

#### Step 4: Gate-Out Processing (10-20 minutes)

**Exit Gate Procedures**:

```csharp
public async Task<GateExitResult> ProcessGateExit(
    GateExitRequest request)
{
    // Verify entry record
    var entry = await _entryService.GetByEntryNumber(
        request.EntryNumber
    );
    
    if (entry == null)
    {
        return GateExitResult.Error("No entry record found");
    }
    
    // Verify container on truck matches authorization
    if (request.ContainerNumber != entry.ContainerNumber)
    {
        return GateExitResult.Error("Container mismatch");
    }
    
    // Final customs check (random inspection)
    if (await _customsService.RequiresExitInspection())
    {
        return GateExitResult.HoldForInspection(
            "Selected for exit customs inspection"
        );
    }
    
    // Record gate-out
    var exit = new TerminalExit
    {
        ExitNumber = GenerateExitNumber(),
        EntryNumber = entry.EntryNumber,
        ContainerNumber = request.ContainerNumber,
        TruckPlate = request.TruckPlate,
        ExitTime = DateTime.UtcNow,
        Destination = request.DeclaredDestination,
        EIRSigned = request.EIRSigned
    };
    
    await SaveExit(exit);
    
    // Update container status
    await _containerTrackingService.UpdateStatus(
        request.ContainerNumber,
        ContainerStatus.OutForDelivery,
        exit.ExitTime
    );
    
    // Notify importer
    await _notificationService.NotifyImporter(
        entry.ImporterNIF,
        $"Container {request.ContainerNumber} departed port at {exit.ExitTime}"
    );
    
    return GateExitResult.Approved(exit.ExitNumber);
}
```

**Gate-Out Document**:
- Exit time recorded
- Container seal verified
- Driver receives exit slip
- GPS tracking activated

---

## Transportation Modes

### 1. Full Container Load (FCL) Delivery

**Direct Delivery**:
- Container delivered directly to consignee premises
- Unloading at customer site
- Container returned to depot later

```typescript
interface FCLDelivery {
  containerNumber: string;
  sealNumber: string;
  
  pickup: {
    terminal: string;
    gateOutTime: Date;
  };
  
  delivery: {
    address: string;
    coordinates: { lat: number; lon: number };
    contactPerson: string;
    contactPhone: string;
    scheduledTime: Date;
    actualArrival?: Date;
  };
  
  emptyReturn: {
    depotLocation: string;
    returnDeadline: Date;
    demurrageRate: number; // Per day after free time
  };
}
```

**Container Freight Station (CFS) Delivery**:
- Container delivered to CFS for devanning
- Goods unstuffed and sorted
- Cargo delivered to customer as breakbulk

### 2. Less than Container Load (LCL) Delivery

**Process**:
1. Container unstuffed at CFS
2. Goods sorted by consignee
3. Individual cargo pieces delivered
4. Smaller vehicles used

```csharp
public class LCLDeliveryService
{
    public async Task<List<DeliveryTask>> ScheduleLCLDeliveries(
        string containerNumber)
    {
        // Get all cargo in container
        var cargoPieces = await _lclService.GetContainerCargo(
            containerNumber
        );
        
        var deliveryTasks = new List<DeliveryTask>();
        
        foreach (var cargo in cargoPieces)
        {
            // Group by consignee and area
            var task = new DeliveryTask
            {
                ConsigneeNIF = cargo.ConsigneeNIF,
                ConsigneeName = cargo.ConsigneeName,
                DeliveryAddress = cargo.DeliveryAddress,
                Pieces = cargo.Pieces,
                Weight = cargo.Weight,
                Volume = cargo.Volume,
                SpecialHandling = cargo.RequiresSpecialHandling
            };
            
            deliveryTasks.Add(task);
        }
        
        // Optimize delivery routes
        var optimizedRoutes = await _routeOptimizer.Optimize(
            deliveryTasks
        );
        
        return optimizedRoutes;
    }
}
```

### 3. Transshipment Operations

**Hub-and-Spoke Model**:
- Container arrives at major port (Luanda/Lobito)
- Transferred to smaller vessel/truck
- Delivered to secondary port/inland depot
- Final delivery from secondary location

---

## Delivery Types by Incoterms

### FOB (Free On Board)

**Buyer Responsibility**:
- Arrange shipping from port
- Obtain delivery order
- Coordinate port pickup
- Transport to final destination

### CIF (Cost, Insurance & Freight)

**Seller Responsibility**: Up to port of destination
**Buyer Responsibility**: 
- Customs clearance
- Port charges
- Inland transport

### DAP (Delivered At Place)

**Seller Responsibility**:
- Arrange entire delivery
- Transport to buyer's premises
- Unloading excluded

**Buyer Responsibility**:
- Customs clearance
- Unloading

### DDP (Delivered Duty Paid)

**Seller Responsibility**:
- Complete door-to-door service
- Customs clearance
- All duties and taxes
- Transport and unloading

```typescript
async planDeliveryByIncoterm(
  shipment: ShipmentDetails,
  incoterm: Incoterm
): Promise<DeliveryPlan> {
  const plan: DeliveryPlan = {
    steps: [],
    responsibilities: {}
  };
  
  switch (incoterm) {
    case 'FOB':
      plan.buyerResponsibilities = [
        'Arrange port pickup',
        'Pay port charges',
        'Customs clearance',
        'Inland transport'
      ];
      break;
      
    case 'CIF':
      plan.sellerResponsibilities = [
        'Ocean freight',
        'Marine insurance'
      ];
      plan.buyerResponsibilities = [
        'Customs clearance',
        'Port charges',
        'Inland transport'
      ];
      break;
      
    case 'DAP':
      plan.sellerResponsibilities = [
        'Ocean freight',
        'Customs clearance',
        'Inland transport to buyer premises'
      ];
      plan.buyerResponsibilities = [
        'Unloading at destination'
      ];
      break;
      
    case 'DDP':
      plan.sellerResponsibilities = [
        'Complete door-to-door',
        'All duties and taxes',
        'Customs clearance',
        'Unloading'
      ];
      break;
  }
  
  return plan;
}
```

---

## Last-Mile Delivery

### Urban Delivery Challenges

**Luanda City Delivery**:
- Traffic congestion (peak hours 7-9 AM, 5-7 PM)
- Limited parking for large trucks
- Building access restrictions
- Security concerns

**Solutions**:
1. **Time Windows**: Deliver during off-peak hours
2. **Smaller Vehicles**: Transfer to smaller trucks for final leg
3. **Pre-notification**: Call customer 1 hour before arrival
4. **Escort Service**: For high-value goods

### Delivery Execution

```csharp
public class LastMileDeliveryService
{
    public async Task<DeliveryResult> ExecuteDelivery(
        DeliveryTask task)
    {
        // Pre-delivery notification
        await NotifyCustomer(
            task.ConsigneePhone,
            task.EstimatedArrival,
            task.DriverPhone
        );
        
        // Real-time tracking
        var tracker = new GPSTracker
        {
            TruckPlate = task.TruckPlate,
            Destination = task.DeliveryAddress,
            UpdateInterval = TimeSpan.FromMinutes(5)
        };
        
        await tracker.StartTracking();
        
        // Arrival confirmation
        var arrival = await WaitForArrival(task.DeliveryAddress);
        
        // Delivery execution
        var deliveryAttempt = new DeliveryAttempt
        {
            ArrivalTime = arrival.Time,
            ReceiverName = arrival.ReceiverName,
            ReceiverID = arrival.ReceiverID
        };
        
        // Document verification
        if (!await VerifyReceiver(arrival.ReceiverID, task.ConsigneeNIF))
        {
            deliveryAttempt.Status = DeliveryStatus.RefusedUnauthorized;
            return DeliveryResult.Failed(deliveryAttempt);
        }
        
        // Physical handover
        deliveryAttempt.UnloadStartTime = DateTime.UtcNow;
        
        // Goods inspection by receiver
        var inspection = await ConductReceivingInspection(task);
        deliveryAttempt.InspectionResult = inspection;
        
        if (inspection.HasDamages && !inspection.Accepted)
        {
            deliveryAttempt.Status = DeliveryStatus.Rejected;
            return DeliveryResult.Failed(deliveryAttempt);
        }
        
        // Signature capture
        deliveryAttempt.ProofOfDelivery = await CaptureSignature(
            arrival.ReceiverName
        );
        deliveryAttempt.Photos = await CaptureDeliveryPhotos();
        
        deliveryAttempt.UnloadEndTime = DateTime.UtcNow;
        deliveryAttempt.Status = DeliveryStatus.Completed;
        
        // Update systems
        await UpdateDeliveryStatus(task, deliveryAttempt);
        
        return DeliveryResult.Success(deliveryAttempt);
    }
}
```

### Receiving Inspection

**Customer Checks**:
1. **Seal Verification**: Match seal number on documents
2. **Quantity Count**: Verify piece count
3. **Package Condition**: Check for damage
4. **Product Inspection**: Sample check (if feasible)

**Discrepancy Handling**:
```typescript
interface ReceivingDiscrepancy {
  type: 'SHORTAGE' | 'DAMAGE' | 'WRONG_GOODS' | 'QUALITY_ISSUE';
  
  shortage?: {
    expectedQuantity: number;
    actualQuantity: number;
    missingPieces: number;
  };
  
  damage?: {
    affectedPieces: number;
    damageDescription: string;
    photos: string[];
    estimatedValue: number;
  };
  
  reportedBy: string;
  reportTime: Date;
  driverComments: string;
  
  resolution: 'ACCEPTED' | 'REJECTED' | 'PARTIAL_ACCEPTANCE' | 'CLAIM_FILED';
}
```

---

## Proof of Delivery

### POD Requirements

**Essential Elements**:
1. **Date and Time**: Delivery timestamp
2. **Receiver Information**: Name, ID, signature
3. **Location**: GPS coordinates, address
4. **Condition**: Goods accepted as is or with remarks
5. **Photos**: Delivery scene, goods condition

```typescript
interface ProofOfDelivery {
  podNumber: string;
  deliveryDate: Date;
  
  receiver: {
    name: string;
    idNumber: string;
    relationship: 'CONSIGNEE' | 'AUTHORIZED_REPRESENTATIVE' | 'OTHER';
    signature: string; // Base64 image
  };
  
  location: {
    address: string;
    gpsCoordinates: { lat: number; lon: number };
    geoFence: boolean; // Delivered within designated area
  };
  
  goods: {
    description: string;
    quantity: number;
    condition: 'GOOD' | 'DAMAGED' | 'SHORTAGE';
    remarks: string;
  }[];
  
  photos: {
    timestamp: Date;
    type: 'ARRIVAL' | 'UNLOADING' | 'GOODS' | 'SIGNATURE';
    url: string;
  }[];
  
  driver: {
    name: string;
    licenseNumber: string;
    signature: string;
  };
  
  deliveryDuration: number; // Minutes from arrival to completion
}
```

### Digital POD System

```csharp
public class DigitalPODService
{
    public async Task<PODDocument> GenerateProofOfDelivery(
        DeliveryAttempt delivery)
    {
        var pod = new PODDocument
        {
            PODNumber = GeneratePODNumber(),
            DeliveryReference = delivery.TaskReference,
            GeneratedAt = DateTime.UtcNow
        };
        
        // Capture signature electronically
        pod.ReceiverSignature = await _signatureService.Capture(
            delivery.ReceiverName
        );
        
        // Capture photos
        pod.Photos = await _photoService.CaptureMultiple(new[]
        {
            PhotoType.UnloadingProcess,
            PhotoType.DeliveredGoods,
            PhotoType.SignatureCapture
        });
        
        // Record GPS location
        pod.GPSCoordinates = await _gpsService.GetCurrentLocation();
        
        // Timestamp with blockchain
        pod.BlockchainHash = await _blockchainService.Timestamp(pod);
        
        // Store in system
        await SavePOD(pod);
        
        // Send notifications
        await NotifyStakeholders(pod);
        
        // Generate PDF
        var pdfDocument = await GeneratePODPdf(pod);
        
        return pod;
    }
}
```

---

## Delivery Challenges

### Common Issues

#### 1. Consignee Not Available

**Scenarios**:
- Office closed
- No one to receive
- Wrong contact information

**Solutions**:
- Pre-delivery coordination call
- Reschedule delivery
- Delivery to authorized alternate
- Secure storage until pickup

#### 2. Access Restrictions

**Challenges**:
- Gated communities
- Security clearance required
- Limited access hours
- Vehicle size restrictions

**Mitigation**:
- Pre-arrange access permissions
- Obtain entry passes
- Transfer to smaller vehicle
- Schedule within allowed hours

#### 3. Unloading Equipment

**Requirements**:
- Forklift needed
- Loading dock required
- Manual unloading crew

**Planning**:
```typescript
interface UnloadingRequirements {
  method: 'FORKLIFT' | 'CRANE' | 'TAILGATE' | 'MANUAL';
  
  equipment: {
    required: boolean;
    providedBy: 'CUSTOMER' | 'CARRIER';
    specification: string;
  };
  
  labor: {
    crewSize: number;
    providedBy: 'CUSTOMER' | 'CARRIER';
    estimatedDuration: number; // minutes
  };
  
  facilities: {
    loadingDock: boolean;
    elevator: boolean;
    storageSpace: boolean;
  };
}
```

#### 4. Customs Hold at Delivery

**Rare Scenarios**:
- Post-clearance audit triggered during transit
- Additional documentation requested
- Goods subject to re-inspection

**Process**:
- Halt delivery
- Return to secure facility
- Resolve customs issue
- Resume delivery after clearance

---

## Performance Metrics

### Key Performance Indicators

```typescript
interface DeliveryKPIs {
  onTimeDelivery: number;      // Target: >95%
  firstTimeDeliverySuccess: number; // Target: >90%
  averageDeliveryTime: number;  // Port to door (hours)
  damageRate: number;           // Target: Under 0.5%
  customerSatisfaction: number; // Target: >4.5/5
  
  portDwellTime: {
    averageHours: number;       // Target: Under 48 hours
    percentUnder24h: number;    // Target: >60%
  };
  
  documentationAccuracy: number; // Target: >98%
  deliveryAttempts: number;     // Average per shipment
  exceptionRate: number;        // Target: Under 5%
}
```

---

## Summary

Effective port-to-door delivery requires:
- ✅ Proper documentation and advance planning
- ✅ Coordination among multiple parties
- ✅ Real-time tracking and visibility
- ✅ Clear communication with consignee
- ✅ Contingency plans for common issues
- ✅ Digital proof of delivery capture

**Success Factors**:
1. Pre-delivery coordination
2. Accurate documentation
3. Professional truck operators
4. Real-time tracking
5. Responsive customer service
6. Efficient exception handling

---

## Related Documents

- [Import Clearance](./customs-clearance/import-clearance.md)
- [Port Logistics Overview](./port-logistics-overview.md)
- [Transit Operations](./customs-clearance/transit-operations.md)
