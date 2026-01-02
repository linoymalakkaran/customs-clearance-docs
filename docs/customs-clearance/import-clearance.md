# Import Clearance - Complete End-to-End Process

**Detailed Guide for Sea, Air, and Land Cargo Imports**

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Arrival Phase](#pre-arrival-phase)
3. [Arrival Phase](#arrival-phase)
4. [Declaration Phase](#declaration-phase)

---

## Overview

### What is Import Clearance?

Import clearance is the process of obtaining customs authorization to bring goods into Angola's customs territory. It involves:
- Declaration of goods to customs
- Payment of applicable duties and taxes
- Verification of compliance with import regulations
- Obtaining release authorization

### Legal Basis

- **Código Aduaneiro de Angola** (Angola Customs Code)
- **Regulamento do Código Aduaneiro** (Customs Code Regulation)
- **Pauta Aduaneira** (Tariff Schedule)
- **WCO Revised Kyoto Convention**
- **WTO Trade Facilitation Agreement**

### Timeline Summary

**WCO Time Release Study (TRS) Benchmarks**: Angola measures clearance times against international best practices.

| Phase | Duration | Responsible Party | WCO Target |
|-------|----------|-------------------|------------|
| Pre-arrival Processing | 1-24 hours before arrival | Importer/Agent | 24-48h before |
| Cargo Discharge | 2-6 hours | Carrier/Port | 3-4 hours |
| Declaration Submission | 2-4 hours | Importer/Agent | 1-2 hours |
| Customs Assessment | 2-8 hours | AGT (Customs) | 2-4 hours |
| Payment | 1-2 hours | Importer | Under 1 hour |
| Inspection (if required) | 4-12 hours | AGT Inspector | 6-8 hours |
| Release Authorization | 1-2 hours | AGT | Under 1 hour |
| **Total (Green Channel)** | **6-14 hours** | **All Parties** | **Under 6 hours** |
| **Total (Yellow Channel)** | **1-2 days** | **All Parties** | **Under 12 hours** |
| **Total (with Inspection)** | **2-3 days** | **All Parties** | **Under 24 hours** |

**Express/Low-Value Shipments**: Target immediate release upon arrival for shipments under $200.

---

## Pre-Arrival Phase

### Overview of Pre-Arrival Processing

Pre-arrival processing is a WCO best practice that allows customs to assess risk and expedite clearance before goods physically arrive. This significantly reduces cargo dwell time at ports.

**Key Benefits**:
- Goods can be released immediately upon arrival
- Reduced port congestion
- Lower storage costs for importers
- Improved supply chain efficiency

**Time Release Study**: Angola targets 6-hour average release time for green channel goods through pre-arrival processing.

### Step 1: Cargo Manifest Submission

**Who**: Carrier (Shipping Line, Airline, or Trucking Company)
**When**: **Minimum 24 hours before cargo arrival** (48 hours recommended for sea freight)
**System**: SINTECE/JUL Portal

**Process**:
1. Carrier logs into JUL portal
2. Submits electronic cargo manifest
3. Includes:
   - Vessel/Flight/Vehicle details
   - Bill of Lading numbers
   - Consignee information
   - Commodity descriptions
   - Weight and package counts
   - Port of loading

**Data Format**: UN/EDIFACT CUSCAR message or XML

```csharp
public class CargoManifestSubmission
{
    public async Task<ManifestResult> SubmitManifest(CargoManifest manifest)
    {
        // Validate manifest data
        var validation = await _validator.ValidateManifest(manifest);
        if (!validation.IsValid)
        {
            return ManifestResult.Failed(validation.Errors);
        }
        
        // Check vessel/flight registration
        var transport = await _database.TransportModes
            .FirstOrDefaultAsync(t => t.IMONumber == manifest.IMONumber
                                   || t.FlightNumber == manifest.FlightNumber);
        
        if (transport == null)
        {
            return ManifestResult.Failed("Transport not registered");
        }
        
        // Create manifest in system
        var manifestEntity = new ManifestEntity
        {
            ManifestId = Guid.NewGuid(),
            ManifestNumber = GenerateManifestNumber(),
            TransportId = transport.Id,
            ArrivalDate = manifest.EstimatedArrival,
            PortOfLoading = manifest.PortOfLoading,
            PortOfDischarge = manifest.PortOfDischarge,
            TotalBLs = manifest.BillsOfLading.Count,
            TotalPackages = manifest.BillsOfLading.Sum(b => b.Packages),
            TotalWeight = manifest.BillsOfLading.Sum(b => b.Weight),
            SubmissionDateTime = DateTime.UtcNow,
            Status = "SUBMITTED"
        };
        
        await _database.Manifests.AddAsync(manifestEntity);
        
        // Create individual B/L entries
        foreach (var bl in manifest.BillsOfLading)
        {
            var blEntity = new BillOfLadingEntity
            {
                BLNumber = bl.BLNumber,
                ManifestId = manifestEntity.ManifestId,
                ConsigneeName = bl.Consignee.Name,
                ConsigneeNIF = bl.Consignee.NIF,
                Description = bl.Description,
                Packages = bl.Packages,
                Weight = bl.Weight,
                ContainerNumbers = bl.Containers
            };
            
            await _database.BillsOfLading.AddAsync(blEntity);
        }
        
        await _database.SaveChangesAsync();
        
        // Send confirmation to carrier
        await _notificationService.NotifyCarrier(
            manifest.CarrierEmail,
            $"Manifest {manifestEntity.ManifestNumber} successfully submitted"
        );
        
        return ManifestResult.Success(manifestEntity.ManifestNumber);
    }
}
```

**Documents Required**:
- Master Bill of Lading (for each shipment)
- Container list (for containerized cargo)
- Dangerous goods declaration (if applicable)
- IMO/IATA registration certificates

### Step 2: Pre-Arrival Declaration

**Who**: Importer or Customs Broker
**When**: Before cargo arrival (recommended 24 hours before)
**System**: JUL Portal

**Benefits**:
- Faster clearance upon arrival
- Early risk assessment
- Advance notification of requirements
- Reduced dwell time in port

**Process**:
1. Importer/broker accesses JUL portal
2. Selects "Pre-Arrival Declaration"
3. Searches for cargo using B/L number
4. Completes declaration form (WCO Data Model)
5. Uploads supporting documents
6. Submits for preliminary assessment

```typescript
// Angular TypeScript - Pre-Arrival Declaration Form
export class PreArrivalDeclarationComponent implements OnInit {
  declarationForm: FormGroup;
  billOfLadingInfo: BillOfLading;
  
  async searchBillOfLading(blNumber: string) {
    const result = await this.manifestService.findByBLNumber(blNumber);
    
    if (result.found) {
      this.billOfLadingInfo = result.data;
      this.prefillDeclaration();
    } else {
      this.showError('Bill of Lading not found in manifest');
    }
  }
  
  prefillDeclaration() {
    this.declarationForm.patchValue({
      consigneeName: this.billOfLadingInfo.consigneeName,
      consigneeNIF: this.billOfLadingInfo.consigneeNIF,
      blNumber: this.billOfLadingInfo.blNumber,
      arrivalDate: this.billOfLadingInfo.estimatedArrival,
      portOfLoading: this.billOfLadingInfo.portOfLoading,
      totalPackages: this.billOfLadingInfo.packages,
      grossWeight: this.billOfLadingInfo.weight
    });
  }
  
  async submitPreArrival() {
    if (this.declarationForm.invalid) {
      this.showValidationErrors();
      return;
    }
    
    const declaration = {
      type: 'PRE_ARRIVAL',
      blNumber: this.declarationForm.get('blNumber').value,
      consignee: this.declarationForm.get('consignee').value,
      goodsItems: this.declarationForm.get('goodsItems').value,
      documents: this.uploadedDocuments,
      submissionTime: new Date()
    };
    
    try {
      const result = await this.customsService.submitPreArrival(declaration);
      
      this.showSuccess(
        `Pre-arrival declaration ${result.declarationNumber} submitted. ` +
        `Preliminary risk assessment: ${result.riskChannel}`
      );
      
      if (result.riskChannel === 'GREEN') {
        this.showInfo('Your cargo is eligible for fast-track clearance!');
      }
      
    } catch (error) {
      this.showError('Submission failed: ' + error.message);
    }
  }
}
```

**Data Required**:
- Importer details (name, NIF, address)
- Seller/exporter details
- Country of origin
- Description of goods
- HS code (6-digit minimum)
- Quantity and value
- Incoterms
- Currency
- Freight and insurance costs

**Documents to Upload**:
- Commercial invoice (PDF)
- Packing list (PDF)
- Bill of Lading (scanned copy)
- Certificate of origin (if available)
- Import license (for restricted goods)
- Other certificates (if applicable)

### Step 3: Preliminary Risk Assessment

**Who**: ASYCUDA system (automated)
**When**: Immediately after pre-arrival submission
**System**: ASYCUDA Risk Engine

**Assessment Factors**:
- Importer compliance history
- Commodity risk profile
- Value consistency
- Origin country risk
- Completeness of declaration
- Document authenticity indicators
- Payment history

**Risk Scoring**:
```csharp
public class RiskAssessmentEngine
{
    public async Task<RiskAssessment> AssessDeclaration(Declaration declaration)
    {
        var riskScore = 0;
        var riskFactors = new List<string>();
        
        // Factor 1: Importer history (40% weight)
        var importerRisk = await CalculateImporterRisk(declaration.ImporterNIF);
        riskScore += (int)(importerRisk * 40);
        if (importerRisk > 0.5) riskFactors.Add("Importer compliance issues");
        
        // Factor 2: Commodity risk (30% weight)
        var commodityRisk = await CalculateCommodityRisk(declaration.HSCode);
        riskScore += (int)(commodityRisk * 30);
        if (commodityRisk > 0.6) riskFactors.Add("High-risk commodity");
        
        // Factor 3: Value assessment (20% weight)
        var valueRisk = await AssessValueAnomaly(declaration);
        riskScore += (int)(valueRisk * 20);
        if (valueRisk > 0.5) riskFactors.Add("Value inconsistency detected");
        
        // Factor 4: Origin risk (10% weight)
        var originRisk = GetCountryRiskScore(declaration.OriginCountry);
        riskScore += (int)(originRisk * 10);
        if (originRisk > 0.7) riskFactors.Add("High-risk origin country");
        
        // Determine channel based on score
        string channel;
        if (riskScore < 20)
            channel = "GREEN"; // Automatic release
        else if (riskScore < 50)
            channel = "YELLOW"; // Documentary check
        else if (riskScore < 75)
            channel = "ORANGE"; // Physical inspection
        else
            channel = "RED"; // Detailed examination
        
        return new RiskAssessment
        {
            Score = riskScore,
            Channel = channel,
            Factors = riskFactors,
            AssessmentTime = DateTime.UtcNow,
            RecommendedActions = GetRecommendedActions(channel)
        };
    }
    
    private async Task<double> CalculateImporterRisk(string nif)
    {
        var history = await _database.ImporterCompliance
            .Where(c => c.NIF == nif)
            .OrderByDescending(c => c.Date)
            .Take(12) // Last 12 months
            .ToListAsync();
        
        if (!history.Any()) return 0.5; // New importer = medium risk
        
        var violations = history.Count(h => h.HasViolation);
        var totalDeclarations = history.Sum(h => h.DeclarationsCount);
        
        if (totalDeclarations == 0) return 0.5;
        
        var violationRate = (double)violations / totalDeclarations;
        
        // Check for AEO status
        var isAEO = await _database.AEOCertifications
            .AnyAsync(a => a.CompanyNIF == nif && a.Status == "ACTIVE");
        
        if (isAEO) return 0.1; // AEO = very low risk
        
        return violationRate;
    }
}
```

**Output**: Preliminary risk channel notification to importer

---

## Arrival Phase

### Step 4: Cargo Arrival Notification

**Who**: Port/Airport Authority
**When**: Upon physical arrival
**System**: Port Community System → JUL

**Process**:
1. Vessel berths or aircraft lands
2. Port system logs arrival event
3. Automatic notification to JUL
4. Update of manifest status to "ARRIVED"
5. Notification sent to consignees

```sql
-- Trigger on cargo arrival
CREATE OR REPLACE FUNCTION notify_cargo_arrival()
RETURNS TRIGGER AS $$
BEGIN
    -- Update manifest status
    UPDATE manifests
    SET status = 'ARRIVED',
        actual_arrival = NEW.arrival_time
    WHERE manifest_id = NEW.manifest_id;
    
    -- Notify all consignees
    INSERT INTO notifications (
        recipient_nif,
        message_type,
        title,
        message,
        created_at
    )
    SELECT 
        bl.consignee_nif,
        'CARGO_ARRIVAL',
        'Your cargo has arrived',
        'B/L ' || bl.bl_number || ' arrived on ' || 
        TO_CHAR(NEW.arrival_time, 'DD/MM/YYYY HH24:MI'),
        NOW()
    FROM bills_of_lading bl
    WHERE bl.manifest_id = NEW.manifest_id;
    
    -- Send SMS notifications for high-priority cargo
    PERFORM send_sms_notification(
        bl.consignee_phone,
        'JUL: Your cargo ' || bl.bl_number || ' has arrived. Please submit final declaration.'
    )
    FROM bills_of_lading bl
    WHERE bl.manifest_id = NEW.manifest_id
    AND bl.priority = 'HIGH';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Step 5: Cargo Discharge and Temporary Storage

**Who**: Port/Terminal Operator
**When**: Within 24-48 hours of arrival
**Location**: Port terminal or airport cargo terminal

**Process**:
1. Cargo unloaded from vessel/aircraft
2. Placed in temporary storage area
3. Storage location recorded in system
4. Inventory count verified against manifest
5. Damage report (if any)

**Storage Limits**:
- **Free Time**: 5 days (sea), 3 days (air)
- **After Free Time**: Storage charges apply
- **Maximum Storage**: 30 days before auction/destruction

```csharp
public class CargoStorageManager
{
    public async Task RecordCargoStorage(string blNumber, string storageLocation)
    {
        var bl = await _database.BillsOfLading
            .Include(b => b.Manifest)
            .FirstOrDefaultAsync(b => b.BLNumber == blNumber);
        
        if (bl == null)
        {
            throw new NotFoundException("Bill of Lading not found");
        }
        
        // Record storage event
        var storage = new CargoStorage
        {
            BLNumber = blNumber,
            StorageLocation = storageLocation,
            EntryTime = DateTime.UtcNow,
            FreeTimeExpiry = CalculateFreeTimeExpiry(bl.Manifest.TransportMode),
            Status = "IN_STORAGE"
        };
        
        await _database.CargoStorage.AddAsync(storage);
        await _database.SaveChangesAsync();
        
        // Notify consignee
        await _notificationService.NotifyConsignee(
            bl.ConsigneeNIF,
            $"Your cargo (B/L {blNumber}) is now in storage at {storageLocation}. " +
            $"Free time expires: {storage.FreeTimeExpiry:dd/MM/yyyy HH:mm}"
        );
    }
    
    private DateTime CalculateFreeTimeExpiry(string transportMode)
    {
        var freeDays = transportMode switch
        {
            "SEA" => 5,
            "AIR" => 3,
            "ROAD" => 2,
            _ => 3
        };
        
        return DateTime.UtcNow.AddDays(freeDays);
    }
    
    public async Task<StorageCharges> CalculateStorageCharges(string blNumber)
    {
        var storage = await _database.CargoStorage
            .FirstOrDefaultAsync(s => s.BLNumber == blNumber);
        
        if (storage == null || storage.ExitTime.HasValue)
        {
            return new StorageCharges { Amount = 0 };
        }
        
        var now = DateTime.UtcNow;
        
        // No charges during free time
        if (now <= storage.FreeTimeExpiry)
        {
            return new StorageCharges 
            { 
                Amount = 0,
                FreeTimeRemaining = storage.FreeTimeExpiry - now
            };
        }
        
        // Calculate chargeable days
        var chargeableDays = (now - storage.FreeTimeExpiry).TotalDays;
        var rate = GetStorageRate(storage.CargoType, storage.StorageLocation);
        
        var charges = new StorageCharges
        {
            Days = (int)Math.Ceiling(chargeableDays),
            DailyRate = rate,
            Amount = rate * (decimal)Math.Ceiling(chargeableDays),
            FreeTimeExpired = storage.FreeTimeExpiry
        };
        
        return charges;
    }
}
```

---

## Declaration Phase

### Step 6: Final Declaration Submission

**Who**: Importer or Customs Broker
**When**: After cargo arrival (or pre-arrival if already done)
**System**: JUL Portal → ASYCUDA

**Declaration Types**:
- **IM4**: Standard import (permanent)
- **IM5**: Temporary admission
- **IM7**: Diplomatic imports
- **IM9**: Re-import after processing

**Required Data** (WCO Data Model 3.10 compliant):

#### Header Information
- Declaration number (auto-generated)
- Declaration type and version
- Importer (consignee) details
- Customs broker details (if applicable)
- Total packages, weight, value
- Currency and exchange rate
- Customs office
- Declaration date

#### Goods Item Details (for each item)
- Item sequence number
- HS Code (8 digits)
- Description
- Origin country
- Quantity and unit
- Invoice value
- Freight costs (pro-rated)
- Insurance costs (pro-rated)
- Statistical value (CIF)
- Net weight and gross weight

#### Party Information
- Seller/exporter
- Manufacturer (if different)
- Freight forwarder
- Bank (for payment)

#### Transport Details
- Mode of transport
- Means of transport identification
- Place of loading
- Port/airport of arrival
- Container numbers (if applicable)

#### Supporting Documents
- Commercial invoice
- Packing list
- Bill of Lading/Air Waybill
- Certificate of origin
- Import license (if required)
- Health/phytosanitary certificates (if required)
- Other permits

**Code Example** (end of document)

---

**Last Updated**: January 1, 2026  
**Version**: 1.0  
**Status**: Draft (content continues to be expanded)
