# Port and Logistics Operations - Complete Guide

**Understanding Port Operations, Container Handling, and Logistics in the JUL System**

---

## Table of Contents

1. [Port Operations Overview](#port-operations-overview)
2. [Container Terminal Operations](#container-terminal-operations)
3. [Vessel Operations](#vessel-operations)
4. [Cargo Handling](#cargo-handling)
5. [Warehouse and Storage](#warehouse-and-storage)
6. [Transport and Delivery](#transport-and-delivery)
7. [Port Community System](#port-community-system)
8. [Integration with Single Window](#integration-with-single-window)
9. [Performance Metrics](#performance-metrics)
10. [Best Practices](#best-practices)

---

## Port Operations Overview

### Coordinated Border Management at Ports

Angola implements **Coordinated Border Management (CBM)** principles as recommended by WCO:

**Key Elements**:
- **Single Window Integration**: All border agencies connected to JUL
- **Joint Inspections**: Multiple agencies inspect cargo simultaneously
- **Information Sharing**: Real-time data exchange between agencies
- **Risk Management**: Coordinated risk assessment across agencies
- **One-Stop Processing**: All clearances at port without multiple locations

**Benefits**:
- Reduced cargo dwell time (from days to hours)
- Elimination of duplicate inspections
- Better resource utilization
- Enhanced security through information sharing

**Border Agencies Integrated at Ports**:
1. **Customs (AGT)** - Import/export clearance, duties collection
2. **Health Services (MINSA)** - Quarantine, sanitary inspections
3. **Agriculture (MINAGRIF)** - Phytosanitary, veterinary checks
4. **Standards (IANORQ)** - Quality control, product standards
5. **Environment (MINAMB)** - Environmental permits, waste controls
6. **Transport Authority** - Vehicle registrations, dangerous goods
7. **Port Authority (INAMAR)** - Port security, operations
8. **Border Police** - Security, prohibited goods

### Major Ports in Angola

#### 1. Port of Luanda
- **Type**: Multipurpose port
- **Cargo Types**: Containers, general cargo, ro-ro
- **Annual Capacity**: 700,000 TEU
- **Terminals**: 
  - Container Terminal (Multipurpose Terminal)
  - General Cargo Terminal
  - Oil Terminal
- **Draft**: 12.5 meters
- **Berths**: 12

#### 2. Port of Lobito
- **Type**: Container and bulk port
- **Cargo Types**: Containers, bulk, general cargo
- **Annual Capacity**: 500,000 TEU
- **Strategic**: Lobito Corridor to DRC/Zambia
- **Terminals**:
  - Container Terminal
  - Bulk Terminal
  - General Cargo Terminal
- **Draft**: 13.8 meters
- **Berths**: 10

#### 3. Port of Namibe
- **Type**: Fishing and commercial port
- **Cargo Types**: General cargo, fish products
- **Annual Capacity**: 50,000 TEU
- **Terminals**:
  - Fishing Terminal
  - General Cargo Terminal
- **Draft**: 8.5 meters
- **Berths**: 6

### Port Authorities

**INAMAR** (Instituto Nacional de Autoridade Marítima):
- Port authority and regulator
- Maritime safety and security
- Vessel traffic management
- Port licensing and concessions
- Environmental compliance

**Terminal Operators**:
- Private concessionaires
- Container handling
- Cargo storage
- Equipment operation
- Customer service

---

## Container Terminal Operations

### Container Lifecycle in Port

```
┌─────────────────────────────────────────────────────────────────┐
│                    VESSEL ARRIVAL                               │
├─────────────────────────────────────────────────────────────────┤
│ 1. Vessel berths at terminal                                   │
│ 2. Cargo manifest validated against booking                    │
│ 3. Discharge plan created                                      │
│ 4. Equipment allocated (cranes, reach stackers)               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONTAINER DISCHARGE                          │
├─────────────────────────────────────────────────────────────────┤
│ 5. Ship-to-shore crane lifts container                         │
│ 6. Container placed on terminal truck/AGV                      │
│ 7. Inspection at gate (damage, seal verification)             │
│ 8. Container scanned (radiation, x-ray if required)           │
│ 9. Weight verified (VGM compliance)                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    YARD STORAGE                                 │
├─────────────────────────────────────────────────────────────────┤
│ 10. Terminal Operating System assigns storage location         │
│ 11. Container stacked in yard (by RTG/reach stacker)         │
│ 12. Position recorded in TOS                                  │
│ 13. Available for customs inspection                          │
│ 14. Awaits customs clearance                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMS CLEARANCE (via JUL)                  │
├─────────────────────────────────────────────────────────────────┤
│ 15. Customs declaration submitted through JUL                  │
│ 16. Risk assessment determines inspection requirement          │
│ 17. Physical inspection (if required)                         │
│ 18. Duties and fees paid through JUL                          │
│ 19. Release authorization issued                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    GATE-OUT PROCESS                             │
├─────────────────────────────────────────────────────────────────┤
│ 20. Delivery order verified                                   │
│ 21. Container located in yard                                 │
│ 22. Retrieved and brought to gate                             │
│ 23. Loaded onto truck                                         │
│ 24. Gate-out recorded (exit from port)                       │
│ 25. Transport to final destination                            │
└─────────────────────────────────────────────────────────────────┘
```

### Terminal Operating System (TOS) Integration

```csharp
public class ContainerTrackingService
{
    public async Task<ContainerEvent> RecordContainerDischarge(
        string containerNumber,
        string vesselIMO,
        string terminalCode)
    {
        // 1. Validate container number (ISO 6346)
        if (!ISO6346Validator.IsValid(containerNumber))
        {
            throw new ValidationException("Invalid container number format");
        }
        
        // 2. Find container in vessel manifest
        var manifestEntry = await _database.VesselManifests
            .Where(m => m.VesselIMO == vesselIMO 
                     && m.ContainerNumber == containerNumber)
            .FirstOrDefaultAsync();
        
        if (manifestEntry == null)
        {
            throw new NotFoundException("Container not found in vessel manifest");
        }
        
        // 3. Assign storage location (TOS algorithm)
        var storageLocation = await _tosService.AssignStorageLocation(
            containerNumber,
            manifestEntry.Size,
            manifestEntry.Type,
            manifestEntry.WeightKg,
            manifestEntry.Dangerous
        );
        
        // 4. Record discharge event
        var dischargeEvent = new ContainerEvent
        {
            EventId = Guid.NewGuid(),
            ContainerNumber = containerNumber,
            EventType = "DISCHARGE",
            EventTime = DateTime.UtcNow,
            Location = $"{terminalCode}:{storageLocation}",
            VesselIMO = vesselIMO,
            BLNumber = manifestEntry.BLNumber,
            Status = "IN_TERMINAL",
            CustomsStatus = "AWAITING_DECLARATION",
            AvailableForDelivery = false
        };
        
        await _database.ContainerEvents.AddAsync(dischargeEvent);
        await _database.SaveChangesAsync();
        
        // 5. Notify JUL system
        await _julIntegrationService.NotifyContainerArrival(new ContainerArrival
        {
            ContainerNumber = containerNumber,
            BLNumber = manifestEntry.BLNumber,
            ArrivalTime = dischargeEvent.EventTime,
            Location = terminalCode,
            ConsigneeNIF = manifestEntry.ConsigneeNIF
        });
        
        // 6. Notify consignee
        await _notificationService.NotifyContainerDischarge(
            manifestEntry.ConsigneeEmail,
            containerNumber,
            manifestEntry.BLNumber,
            storageLocation
        );
        
        return dischargeEvent;
    }
    
    public async Task<ContainerLocation> LocateContainer(string containerNumber)
    {
        var latestEvent = await _database.ContainerEvents
            .Where(e => e.ContainerNumber == containerNumber)
            .OrderByDescending(e => e.EventTime)
            .FirstOrDefaultAsync();
        
        if (latestEvent == null)
        {
            throw new NotFoundException("Container not found in system");
        }
        
        // Parse location (format: "TERMINAL:BLOCK-ROW-TIER")
        var locationParts = latestEvent.Location.Split(':');
        var terminal = locationParts[0];
        var position = locationParts.Length > 1 ? locationParts[1] : "";
        
        return new ContainerLocation
        {
            ContainerNumber = containerNumber,
            Terminal = terminal,
            Block = position.Split('-')[0],
            Row = position.Split('-').Length > 1 ? position.Split('-')[1] : "",
            Tier = position.Split('-').Length > 2 ? position.Split('-')[2] : "",
            Status = latestEvent.Status,
            CustomsStatus = latestEvent.CustomsStatus,
            LastUpdated = latestEvent.EventTime,
            AvailableForDelivery = latestEvent.AvailableForDelivery
        };
    }
}
```

### Container Types and Handling

#### Standard Containers

| Type | Size | Dimensions | Max Weight | Usage |
|------|------|------------|------------|-------|
| **20' DC** | 1 TEU | 20'×8'×8.5' | 30,480 kg | General cargo |
| **40' DC** | 2 TEU | 40'×8'×8.5' | 32,500 kg | General cargo |
| **40' HC** | 2 TEU | 40'×8'×9.5' | 32,500 kg | High cube cargo |
| **45' HC** | 2.25 TEU | 45'×8'×9.5' | 32,500 kg | Pallet wide |

#### Specialized Containers

| Type | Purpose | Special Requirements |
|------|---------|---------------------|
| **Reefer** | Refrigerated cargo | Power connection, temperature monitoring |
| **Open Top** | Oversized cargo | Crane handling, weather protection |
| **Flat Rack** | Heavy/wide cargo | Special lashing equipment |
| **Tank** | Liquid cargo | Hazmat certification |

#### Dangerous Goods Containers

**IMDG Classes** (requires special handling):
1. Explosives - Segregated area, security
2. Gases - Ventilated storage
3. Flammable liquids - Fire safety measures
4. Flammable solids - Dry storage
5. Oxidizers - Segregation required
6. Toxic substances - Sealed storage
7. Radioactive - Radiation monitoring
8. Corrosives - Spill containment
9. Miscellaneous - Risk assessment

```csharp
public class DangerousGoodsHandler
{
    public async Task<StorageAssignment> AssignDGStorage(
        string containerNumber,
        IMDGClass imdgClass,
        string unNumber)
    {
        // Check DG approval
        var dgApproval = await _database.DGApprovals
            .Where(a => a.ContainerNumber == containerNumber
                     && a.Status == "APPROVED")
            .FirstOrDefaultAsync();
        
        if (dgApproval == null)
        {
            throw new Exception("Dangerous goods not approved for handling");
        }
        
        // Determine segregation requirements
        var segregation = GetSegregationRequirements(imdgClass);
        
        // Find suitable storage location
        var availableLocations = await _database.StorageLocations
            .Where(l => l.Type == "DANGEROUS_GOODS"
                     && l.AllowedClasses.Contains(imdgClass.ToString())
                     && l.Available)
            .ToListAsync();
        
        // Check segregation with existing containers
        foreach (var location in availableLocations)
        {
            var nearbyContainers = await GetNearbyContainers(location);
            
            if (IsSegregationCompliant(imdgClass, nearbyContainers, segregation))
            {
                // Assign location
                location.Available = false;
                location.ContainerNumber = containerNumber;
                location.AssignedTime = DateTime.UtcNow;
                
                await _database.SaveChangesAsync();
                
                // Alert fire brigade and emergency services
                await _emergencyService.NotifyDGStorage(
                    containerNumber,
                    imdgClass,
                    unNumber,
                    location.Code
                );
                
                return new StorageAssignment
                {
                    ContainerNumber = containerNumber,
                    Location = location.Code,
                    SpecialInstructions = GetDGHandlingInstructions(imdgClass),
                    EmergencyContact = "Port Emergency: +244-222-123456"
                };
            }
        }
        
        throw new Exception("No suitable storage location available for DG container");
    }
}
```

---

## Vessel Operations

### Vessel Arrival Process

#### 1. Pre-Arrival Notification

**ETA Notification** (72 hours before):
```typescript
interface VesselArrivalNotification {
  vesselName: string;
  imoNumber: string;
  callSign: string;
  flag: string;
  grossTonnage: number;
  estimatedArrival: Date;
  previousPort: string;
  nextPort: string;
  cargoManifest: {
    containers: number;
    teu: number;
    weight: number;
  };
  crew: {
    nationality: string;
    count: number;
  }[];
  passengers: number;
  dangerousGoods: boolean;
  requestedServices: string[];
}
```

**Services Requested**:
- Pilotage
- Tugboat assistance
- Berth allocation
- Mooring services
- Fresh water supply
- Waste disposal
- Customs clearance
- Immigration clearance

#### 2. Port Entry Formalities

**FAL Forms** (IMO FAL Convention):
- FAL 1: General Declaration
- FAL 2: Cargo Declaration
- FAL 3: Ship's Stores
- FAL 4: Crew Effects
- FAL 5: Crew List
- FAL 6: Passenger List
- FAL 7: Dangerous Goods Manifest

```csharp
public class FALFormProcessor
{
    public async Task<string> ProcessGeneralDeclaration(FAL1Form form)
    {
        // Validate form
        var validation = await ValidateFAL1(form);
        if (!validation.IsValid)
        {
            return $"REJECTED: {string.Join(", ", validation.Errors)}";
        }
        
        // Check vessel registration
        var vessel = await _vesselRegistry.FindByIMO(form.IMONumber);
        if (vessel == null)
        {
            await _vesselRegistry.RegisterVessel(new Vessel
            {
                IMONumber = form.IMONumber,
                Name = form.VesselName,
                CallSign = form.CallSign,
                Flag = form.FlagState,
                GrossTonnage = form.GrossTonnage,
                Type = form.VesselType
            });
        }
        
        // Create port call record
        var portCall = new PortCall
        {
            PortCallId = Guid.NewGuid(),
            VesselIMO = form.IMONumber,
            ArrivalDate = form.DateTimeOfArrival,
            DepartureDate = form.DateTimeOfDeparture,
            PreviousPort = form.LastPortOfCall,
            NextPort = form.NextPortOfCall,
            Purpose = form.PurposeOfCall,
            Status = "EXPECTED"
        };
        
        await _database.PortCalls.AddAsync(portCall);
        
        // Process parallel clearances
        await Task.WhenAll(
            ProcessCustomsClearance(form, portCall.PortCallId),
            ProcessImmigrationClearance(form, portCall.PortCallId),
            ProcessHealthClearance(form, portCall.PortCallId),
            ProcessPortAuthority(form, portCall.PortCallId)
        );
        
        await _database.SaveChangesAsync();
        
        return $"APPROVED - Port Call ID: {portCall.PortCallId}";
    }
}
```

### Berth Allocation

**Berth Assignment Algorithm**:
```csharp
public class BerthAllocationService
{
    public async Task<BerthAssignment> AllocateBerth(
        string vesselIMO,
        DateTime requestedTime,
        int estimatedStayHours)
    {
        var vessel = await _vesselRegistry.FindByIMO(vesselIMO);
        
        // Find suitable berths (based on vessel characteristics)
        var suitableBerths = await _database.Berths
            .Where(b => b.MaxLength >= vessel.LengthOverall
                     && b.MaxDraft >= vessel.Draft
                     && b.MaxGrossTonnage >= vessel.GrossTonnage
                     && b.TerminalType.Contains(vessel.CargoType))
            .ToListAsync();
        
        // Check availability
        var availableBerths = new List<BerthAvailability>();
        
        foreach (var berth in suitableBerths)
        {
            var conflicts = await _database.BerthAssignments
                .Where(a => a.BerthCode == berth.Code
                         && a.DepartureTime > requestedTime
                         && a.ArrivalTime < requestedTime.AddHours(estimatedStayHours))
                .CountAsync();
            
            if (conflicts == 0)
            {
                // Calculate berth score (preference based on efficiency)
                var score = CalculateBerthScore(berth, vessel);
                
                availableBerths.Add(new BerthAvailability
                {
                    Berth = berth,
                    Score = score
                });
            }
        }
        
        if (!availableBerths.Any())
        {
            // No berths available - vessel must wait at anchorage
            return new BerthAssignment
            {
                Status = "WAITING",
                AnchorageAssigned = true,
                EstimatedBerthTime = await CalculateNextAvailableSlot(suitableBerths)
            };
        }
        
        // Select best berth
        var selectedBerth = availableBerths
            .OrderByDescending(b => b.Score)
            .First()
            .Berth;
        
        // Create assignment
        var assignment = new BerthAssignment
        {
            AssignmentId = Guid.NewGuid(),
            VesselIMO = vesselIMO,
            BerthCode = selectedBerth.Code,
            ArrivalTime = requestedTime,
            DepartureTime = requestedTime.AddHours(estimatedStayHours),
            Status = "ASSIGNED",
            Services = await DetermineRequiredServices(vessel)
        };
        
        await _database.BerthAssignments.AddAsync(assignment);
        await _database.SaveChangesAsync();
        
        // Notify vessel agent
        await _notificationService.NotifyBerthAssignment(
            vessel.AgentEmail,
            assignment
        );
        
        return assignment;
    }
}
```

---

## Cargo Handling

### Loading and Unloading Operations

#### Container Handling Equipment

**Ship-to-Shore (STS) Cranes**:
- Capacity: 65-100 tons
- Reach: 24 container rows
- Height: Up to 9 high on vessel
- Speed: 30-40 moves per hour

**Rubber-Tired Gantry (RTG) Cranes**:
- Stacking height: 1-over-5 containers
- Span: 6-8 containers wide
- Speed: 20-25 moves per hour

**Reach Stackers**:
- Capacity: 45 tons
- Stacking height: 4-5 high
- Flexible operation
- Speed: 10-15 moves per hour

#### Performance Metrics

| Metric | World Class | Angola Target | Current (2025) |
|--------|-------------|---------------|----------------|
| **Vessel Turnaround Time** | 24 hours | 36 hours | 42 hours |
| **Berth Productivity** | 30+ moves/hr | 20 moves/hr | 18 moves/hr |
| **Crane Productivity** | 35+ moves/hr | 25 moves/hr | 22 moves/hr |
| **Gate Processing** | 2 min/truck | 5 min/truck | 7 min/truck |
| **Dwell Time** | 3-5 days | 5-7 days | 8 days |

### Cargo Inspection

#### Types of Inspections

**1. Physical Inspection**
- Container unpacking
- Goods examination
- Sampling (if required)
- Re-packing and sealing

**2. Documentary Inspection**
- Invoice verification
- Packing list check
- Certificate validation
- License verification

**3. Scanner Inspection**
- X-ray scanning
- Gamma ray scanning
- Non-intrusive inspection

**4. Specialized Inspection**
- Dangerous goods verification
- Temperature-controlled cargo
- Livestock and perishables
- High-value goods

```csharp
public class CargoInspectionService
{
    public async Task<InspectionResult> ScheduleInspection(
        string containerNumber,
        string declarationNumber,
        InspectionType type)
    {
        // Get container location
        var location = await _containerService.LocateContainer(containerNumber);
        
        if (!location.AvailableForInspection)
        {
            return InspectionResult.Failed("Container not available for inspection");
        }
        
        // Find available inspector
        var inspector = await FindAvailableInspector(type);
        
        if (inspector == null)
        {
            return InspectionResult.Delayed("No inspectors available. Rescheduling...");
        }
        
        // Create inspection order
        var inspection = new InspectionOrder
        {
            InspectionId = Guid.NewGuid(),
            ContainerNumber = containerNumber,
            DeclarationNumber = declarationNumber,
            InspectorId = inspector.Id,
            ScheduledTime = DateTime.UtcNow.AddHours(2),
            Type = type,
            Location = location.Terminal,
            Status = "SCHEDULED"
        };
        
        await _database.InspectionOrders.AddAsync(inspection);
        
        // Notify terminal to prepare container
        await _terminalService.PrepareForInspection(new InspectionPreparation
        {
            ContainerNumber = containerNumber,
            InspectionTime = inspection.ScheduledTime,
            InspectionArea = "CUSTOMS_EXAMINATION_AREA",
            SpecialEquipment = type == InspectionType.Physical 
                ? new[] { "Forklift", "Pallet jack", "Scales" }
                : new[] { "Scanner" }
        });
        
        // Notify declarant
        await _notificationService.NotifyInspectionScheduled(
            declarationNumber,
            inspection.ScheduledTime
        );
        
        await _database.SaveChangesAsync();
        
        return InspectionResult.Success(inspection.InspectionId);
    }
    
    public async Task<InspectionReport> RecordInspectionResults(
        Guid inspectionId,
        InspectionFindings findings)
    {
        var inspection = await _database.InspectionOrders
            .FirstOrDefaultAsync(i => i.InspectionId == inspectionId);
        
        if (inspection == null)
        {
            throw new NotFoundException("Inspection order not found");
        }
        
        // Update inspection record
        inspection.Status = "COMPLETED";
        inspection.CompletedTime = DateTime.UtcNow;
        inspection.Result = findings.Compliant ? "COMPLIANT" : "NON_COMPLIANT";
        
        // Create detailed report
        var report = new InspectionReport
        {
            ReportId = Guid.NewGuid(),
            InspectionId = inspectionId,
            Inspector = inspection.InspectorId,
            ReportTime = DateTime.UtcNow,
            Findings = findings.Description,
            Photographs = findings.Photos,
            Samples = findings.SamplesTaken,
            Discrepancies = findings.Discrepancies,
            Recommendation = findings.Compliant 
                ? "RELEASE_APPROVED" 
                : "RELEASE_DENIED",
            FollowUpRequired = !findings.Compliant
        };
        
        await _database.InspectionReports.AddAsync(report);
        await _database.SaveChangesAsync();
        
        // Update JUL declaration
        await _julIntegrationService.UpdateInspectionStatus(
            inspection.DeclarationNumber,
            report.Recommendation
        );
        
        return report;
    }
}
```

---

## Warehouse and Storage

### Types of Warehouses

#### 1. Customs Bonded Warehouses

**Type I - Public Warehouse**:
- Owned/operated by government or licensed operator
- Available to all importers
- General cargo storage
- Duty suspension until withdrawal

**Type II - Private Warehouse**:
- Owned/operated by specific importer
- Company's own goods only
- Specific commodity focus
- AEO qualification often required

#### 2. Free Trade Zones

**Benefits**:
- 100% tax exemption
- No import duties
- VAT exemption
- Free repatriation of profits
- Streamlined procedures

**Activities Allowed**:
- Storage and warehousing
- Light manufacturing
- Assembly operations
- Packaging and labeling
- Quality control
- Distribution

#### 3. Cold Storage

**Temperature Zones**:
- **Chilled**: 0°C to 10°C (fruits, vegetables, pharmaceuticals)
- **Frozen**: -18°C to -25°C (meat, fish, frozen goods)
- **Deep Frozen**: Below -40°C (special products)

### Warehouse Management System Integration

```csharp
public class WarehouseManagementService
{
    public async Task<WarehouseEntry> ReceiveCargoInWarehouse(
        string warehouseCode,
        string blNumber,
        List<CargoItem> items)
    {
        // Validate warehouse
        var warehouse = await _database.Warehouses
            .FirstOrDefaultAsync(w => w.Code == warehouseCode);
        
        if (warehouse == null || warehouse.Status != "ACTIVE")
        {
            throw new Exception("Warehouse not available");
        }
        
        // Check capacity
        var totalVolume = items.Sum(i => i.VolumeM3);
        var availableSpace = warehouse.TotalCapacityM3 - warehouse.OccupiedCapacityM3;
        
        if (totalVolume > availableSpace)
        {
            throw new Exception($"Insufficient space. Available: {availableSpace}m³, Required: {totalVolume}m³");
        }
        
        // Create warehouse entry
        var entry = new WarehouseEntry
        {
            EntryId = Guid.NewGuid(),
            WarehouseCode = warehouseCode,
            BLNumber = blNumber,
            EntryDate = DateTime.UtcNow,
            ExpectedExitDate = DateTime.UtcNow.AddDays(30),
            CustomsStatus = "UNDER_BOND",
            Items = items.Select(i => new WarehouseItem
            {
                ItemId = Guid.NewGuid(),
                Description = i.Description,
                HSCode = i.HSCode,
                Quantity = i.Quantity,
                Unit = i.Unit,
                PackageCount = i.Packages,
                Weight = i.WeightKg,
                Volume = i.VolumeM3,
                StorageLocation = AssignStorageLocation(warehouse, i),
                DutyValue = i.CustomsValue,
                DutySuspended = true
            }).ToList()
        };
        
        await _database.WarehouseEntries.AddAsync(entry);
        
        // Update warehouse capacity
        warehouse.OccupiedCapacityM3 += totalVolume;
        await _database.SaveChangesAsync();
        
        // Notify JUL system
        await _julIntegrationService.NotifyWarehouseStorage(new WarehouseStorageNotification
        {
            EntryId = entry.EntryId.ToString(),
            BLNumber = blNumber,
            WarehouseCode = warehouseCode,
            StorageDate = entry.EntryDate,
            DutySuspensionAmount = entry.Items.Sum(i => i.DutyValue)
        });
        
        return entry;
    }
    
    public async Task<WithdrawalAuthorization> WithdrawFromWarehouse(
        Guid entryId,
        string declarationNumber,
        List<Guid> itemIds)
    {
        var entry = await _database.WarehouseEntries
            .Include(e => e.Items)
            .FirstOrDefaultAsync(e => e.EntryId == entryId);
        
        if (entry == null)
        {
            throw new NotFoundException("Warehouse entry not found");
        }
        
        // Verify customs clearance
        var declaration = await _julIntegrationService
            .GetDeclarationStatus(declarationNumber);
        
        if (declaration.Status != "CLEARED")
        {
            throw new Exception("Goods not cleared by customs");
        }
        
        // Verify payment
        if (declaration.PaymentStatus != "PAID")
        {
            throw new Exception("Duties and taxes not paid");
        }
        
        // Create withdrawal record
        var withdrawal = new WarehouseWithdrawal
        {
            WithdrawalId = Guid.NewGuid(),
            EntryId = entryId,
            DeclarationNumber = declarationNumber,
            WithdrawalDate = DateTime.UtcNow,
            WithdrawnItems = itemIds,
            AuthorizedBy = declaration.ClearanceOfficer
        };
        
        await _database.WarehouseWithdrawals.AddAsync(withdrawal);
        
        // Mark items as withdrawn
        foreach (var itemId in itemIds)
        {
            var item = entry.Items.First(i => i.ItemId == itemId);
            item.WithdrawnDate = DateTime.UtcNow;
            item.DutySuspended = false;
        }
        
        // Update warehouse capacity
        var freedVolume = entry.Items
            .Where(i => itemIds.Contains(i.ItemId))
            .Sum(i => i.Volume);
        
        var warehouse = await _database.Warehouses
            .FirstOrDefaultAsync(w => w.Code == entry.WarehouseCode);
        
        warehouse.OccupiedCapacityM3 -= freedVolume;
        
        await _database.SaveChangesAsync();
        
        return new WithdrawalAuthorization
        {
            WithdrawalId = withdrawal.WithdrawalId,
            AuthorizationNumber = $"WA-{withdrawal.WithdrawalId.ToString()[..8].ToUpper()}",
            ValidUntil = DateTime.UtcNow.AddDays(7),
            ExitGate = warehouse.ExitGate
        };
    }
}
```

---

## Transport and Delivery

### Last-Mile Delivery Process

```
Container Released from Port
        ↓
Truck Booking & Gate Appointment
        ↓
Gate-In: Collect Container
        ↓
Transport to Destination
        ↓
Unloading at Consignee Premises
        ↓
Empty Container Return
        ↓
Gate-Out: Return Empty Container
```

### Truck Management System

```typescript
interface TruckBooking {
  bookingId: string;
  containerNumber: string;
  blNumber: string;
  truckLicensePlate: string;
  driverName: string;
  driverLicense: string;
  appointmentTime: Date;
  terminal: string;
  deliveryAddress: string;
  estimatedReturnTime: Date;
}

class TruckAppointmentSystem {
  async bookGateAppointment(booking: TruckBooking): Promise<string> {
    // Verify container is cleared
    const clearanceStatus = await this.julService
      .getContainerClearanceStatus(booking.containerNumber);
    
    if (clearanceStatus !== 'CLEARED') {
      throw new Error('Container not cleared for pickup');
    }
    
    // Check container availability
    const container = await this.containerService
      .locateContainer(booking.containerNumber);
    
    if (!container.availableForDelivery) {
      throw new Error('Container not available for pickup');
    }
    
    // Find available time slot
    const slot = await this.findAvailableSlot(
      booking.terminal,
      booking.appointmentTime
    );
    
    // Create appointment
    const appointment = await this.db.appointments.create({
      bookingId: this.generateBookingId(),
      containerNumber: booking.containerNumber,
      truckPlate: booking.truckLicensePlate,
      driver: booking.driverName,
      appointmentTime: slot.time,
      gateNumber: slot.gate,
      status: 'CONFIRMED'
    });
    
    // Send confirmation SMS
    await this.notificationService.sendSMS(
      booking.driverPhone,
      `Appointment confirmed: ${slot.time.toLocaleString()}. ` +
      `Gate: ${slot.gate}. Booking: ${appointment.bookingId}`
    );
    
    return appointment.bookingId;
  }
}
```

---

## Port Community System

### Services Provided

1. **Vessel Management**
   - Arrival notifications
   - Berth allocation
   - Departure clearance

2. **Cargo Tracking**
   - Container location
   - Real-time status
   - Event notifications

3. **Documentation**
   - Digital document exchange
   - Electronic signatures
   - Archive and retrieval

4. **Billing and Payments**
   - Unified invoicing
   - Multi-channel payment
   - Account management

5. **Statistics and Reports**
   - Port performance metrics
   - Cargo throughput
   - Vessel statistics

---

## Integration with Single Window (JUL)

### Data Flow

```
JUL (Single Window)
        ↕
Port Community System
        ↕
Terminal Operating System
        ↕
Warehouse Management System
        ↕
Truck Management System
```

### API Integration

```csharp
public class JULPortIntegration
{
    [HttpPost("api/v1/jul/cargo-arrival")]
    public async Task<IActionResult> NotifyCargoArrival(
        [FromBody] CargoArrivalMessage message)
    {
        // Called by Port System when cargo arrives
        
        var notification = new JULNotification
        {
            Type = "CARGO_ARRIVAL",
            ContainerNumber = message.ContainerNumber,
            BLNumber = message.BLNumber,
            ArrivalTime = message.Timestamp,
            Location = message.Terminal,
            ConsigneeNIF = message.ConsigneeNIF
        };
        
        await _julMessageBus.Publish(notification);
        
        return Ok(new { status = "NOTIFIED" });
    }
    
    [HttpGet("api/v1/jul/clearance-status/{containerNumber}")]
    public async Task<IActionResult> GetClearanceStatus(string containerNumber)
    {
        // Called by Port System to check if container can be released
        
        var status = await _julService.GetContainerStatus(containerNumber);
        
        return Ok(new
        {
            containerNumber,
            customsStatus = status.CustomsCleared ? "CLEARED" : "PENDING",
            paymentStatus = status.DutiesPaid ? "PAID" : "UNPAID",
            releaseAuthorized = status.ReleaseAuthorized,
            restrictions = status.HoldReasons
        });
    }
}
```

---

**Last Updated**: January 1, 2026  
**Version**: 1.0  
**Status**: Production Ready

[Back to Single Window Overview](../single-window/overview.md) | [Next: Implementation Guides →](../implementation/overview.md)
