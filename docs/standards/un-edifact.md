# UN/EDIFACT Standards

**Electronic Data Interchange For Administration, Commerce and Transport**

---

## Table of Contents

1. [Introduction](#introduction)
2. [EDIFACT Message Structure](#edifact-message-structure)
3. [Customs Messages](#customs-messages)
4. [CUSDEC - Customs Declaration](#cusdec---customs-declaration)
5. [CUSRES - Customs Response](#cusres---customs-response)
6. [JUL Implementation](#jul-implementation)
7. [Best Practices](#best-practices)

---

## Introduction

### What is UN/EDIFACT?

**UN/EDIFACT** (United Nations Electronic Data Interchange For Administration, Commerce and Transport) is an international standard for electronic data interchange (EDI) developed by the United Nations. It provides a standardized format for the exchange of business documents and messages between computer systems.

### Purpose in Customs

For customs operations, UN/EDIFACT provides:
- **Standardized Messages**: Common format for customs declarations and responses
- **International Compatibility**: Cross-border data exchange
- **Automation**: Machine-readable messages for automated processing
- **Efficiency**: Reduced manual data entry and errors

### JUL Context

In the JUL system, UN/EDIFACT is used for:
- **ASYCUDA Integration**: Communication with Angola Customs Authority (AGT)
- **CUSDEC Messages**: Sending customs declarations to ASYCUDA
- **CUSRES Messages**: Receiving customs responses and assessments
- **CUSCAR Messages**: Cargo manifest reporting (future)

---

## EDIFACT Message Structure

### Basic Components

Every EDIFACT message consists of:

```
UNH - Message Header
BGM - Beginning of Message
[Message-specific segments]
UNT - Message Trailer
```

### Segment Structure

Each segment follows this format:
```
TAG+Data Element+Data Element+Data Element'
```

**Example:**
```
BGM+340+DU2025001234+9'
```

Where:
- `BGM` = Segment tag (Beginning of Message)
- `340` = Message type code (Customs Declaration)
- `DU2025001234` = Declaration reference
- `9` = Message function (Original)
- `'` = Segment terminator

### Data Element Separators

| Character | Purpose | Example |
|-----------|---------|---------|
| `+` | Separates data elements | `NAD+CN+123456789'` |
| `:` | Separates components within an element | `C001:HS:2022'` |
| `'` | Terminates a segment | End of line |
| `?` | Escape character | `LTD?+COMPANY` (displays LTD+COMPANY) |

### Complete Message Envelope

```
UNA:+.? '                                    -- Service String Advice
UNB+UNOC:3+SENDER+RECEIVER+20251231:1200++REF' -- Interchange Header
UNH+1+CUSDEC:D:01B:UN:EDEC01'               -- Message Header
[Message Content]
UNT+150+1'                                   -- Message Trailer
UNZ+1+REF'                                   -- Interchange Trailer
```

---

## Customs Messages

### CUSDEC - Customs Declaration Message

**Purpose**: Submit customs declarations to customs authority  
**Version**: D.01B (EDEC01 subset for customs)  
**Direction**: Trader/Agent → Customs Authority  

**Usage in JUL**:
- Import declarations (IM)
- Export declarations (EX)
- Transit declarations (T1, T2)

### CUSRES - Customs Response Message

**Purpose**: Receive customs processing results  
**Version**: D.01B (EDEC01 subset)  
**Direction**: Customs Authority → Trader/Agent  

**Usage in JUL**:
- Assessment results with calculated duties
- Clearance authorization
- Inspection requirements
- Rejection reasons

### CUSCAR - Customs Cargo Report

**Purpose**: Submit cargo manifest information  
**Version**: D.01B  
**Direction**: Carrier → Customs Authority  

**Usage in JUL** (Future):
- Pre-arrival manifest submission
- Cargo consolidation reports

### Other Relevant Messages

- **BANSTA**: Banking Status Message (payment confirmations)
- **CONTRL**: Syntax and Service Report Message (acknowledgments)
- **APERAK**: Application Error and Acknowledgment Message

---

## CUSDEC - Customs Declaration

### Message Structure

```
UNH - Message Header
BGM - Beginning of Message
DTM - Date/Time/Period (multiple occurrences)
LOC - Place/Location Identification
RFF - Reference (multiple occurrences)

-- Party Information Loop
NAD - Name and Address (Declarant, Consignee, etc.)
    CTA - Contact Information
    COM - Communication Contact

-- Goods Item Loop (repeats for each item)
LIN - Line Item
    IMD - Item Description
    MEA - Measurements (weights, quantities)
    QTY - Quantity
    MOA - Monetary Amount (values, duties)
    TAX - Duty/Tax/Fee Details
    DOC - Document/Message Details
    RFF - Reference
    PAC - Package
    GIR - Related Identification Numbers
    
-- Transport Equipment Loop
EQD - Equipment Details (containers)
    SEL - Seal Number

UNT - Message Trailer
```

### Key Segments Explained

#### BGM - Beginning of Message
```
BGM+340+DU2025001234+9'
```
- **340**: Customs Declaration message type
- **DU2025001234**: Declaration reference number
- **9**: Original message (not a change or deletion)

#### DTM - Date/Time/Period
```
DTM+137:20251231:102'
```
- **137**: Date/time qualifier (Document issue date)
- **20251231**: Date in YYYYMMDD format
- **102**: Format code (CCYYMMDD)

**Common Date Qualifiers**:
- **137**: Document date/time/period
- **178**: Acceptance date/time
- **182**: Departure date/time
- **186**: Arrival date/time

#### LOC - Place/Location
```
LOC+89+AO:LAD:139:6+LUANDA'
```
- **89**: Location qualifier (Place of loading)
- **AO**: Country code (Angola)
- **LAD**: Location code (Luanda Airport - UN/LOCODE)
- **139**: Location identification code
- **6**: UN/LOCODE
- **LUANDA**: Location name

#### NAD - Name and Address
```
NAD+CN+123456789012::91++ACME IMPORTERS LDA+RUA DA EMPRESA 123+LUANDA++12345+AO'
```
- **CN**: Party function (Consignee)
- **123456789012::91**: Party ID with qualifier (91 = Tax ID)
- **ACME IMPORTERS LDA**: Party name
- **RUA DA EMPRESA 123**: Street address
- **LUANDA**: City
- **12345**: Postal code
- **AO**: Country code

**Common Party Functions**:
- **CN**: Consignee (Importer)
- **CZ**: Consignor (Exporter)
- **DE**: Declarant
- **AF**: Agent/Representative
- **CA**: Carrier
- **IM**: Importer
- **EX**: Exporter

#### LIN - Line Item
```
LIN+1++0901.21:HS'
```
- **1**: Line item number (sequence)
- **0901.21**: HS commodity code
- **HS**: Code list (Harmonized System)

#### IMD - Item Description
```
IMD+F++:::ROASTED COFFEE BEANS'
```
- **F**: Free-form (full description)
- **ROASTED COFFEE BEANS**: Goods description

#### MEA - Measurements
```
MEA+AAE+WT+KGM:1000.50'
MEA+AAE+AAB+KGM:950.00'
```
- **AAE**: Measurement application (Item level)
- **WT**: Measurement type (Weight)
- **AAB**: Gross weight
- **KGM**: Unit of measure (Kilograms)
- **1000.50**: Measurement value

#### MOA - Monetary Amount
```
MOA+203:25000.00:AOA'
MOA+128:24500.00:AOA'
```
- **203**: Amount type (Invoice value)
- **128**: Customs value
- **25000.00**: Amount
- **AOA**: Currency code (Angolan Kwanza)

#### TAX - Duty/Tax/Fee
```
TAX+7+VAT+++:::14+:::2+3430.00'
```
- **7**: Duty/tax qualifier (Tax)
- **VAT**: Tax type
- **14**: Tax rate percentage
- **2**: Category (Standard rate)
- **3430.00**: Tax amount

#### DOC - Document
```
DOC+380+INV2024-123::91'
```
- **380**: Document type (Commercial Invoice)
- **INV2024-123**: Document number
- **91**: Issuer (Tax identification)

**Common Document Types**:
- **380**: Commercial Invoice
- **705**: Packing List
- **861**: Certificate of Origin
- **952**: Import License
- **N325**: Bill of Lading

---

## CUSRES - Customs Response

### Message Structure

```
UNH - Message Header
BGM - Beginning of Message
DTM - Date/Time/Period
RFF - Reference (Original declaration reference)

-- Response Details
CUX - Currencies
ERC - Application Error Information (if errors)
FTX - Free Text (Additional information)

-- Assessment Loop (per declaration/item)
DOC - Document/Message Details
DTM - Assessment Date
MOA - Monetary Amounts (duties, taxes)
TAX - Duty/Tax/Fee Details

-- Status
STS - Status
FTX - Status Description

UNT - Message Trailer
```

### Response Types

#### 1. Acceptance and Assessment
```
UNH+1+CUSRES:D:01B:UN'
BGM+351+RESP001234+4'
DTM+137:20251231:102'
RFF+AWR+DU2025001234'

-- Assessment Details
MOA+128:24500.00:AOA'     -- Customs Value
TAX+7+IMP+++:::5+3+1225.00'  -- Import Duty
TAX+7+VAT+++:::14+2+3430.00' -- VAT
MOA+9:4655.00:AOA'        -- Total Tax Amount

-- Clearance Status
STS+85+5'                 -- Status: Cleared
FTX+AAO+++CLEARED FOR RELEASE - PAYMENT CONFIRMED'

UNT+25+1'
```

**Status Codes (STS+85)**:
- **5**: Cleared for release
- **6**: Conditionally released
- **7**: Held for examination
- **8**: Rejected/Refused
- **9**: Pending additional information

#### 2. Rejection Response
```
UNH+1+CUSRES:D:01B:UN'
BGM+351+RESP001235+4'
DTM+137:20251231:102'
RFF+AWR+DU2025001235'

-- Error Information
ERC+QLE:7'               -- Error: Invalid HS Code
FTX+AAO+++HS CODE 0901.99 NOT FOUND IN CURRENT TARIFF'

-- Rejection Status
STS+85+8'                -- Status: Rejected

UNT+15+1'
```

#### 3. Inspection Required
```
UNH+1+CUSRES:D:01B:UN'
BGM+351+RESP001236+4'
DTM+137:20251231:102'
RFF+AWR+DU2025001236'

-- Inspection Details
STS+85+7'                -- Status: Held for examination
FTX+AAO+++PHYSICAL INSPECTION REQUIRED - SCHEDULE APPOINTMENT'
LOC+89+AO:LAD:6::CUSTOMS EXAMINATION AREA'
DTM+178:20260101:102'    -- Inspection date

UNT+18+1'
```

---

## JUL Implementation

### ASYCUDA Integration Architecture

```
┌──────────────┐      CUSDEC        ┌────────────────────┐
│ Declaration  │ ══════════════════> │  ASYCUDA           │
│ Management   │      (SOAP/XML)     │  Integration       │
│ Service      │                     │  Service           │
│ (Port 8084)  │ <══════════════════ │  (Port 9081)       │
└──────────────┘      CUSRES        └────────────────────┘
                                             │
                                             │ SOAP/XML
                                             │ over HTTPS
                                             ▼
                                      ┌────────────────┐
                                      │   ASYCUDA      │
                                      │   (AGT)        │
                                      └────────────────┘
```

### C# Implementation Example

#### Building CUSDEC Message

```csharp
public class CusdecMessageBuilder
{
    public string BuildCusdecMessage(Declaration declaration)
    {
        var sb = new StringBuilder();
        
        // Service String Advice
        sb.AppendLine("UNA:+.? '");
        
        // Interchange Header
        sb.AppendLine($"UNB+UNOC:3+{_senderCode}+{_receiverCode}+{DateTime.Now:yyyyMMdd:HHmm}++{declaration.DeclarationId}'");
        
        // Message Header
        sb.AppendLine($"UNH+1+CUSDEC:D:01B:UN:EDEC01'");
        
        // Beginning of Message
        sb.AppendLine($"BGM+340+{declaration.FunctionalReferenceId}+9'");
        
        // Date - Declaration Date
        sb.AppendLine($"DTM+137:{declaration.DeclarationDate:yyyyMMdd}:102'");
        
        // Location - Goods Location
        if (!string.IsNullOrEmpty(declaration.GoodsLocationCode))
        {
            sb.AppendLine($"LOC+89+{declaration.GoodsLocationCode}::6'");
        }
        
        // Reference - Customs Office
        sb.AppendLine($"RFF+CUS:{declaration.DeclarationOfficeId}'");
        
        // Parties
        AddPartySegments(sb, declaration);
        
        // Goods Items
        AddGoodsItemSegments(sb, declaration.GoodsItems);
        
        // Transport Equipment
        AddTransportEquipmentSegments(sb, declaration);
        
        // Message Trailer
        var segmentCount = CountSegments(sb.ToString());
        sb.AppendLine($"UNT+{segmentCount}+1'");
        
        // Interchange Trailer
        sb.AppendLine($"UNZ+1+{declaration.DeclarationId}'");
        
        return sb.ToString();
    }
    
    private void AddPartySegments(StringBuilder sb, Declaration declaration)
    {
        // Declarant
        if (declaration.DeclarantParty != null)
        {
            var party = declaration.DeclarantParty;
            sb.AppendLine($"NAD+DE+{party.IdentificationId}::91++{EscapeEdifact(party.Name)}+{EscapeEdifact(party.AddressLine)}+{EscapeEdifact(party.CityName)}++{party.PostcodeId}+{party.CountryCode}'");
            
            if (!string.IsNullOrEmpty(party.CommunicationPhone))
            {
                sb.AppendLine($"CTA+IC+:{EscapeEdifact(party.Name)}'");
                sb.AppendLine($"COM+{party.CommunicationPhone}:TE'");
            }
        }
        
        // Consignee
        if (declaration.ConsigneeParty != null)
        {
            var party = declaration.ConsigneeParty;
            sb.AppendLine($"NAD+CN+{party.IdentificationId}::91++{EscapeEdifact(party.Name)}+{EscapeEdifact(party.AddressLine)}+{EscapeEdifact(party.CityName)}++{party.PostcodeId}+{party.CountryCode}'");
        }
        
        // Agent (if different from declarant)
        if (declaration.RepresentativeParty != null && 
            declaration.RepresentativeParty.PartyId != declaration.DeclarantParty?.PartyId)
        {
            var party = declaration.RepresentativeParty;
            sb.AppendLine($"NAD+AF+{party.IdentificationId}::91++{EscapeEdifact(party.Name)}'");
        }
    }
    
    private void AddGoodsItemSegments(StringBuilder sb, List<GoodsItem> items)
    {
        foreach (var item in items)
        {
            // Line Item
            sb.AppendLine($"LIN+{item.SequenceNumeric}++{item.CommodityCode}:HS'");
            
            // Item Description
            sb.AppendLine($"IMD+F++:::{EscapeEdifact(item.GoodsDescription)}'");
            
            // Measurements - Gross Weight
            sb.AppendLine($"MEA+AAE+AAB+KGM:{item.GrossWeightMeasure:F6}'");
            
            // Measurements - Net Weight
            sb.AppendLine($"MEA+AAE+AAD+KGM:{item.NetWeightMeasure:F6}'");
            
            // Quantity
            if (item.SupplementaryUnits.HasValue)
            {
                sb.AppendLine($"QTY+21:{item.SupplementaryUnits:F6}:{item.SupplementaryUnitCode}'");
            }
            
            // Monetary Amount - Invoice Value
            sb.AppendLine($"MOA+203:{item.StatisticalValueAmount:F2}:{item.CurrencyCode}'");
            
            // Monetary Amount - Customs Value
            if (item.CustomsValueAmount.HasValue)
            {
                sb.AppendLine($"MOA+128:{item.CustomsValueAmount:F2}:{item.CustomsValueCurrencyId}'");
            }
            
            // Country of Origin
            if (!string.IsNullOrEmpty(item.OriginCountryCode))
            {
                sb.AppendLine($"LOC+14+{item.OriginCountryCode}::162'");
            }
            
            // Documents
            AddItemDocuments(sb, item);
        }
    }
    
    private void AddItemDocuments(StringBuilder sb, GoodsItem item)
    {
        foreach (var doc in item.Documents)
        {
            sb.AppendLine($"DOC+{doc.TypeCode}+{EscapeEdifact(doc.ReferenceId)}::91'");
            
            if (doc.IssueDate.HasValue)
            {
                sb.AppendLine($"DTM+137:{doc.IssueDate.Value:yyyyMMdd}:102'");
            }
        }
    }
    
    private void AddTransportEquipmentSegments(StringBuilder sb, Declaration declaration)
    {
        if (declaration.Containers?.Any() == true)
        {
            foreach (var container in declaration.Containers)
            {
                sb.AppendLine($"EQD+CN+{container.IdentificationId}'");
                
                if (!string.IsNullOrEmpty(container.SealId))
                {
                    sb.AppendLine($"SEL+{container.SealId}+CA'");
                }
            }
        }
    }
    
    private string EscapeEdifact(string text)
    {
        if (string.IsNullOrEmpty(text)) return string.Empty;
        
        return text
            .Replace("?", "??")  // Escape the escape character
            .Replace("'", "?'")  // Escape segment terminator
            .Replace("+", "?+")  // Escape element separator
            .Replace(":", "?:"); // Escape component separator
    }
    
    private int CountSegments(string message)
    {
        // Count segments (lines ending with ')
        return message.Split('\'', StringSplitOptions.RemoveEmptyEntries)
                     .Count(line => !line.StartsWith("UNA"));
    }
}
```

#### Parsing CUSRES Message

```csharp
public class CusresMessageParser
{
    public CusresResponse ParseCusresMessage(string edifactMessage)
    {
        var response = new CusresResponse();
        var segments = SplitIntoSegments(edifactMessage);
        
        foreach (var segment in segments)
        {
            var elements = segment.Split('+');
            var tag = elements[0];
            
            switch (tag)
            {
                case "BGM":
                    response.MessageType = elements[1];
                    response.ResponseReferenceId = elements[2];
                    break;
                    
                case "DTM":
                    ParseDateSegment(response, elements);
                    break;
                    
                case "RFF":
                    if (elements[1].StartsWith("AWR:"))
                    {
                        response.OriginalDeclarationRef = elements[1].Substring(4);
                    }
                    break;
                    
                case "STS":
                    if (elements[1] == "85") // Clearance status
                    {
                        response.ClearanceStatus = elements[2].TrimEnd('\'');
                    }
                    break;
                    
                case "MOA":
                    ParseMonetaryAmount(response, elements);
                    break;
                    
                case "TAX":
                    ParseTaxSegment(response, elements);
                    break;
                    
                case "FTX":
                    ParseFreeText(response, elements);
                    break;
                    
                case "ERC":
                    ParseErrorCode(response, elements);
                    break;
            }
        }
        
        return response;
    }
    
    private List<string> SplitIntoSegments(string message)
    {
        var segments = new List<string>();
        var currentSegment = new StringBuilder();
        bool escaped = false;
        
        foreach (char c in message)
        {
            if (c == '?' && !escaped)
            {
                escaped = true;
                currentSegment.Append(c);
                continue;
            }
            
            if (c == '\'' && !escaped)
            {
                segments.Add(currentSegment.ToString());
                currentSegment.Clear();
                escaped = false;
                continue;
            }
            
            currentSegment.Append(c);
            escaped = false;
        }
        
        return segments;
    }
    
    private void ParseMonetaryAmount(CusresResponse response, string[] elements)
    {
        var amountType = elements[1].Split(':')[0];
        var components = elements[1].Split(':');
        
        if (components.Length >= 2)
        {
            var amount = decimal.Parse(components[1]);
            var currency = components.Length > 2 ? components[2] : "AOA";
            
            switch (amountType)
            {
                case "9":   // Total tax amount
                    response.TotalTaxAmount = amount;
                    break;
                case "128": // Customs value
                    response.CustomsValue = amount;
                    break;
            }
        }
    }
    
    private void ParseTaxSegment(CusresResponse response, string[] elements)
    {
        var tax = new TaxDetail
        {
            TaxType = elements[2],
            TaxRate = ParseTaxRate(elements[5]),
            TaxAmount = ParseTaxAmount(elements[7])
        };
        
        response.Taxes.Add(tax);
    }
    
    private void ParseFreeText(CusresResponse response, string[] elements)
    {
        var textQualifier = elements[1];
        var text = UnescapeEdifact(elements[3].TrimEnd('\''));
        
        if (textQualifier == "AAO")
        {
            response.StatusMessage = text;
        }
        else
        {
            response.AdditionalInformation.Add(text);
        }
    }
    
    private void ParseErrorCode(CusresResponse response, string[] elements)
    {
        var errorComponents = elements[1].Split(':');
        response.HasErrors = true;
        response.ErrorCode = errorComponents[0];
        if (errorComponents.Length > 1)
        {
            response.ErrorDescription = errorComponents[1];
        }
    }
    
    private string UnescapeEdifact(string text)
    {
        return text
            .Replace("??", "?")
            .Replace("?'", "'")
            .Replace("?+", "+")
            .Replace("?:", ":");
    }
}

public class CusresResponse
{
    public string MessageType { get; set; }
    public string ResponseReferenceId { get; set; }
    public string OriginalDeclarationRef { get; set; }
    public string ClearanceStatus { get; set; }
    public decimal? CustomsValue { get; set; }
    public decimal? TotalTaxAmount { get; set; }
    public List<TaxDetail> Taxes { get; set; } = new List<TaxDetail>();
    public string StatusMessage { get; set; }
    public List<string> AdditionalInformation { get; set; } = new List<string>();
    public bool HasErrors { get; set; }
    public string ErrorCode { get; set; }
    public string ErrorDescription { get; set; }
}

public class TaxDetail
{
    public string TaxType { get; set; }
    public decimal? TaxRate { get; set; }
    public decimal? TaxAmount { get; set; }
}
```

---

## Best Practices

### 1. Message Validation

**Pre-submission Validation**
```csharp
public class EdifactValidator
{
    public ValidationResult ValidateMessage(string edifactMessage)
    {
        var errors = new List<string>();
        
        // Check message structure
        if (!edifactMessage.StartsWith("UNA:+.? '"))
        {
            errors.Add("Missing or invalid service string advice (UNA)");
        }
        
        // Check mandatory segments
        if (!edifactMessage.Contains("UNH+"))
        {
            errors.Add("Missing message header (UNH)");
        }
        
        if (!edifactMessage.Contains("BGM+"))
        {
            errors.Add("Missing beginning of message (BGM)");
        }
        
        // Validate segment terminators
        var segmentCount = edifactMessage.Count(c => c == '\'');
        if (segmentCount < 5)
        {
            errors.Add("Insufficient segments in message");
        }
        
        // Check balanced segments
        var unhCount = Regex.Matches(edifactMessage, "UNH\\+").Count;
        var untCount = Regex.Matches(edifactMessage, "UNT\\+").Count;
        if (unhCount != untCount)
        {
            errors.Add($"Unbalanced UNH/UNT segments: {unhCount} vs {untCount}");
        }
        
        return new ValidationResult(errors.Count == 0, errors);
    }
}
```

### 2. Error Handling

**Robust Message Processing**
```csharp
public async Task<CusresResponse> ProcessDeclaration(Declaration declaration)
{
    try
    {
        // Build CUSDEC message
        var cusdecMessage = _messageBuilder.BuildCusdecMessage(declaration);
        
        // Validate before sending
        var validation = _validator.ValidateMessage(cusdecMessage);
        if (!validation.IsValid)
        {
            throw new EdifactValidationException(validation.Errors);
        }
        
        // Send to ASYCUDA
        var response = await _asycudaClient.SendCusdecAsync(cusdecMessage);
        
        // Parse response
        var cusresResponse = _messageParser.ParseCusresMessage(response);
        
        // Log for audit
        await _auditService.LogEdifactExchange(cusdecMessage, response);
        
        return cusresResponse;
    }
    catch (EdifactValidationException ex)
    {
        _logger.LogError(ex, "EDIFACT validation failed: {Errors}", string.Join(", ", ex.Errors));
        throw;
    }
    catch (HttpRequestException ex)
    {
        _logger.LogError(ex, "Failed to communicate with ASYCUDA");
        throw new AsycudaIntegrationException("ASYCUDA communication failed", ex);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Unexpected error processing declaration");
        throw;
    }
}
```

### 3. Testing

**Unit Test Example**
```csharp
[TestClass]
public class CusdecMessageBuilderTests
{
    [TestMethod]
    public void BuildCusdecMessage_WithValidDeclaration_ShouldGenerateValidMessage()
    {
        // Arrange
        var declaration = CreateTestDeclaration();
        var builder = new CusdecMessageBuilder();
        
        // Act
        var message = builder.BuildCusdecMessage(declaration);
        
        // Assert
        Assert.IsTrue(message.StartsWith("UNA:+.? '"));
        Assert.IsTrue(message.Contains("UNH+1+CUSDEC:D:01B:UN:EDEC01'"));
        Assert.IsTrue(message.Contains($"BGM+340+{declaration.FunctionalReferenceId}+9'"));
        Assert.IsTrue(message.Contains("UNT+"));
        Assert.IsTrue(message.Contains("UNZ+"));
    }
    
    [TestMethod]
    public void EscapeEdifact_WithSpecialCharacters_ShouldEscapeCorrectly()
    {
        // Arrange
        var text = "Company+Name:Special'Characters?";
        
        // Act
        var escaped = builder.EscapeEdifact(text);
        
        // Assert
        Assert.AreEqual("Company?+Name?:Special?'Characters??", escaped);
    }
}
```

### 4. Performance Optimization

**Caching Message Templates**
```csharp
public class EdifactMessageCache
{
    private readonly IDistributedCache _cache;
    
    public async Task<string> GetPartialMessage(string key)
    {
        return await _cache.GetStringAsync($"edifact:template:{key}");
    }
    
    public async Task SetPartialMessage(string key, string template, TimeSpan expiry)
    {
        await _cache.SetStringAsync($"edifact:template:{key}", template,
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = expiry });
    }
}
```

---

## References

### Official Standards
- **UN/EDIFACT Standards**: [UNECE Trade Portal](https://unece.org/trade/uncefact/unedifact)
- **CUSDEC Message Specification**: UN/EDIFACT D.01B CUSDEC
- **CUSRES Message Specification**: UN/EDIFACT D.01B CUSRES

### JUL Project Documents
- [JUL-AGT Integration Control Document](../../JUL-AGT_Integration_Control_Document.md)
- [ASYCUDA Integration Guide](../implementation/asycuda-integration.md)
- [WCO Data Model](wco-data-model.md)

### Related Resources
- **WCO Guidelines**: Customs messaging best practices
- **ASYCUDA World**: Technical documentation

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Author**: JUL Technical Team  
**Status**: Production Ready
