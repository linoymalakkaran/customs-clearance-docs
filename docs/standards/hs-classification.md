# HS Classification System

**Harmonized Commodity Description and Coding System**

---

## Table of Contents

1. [Introduction](#introduction)
2. [HS Structure](#hs-structure)
3. [Classification Rules](#classification-rules)
4. [HS 2017 vs HS 2022](#hs-2017-vs-hs-2022)
5. [JUL Implementation](#jul-implementation)
6. [Classification Examples](#classification-examples)
7. [Best Practices](#best-practices)

---

## Introduction

### What is the Harmonized System?

The **Harmonized System (HS)** is an internationally standardized system of names and numbers developed by the World Customs Organization (WCO) to classify traded products. It is used by customs authorities around the world to identify products for the application of customs duties and taxes, collection of international trade statistics, and implementation of trade policies.

### Purpose and Benefits

- **Universal Classification**: Single global standard for commodity classification
- **Tariff Application**: Basis for customs duty calculation
- **Trade Statistics**: Consistent international trade data collection
- **Trade Policy**: Implementation of trade agreements and restrictions
- **Risk Management**: Identify prohibited, restricted, or high-risk goods

### HS in Angola JUL System

The JUL system implements:
- **HS 2017**: Current classification system (until transition complete)
- **HS 2022**: Latest version with updated codes
- **National Extensions**: Angola-specific 8 or 10-digit codes
- **Dual System Support**: Transition period between HS versions

---

## HS Structure

### Hierarchical Organization

The HS is organized in a hierarchical structure from general to specific:

```
Section (21 sections) - Broad categories
  ↓
Chapter (99 chapters) - 2 digits (01-99)
  ↓
Heading - 4 digits (first 4 digits)
  ↓
Subheading - 6 digits (WCO level)
  ↓
National Subheading - 8-10 digits (country-specific)
```

### Example: Coffee Classification

```
Section II: Vegetable Products

Chapter 09: Coffee, tea, maté and spices

09.01: Coffee, whether or not roasted or decaffeinated
      ├─ 0901.1: Coffee, not roasted
      │   ├─ 0901.11: Not decaffeinated
      │   └─ 0901.12: Decaffeinated
      └─ 0901.2: Coffee, roasted
          ├─ 0901.21: Not decaffeinated
          │   ├─ 0901.21.10: Whole beans (Angola extension)
          │   └─ 0901.21.90: Ground coffee (Angola extension)
          └─ 0901.22: Decaffeinated
```

### HS Code Breakdown

For code `0901.21.10`:
- **09**: Chapter (Coffee, tea, maté and spices)
- **01**: Heading within chapter (Coffee)
- **21**: Subheading (Roasted, not decaffeinated)
- **10**: National extension (Whole beans)

---

## Classification Rules

### General Rules for Interpretation (GRI)

The WCO has established 6 General Rules for Interpretation that must be applied sequentially:

#### Rule 1: Most Specific Description
*"Classification shall be determined according to the terms of the headings and any relative section or chapter notes."*

**Example:**
- Leather shoes → Chapter 64 (Footwear)
- Not Chapter 41 (Leather), even though they contain leather

#### Rule 2: Incomplete or Unfinished Articles
*"Any reference in a heading to an article shall be taken to include a reference to that article incomplete or unfinished, provided that it has the essential character of the complete or finished article."*

**Example:**
- Unassembled bicycle → Chapter 87.12 (Bicycles)
- Has essential character of a bicycle

#### Rule 3: Most Specific Heading
*"When goods are classifiable under two or more headings, the most specific heading shall be preferred."*

**Example:**
- Electric hair dryer → 8516.31 (Hair dryers)
- Not 8516.79 (Other electro-thermic appliances)

#### Rule 4: Closest Akin
*"Goods which cannot be classified by reference to Rules 1, 2 or 3 shall be classified under the heading appropriate to the goods to which they are most akin."*

**Example:**
- New type of synthetic fabric → Classified with similar synthetic fabric

#### Rule 5: Packing Material
*"Packing materials and containers presented with goods are to be classified with the goods if they are of a kind normally used for packing such goods."*

**Example:**
- Wine in decorative glass bottle → Wine classification (Chapter 22)
- Bottle is incidental to the wine

#### Rule 6: Subheading Classification
*"Classification of goods in subheadings of a heading shall be determined according to the terms of those subheadings and related notes by application of the above rules (mutatis mutandis)."*

### Section and Chapter Notes

Each section and chapter may have specific notes that:
- **Include** specific goods in the classification
- **Exclude** certain goods from the classification
- **Define** technical terms used in the chapter

**Example - Chapter 71 Notes:**
```
Note 1: Subject to Note 2, this chapter covers only:
(a) Natural or cultured pearls and precious or semi-precious stones
(b) Precious metals and metals clad with precious metal
(c) Articles wholly or partly of precious metal or of precious stones

Note 2: This chapter does not cover:
(a) Amalgams of precious metal or colloidal precious metals
(b) Sterile surgical suture materials
```

---

## HS 2017 vs HS 2022

### Major Changes in HS 2022

The HS 2022 includes approximately **351 amendments** at the 6-digit level:

#### New Chapters and Restructuring

**Environmental and Social Concerns:**
- Electronic waste (e-waste) classification improvements
- Plastic waste management codes
- Dual-use goods for security concerns

**Technology Products:**
- Smartphones and tablets (separate from mobile phones)
- 3D printers (distinct classification)
- Drones (unmanned aerial vehicles)

**Agriculture and Food:**
- Quinoa (separate from other grains)
- Sweet potatoes (new subheading)
- Insects for human consumption

#### Specific Code Changes

| Product | HS 2017 | HS 2022 | Change |
|---------|---------|---------|--------|
| Smartphones | 8517.12 | 8517.13 | New specific code |
| Tablets | 8471.30 | 8471.30.10 | More specific |
| 3D Printers | 8477.80 | 8477.59 | Reclassified |
| Drones | 8806.92 | 8806.21-29 | Expanded |
| E-waste | Various | 3915.30-40 | New codes |

### Transition Strategy in JUL

#### Dual System Support (2025-2026)

```sql
CREATE TABLE hs_codes (
    hs_code_id UUID PRIMARY KEY,
    code VARCHAR(22) NOT NULL,
    description TEXT NOT NULL,
    hs_version VARCHAR(10) NOT NULL, -- '2017' or '2022'
    effective_date DATE NOT NULL,
    expiry_date DATE,
    parent_code_id UUID REFERENCES hs_codes(hs_code_id),
    duty_rate DECIMAL(5,2),
    vat_rate DECIMAL(5,2),
    restriction_code VARCHAR(10),
    statistical_suffix VARCHAR(4),
    CONSTRAINT unique_code_version UNIQUE (code, hs_version, effective_date)
);

-- Mapping table for code changes
CREATE TABLE hs_code_mapping (
    mapping_id UUID PRIMARY KEY,
    hs2017_code VARCHAR(22) NOT NULL,
    hs2022_code VARCHAR(22) NOT NULL,
    mapping_type VARCHAR(20), -- 'ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE'
    notes TEXT,
    CONSTRAINT unique_mapping UNIQUE (hs2017_code, hs2022_code)
);
```

#### Code Conversion Logic

```csharp
public class HSCodeConverter
{
    public async Task<string> ConvertToHS2022(string hs2017Code, DateTime declarationDate)
    {
        // Check if conversion is needed based on date
        if (declarationDate < _hs2022MandatoryDate)
        {
            return hs2017Code; // Still using HS 2017
        }
        
        // Look up mapping
        var mapping = await _database.HSCodeMappings
            .FirstOrDefaultAsync(m => m.HS2017Code == hs2017Code);
        
        if (mapping == null)
        {
            // Check if code exists unchanged in HS 2022
            var unchangedCode = await _database.HSCodes
                .FirstOrDefaultAsync(h => h.Code == hs2017Code && h.HSVersion == "2022");
            
            if (unchangedCode != null)
            {
                return hs2017Code; // Code unchanged
            }
            
            throw new HSCodeConversionException(
                $"No mapping found for HS 2017 code {hs2017Code}");
        }
        
        if (mapping.MappingType == "ONE_TO_MANY")
        {
            // Requires user selection
            var possibleCodes = await _database.HSCodeMappings
                .Where(m => m.HS2017Code == hs2017Code)
                .Select(m => m.HS2022Code)
                .ToListAsync();
            
            throw new HSCodeAmbiguityException(
                $"Multiple HS 2022 codes possible for {hs2017Code}: {string.Join(", ", possibleCodes)}");
        }
        
        return mapping.HS2022Code;
    }
}
```

---

## JUL Implementation

### Master Data Management

The Master Data Management Service (Port 8086) manages HS codes:

#### Nightly Synchronization

```csharp
public class HSCodeSyncService
{
    public async Task SynchronizeHSCodes()
    {
        _logger.LogInformation("Starting HS Code synchronization");
        
        try
        {
            // Connect to AGT master data source
            var agtHSCodes = await _agtService.GetHSCodesAsync();
            
            // Process updates
            foreach (var code in agtHSCodes)
            {
                var existing = await _database.HSCodes
                    .FirstOrDefaultAsync(h => 
                        h.Code == code.Code && 
                        h.HSVersion == code.Version);
                
                if (existing == null)
                {
                    // New code
                    await _database.HSCodes.AddAsync(new HSCode
                    {
                        HSCodeId = Guid.NewGuid(),
                        Code = code.Code,
                        Description = code.Description,
                        HSVersion = code.Version,
                        EffectiveDate = code.EffectiveDate,
                        DutyRate = code.DutyRate,
                        VATRate = code.VATRate,
                        RestrictionCode = code.RestrictionCode
                    });
                }
                else if (existing.UpdatedAt < code.LastModified)
                {
                    // Update existing
                    existing.Description = code.Description;
                    existing.DutyRate = code.DutyRate;
                    existing.VATRate = code.VATRate;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
            }
            
            await _database.SaveChangesAsync();
            
            // Distribute to microservices
            await DistributeHSCodesAsync();
            
            _logger.LogInformation("HS Code synchronization completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "HS Code synchronization failed");
            throw;
        }
    }
    
    private async Task DistributeHSCodesAsync()
    {
        // Publish event for other services to refresh their caches
        await _messageBus.PublishAsync(new HSCodeUpdatedEvent
        {
            UpdatedAt = DateTime.UtcNow,
            TotalCodes = await _database.HSCodes.CountAsync()
        });
    }
}
```

### HS Code Search and Lookup

#### Advanced Search API

```csharp
[ApiController]
[Route("api/v1/hs-codes")]
public class HSCodeController : ControllerBase
{
    [HttpGet("search")]
    public async Task<ActionResult<HSCodeSearchResult>> Search(
        [FromQuery] string query,
        [FromQuery] string version = "2022",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var searchQuery = _database.HSCodes
            .Where(h => h.HSVersion == version)
            .Where(h => h.ExpiryDate == null || h.ExpiryDate > DateTime.UtcNow);
        
        // Full-text search on code and description
        searchQuery = searchQuery.Where(h =>
            EF.Functions.Like(h.Code, $"%{query}%") ||
            EF.Functions.ILike(h.Description, $"%{query}%"));
        
        var total = await searchQuery.CountAsync();
        
        var results = await searchQuery
            .OrderBy(h => h.Code)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(h => new HSCodeDto
            {
                Code = h.Code,
                Description = h.Description,
                DutyRate = h.DutyRate,
                VATRate = h.VATRate,
                RestrictionCode = h.RestrictionCode
            })
            .ToListAsync();
        
        return Ok(new HSCodeSearchResult
        {
            Results = results,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        });
    }
    
    [HttpGet("{code}")]
    public async Task<ActionResult<HSCodeDetail>> GetByCode(
        string code,
        [FromQuery] string version = "2022")
    {
        var hsCode = await _database.HSCodes
            .Include(h => h.ParentCode)
            .FirstOrDefaultAsync(h => 
                h.Code == code && 
                h.HSVersion == version &&
                (h.ExpiryDate == null || h.ExpiryDate > DateTime.UtcNow));
        
        if (hsCode == null)
        {
            return NotFound($"HS Code {code} not found in version {version}");
        }
        
        // Get hierarchy
        var hierarchy = await GetHierarchy(hsCode);
        
        // Get related documents/licenses
        var requirements = await GetRequirements(code);
        
        return Ok(new HSCodeDetail
        {
            Code = hsCode.Code,
            Description = hsCode.Description,
            HSVersion = hsCode.HSVersion,
            DutyRate = hsCode.DutyRate,
            VATRate = hsCode.VATRate,
            RestrictionCode = hsCode.RestrictionCode,
            Hierarchy = hierarchy,
            Requirements = requirements
        });
    }
    
    [HttpGet("{code}/tariff")]
    public async Task<ActionResult<TariffCalculation>> CalculateTariff(
        string code,
        [FromQuery] decimal customsValue,
        [FromQuery] string originCountry,
        [FromQuery] string version = "2022")
    {
        var hsCode = await _database.HSCodes
            .FirstOrDefaultAsync(h => 
                h.Code == code && 
                h.HSVersion == version);
        
        if (hsCode == null)
        {
            return NotFound($"HS Code {code} not found");
        }
        
        // Check for preferential rates
        var dutyRate = hsCode.DutyRate;
        var preference = await _database.PreferentialRates
            .FirstOrDefaultAsync(p => 
                p.HSCode == code && 
                p.OriginCountry == originCountry &&
                p.EffectiveDate <= DateTime.UtcNow &&
                (p.ExpiryDate == null || p.ExpiryDate > DateTime.UtcNow));
        
        if (preference != null)
        {
            dutyRate = preference.PreferentialRate;
        }
        
        // Calculate duties and taxes
        var importDuty = customsValue * (dutyRate / 100);
        var dutiableValue = customsValue + importDuty;
        var vat = dutiableValue * (hsCode.VATRate / 100);
        var totalTax = importDuty + vat;
        
        return Ok(new TariffCalculation
        {
            HSCode = code,
            CustomsValue = customsValue,
            DutyRate = dutyRate,
            ImportDuty = importDuty,
            VATRate = hsCode.VATRate,
            VAT = vat,
            TotalTax = totalTax,
            GrandTotal = customsValue + totalTax,
            PreferenceApplied = preference != null,
            PreferenceDetails = preference != null ? $"SADC preferential rate ({preference.AgreementName})" : null
        });
    }
}
```

### Classification Assistance

#### Smart Classification Recommender

```csharp
public class HSCodeRecommender
{
    public async Task<List<HSCodeSuggestion>> SuggestHSCodes(
        string productDescription,
        string version = "2022")
    {
        // Tokenize and clean description
        var tokens = TokenizeDescription(productDescription);
        
        // Search using keyword matching
        var candidates = await _database.HSCodes
            .Where(h => h.HSVersion == version)
            .Where(h => tokens.Any(t => h.Description.Contains(t)))
            .Take(100)
            .ToListAsync();
        
        // Score each candidate
        var scored = candidates.Select(c => new
        {
            HSCode = c,
            Score = CalculateRelevanceScore(c.Description, productDescription)
        })
        .OrderByDescending(x => x.Score)
        .Take(10)
        .ToList();
        
        // Check historical usage
        var suggestions = new List<HSCodeSuggestion>();
        foreach (var item in scored)
        {
            var usageCount = await GetHistoricalUsage(item.HSCode.Code);
            
            suggestions.Add(new HSCodeSuggestion
            {
                Code = item.HSCode.Code,
                Description = item.HSCode.Description,
                RelevanceScore = item.Score,
                UsageCount = usageCount,
                DutyRate = item.HSCode.DutyRate,
                Confidence = item.Score > 0.8 ? "High" : 
                           item.Score > 0.5 ? "Medium" : "Low"
            });
        }
        
        return suggestions;
    }
    
    private List<string> TokenizeDescription(string description)
    {
        // Remove common words and extract keywords
        var stopWords = new HashSet<string> { "the", "a", "an", "of", "for", "in", "on", "with" };
        
        return description
            .ToLower()
            .Split(new[] { ' ', ',', '.', ';', '-' }, StringSplitOptions.RemoveEmptyEntries)
            .Where(w => w.Length > 2 && !stopWords.Contains(w))
            .Distinct()
            .ToList();
    }
    
    private double CalculateRelevanceScore(string hsDescription, string productDescription)
    {
        var hsTokens = new HashSet<string>(TokenizeDescription(hsDescription));
        var productTokens = new HashSet<string>(TokenizeDescription(productDescription));
        
        // Calculate Jaccard similarity
        var intersection = hsTokens.Intersect(productTokens).Count();
        var union = hsTokens.Union(productTokens).Count();
        
        return union > 0 ? (double)intersection / union : 0;
    }
}
```

---

## Classification Examples

### Example 1: Electronics

**Product**: Laptop Computer

**Classification Process:**
1. **Section XVI**: Machinery and mechanical appliances; electrical equipment
2. **Chapter 84**: Nuclear reactors, boilers, machinery and mechanical appliances; parts thereof
3. **Heading 8471**: Automatic data processing machines and units thereof
4. **Subheading 8471.30**: Portable automatic data processing machines, weighing not more than 10 kg
5. **National Extension 8471.30.00**: Complete laptops

**Final Code**: `8471.30.00`

**Duty Calculation**:
- Import Duty: 5%
- VAT: 14%
- Total Tax on AOA 500,000: AOA 95,700

### Example 2: Agricultural Products

**Product**: Fresh Bananas

**Classification Process:**
1. **Section II**: Vegetable products
2. **Chapter 08**: Edible fruit and nuts; peel of citrus fruit or melons
3. **Heading 0803**: Bananas, including plantains, fresh or dried
4. **Subheading 0803.90**: Other (not plantains)
5. **National Extension 0803.90.10**: Fresh bananas for consumption

**Final Code**: `0803.90.10`

**Duty Calculation**:
- Import Duty: 20% (seasonal protection)
- VAT: 14%
- Total Tax on AOA 100,000: AOA 38,800

### Example 3: Textiles

**Product**: Cotton T-Shirts

**Classification Process:**
1. **Section XI**: Textiles and textile articles
2. **Chapter 61**: Articles of apparel and clothing accessories, knitted or crocheted
3. **Heading 6109**: T-shirts, singlets and other vests, knitted or crocheted
4. **Subheading 6109.10**: Of cotton
5. **National Extension 6109.10.00**: Cotton t-shirts

**Final Code**: `6109.10.00`

**Duty Calculation**:
- Import Duty: 15%
- VAT: 14%
- Total Tax on AOA 50,000: AOA 13,810

---

## Best Practices

### 1. Accurate Classification

**Key Principles:**
- Always classify based on the actual product, not its intended use
- Use the most specific heading available
- Follow the General Rules for Interpretation sequentially
- Consult chapter and section notes carefully
- When in doubt, seek expert opinion or customs ruling

### 2. Documentation

**Support Classification Decisions:**
```csharp
public class ClassificationDecision
{
    public Guid DecisionId { get; set; }
    public string GoodsDescription { get; set; }
    public string ClassifiedHSCode { get; set; }
    public string Justification { get; set; }
    public List<string> AlternativeCodesConsidered { get; set; }
    public string GRIRulesApplied { get; set; }
    public string ChapterNotesReference { get; set; }
    public DateTime ClassificationDate { get; set; }
    public string ClassifiedBy { get; set; }
    public List<DocumentReference> SupportingDocuments { get; set; }
}
```

### 3. Regular Updates

**Stay Current:**
- Subscribe to WCO updates and amendments
- Monitor HS 2022 implementation timeline
- Update internal databases regularly
- Train staff on new classifications
- Review historical classifications for accuracy

### 4. Validation and Quality Control

**Multi-Level Validation:**
```csharp
public class HSCodeValidationService
{
    public async Task<ValidationResult> ValidateClassification(
        string hsCode,
        string productDescription)
    {
        var errors = new List<string>();
        var warnings = new List<string>();
        
        // Check code exists
        var code = await _database.HSCodes.FindAsync(hsCode);
        if (code == null)
        {
            errors.Add($"HS Code {hsCode} not found in database");
            return new ValidationResult(false, errors, warnings);
        }
        
        // Check code is active
        if (code.ExpiryDate.HasValue && code.ExpiryDate < DateTime.UtcNow)
        {
            errors.Add($"HS Code {hsCode} is no longer valid (expired {code.ExpiryDate})");
        }
        
        // Check for restrictions
        if (!string.IsNullOrEmpty(code.RestrictionCode))
        {
            warnings.Add($"Product is subject to restrictions (Code: {code.RestrictionCode})");
        }
        
        // Suggest alternatives if low confidence
        var suggestions = await _recommender.SuggestHSCodes(productDescription);
        var topMatch = suggestions.FirstOrDefault();
        if (topMatch != null && topMatch.Code != hsCode)
        {
            warnings.Add($"Consider alternative classification: {topMatch.Code} - {topMatch.Description}");
        }
        
        return new ValidationResult(errors.Count == 0, errors, warnings);
    }
}
```

---

## References

### Official Resources
- **WCO Harmonized System**: [WCO Website](http://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx)
- **HS 2022 Amendments**: WCO official documentation
- **General Rules for Interpretation**: WCO HS Convention

### JUL Project Documents
- [WCO Data Model](wco-data-model.md)
- [Master Data Management](../single-window-overview#architecture)
- JUL High Level Design Document

### Training Resources
- WCO HS Training Modules
- Angola Customs Classification Guidelines
- HS Classification Case Studies

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Author**: JUL Technical Team  
**Status**: Production Ready
