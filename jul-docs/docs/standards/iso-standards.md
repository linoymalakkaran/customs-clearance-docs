# ISO Standards for Customs and Trade

**International Organization for Standardization - Trade Facilitation Standards**

---

## Table of Contents

1. [Introduction](#introduction)
2. [ISO 3166 - Country Codes](#iso-3166---country-codes)
3. [ISO 4217 - Currency Codes](#iso-4217---currency-codes)
4. [ISO 8601 - Date and Time](#iso-8601---date-and-time)
5. [ISO 6346 - Container Identification](#iso-6346---container-identification)
6. [ISO 27001 - Information Security](#iso-27001---information-security)
7. [JUL Implementation](#jul-implementation)
8. [Best Practices](#best-practices)

---

## Introduction

### What are ISO Standards?

**ISO (International Organization for Standardization)** develops and publishes international standards that ensure quality, safety, and efficiency across industries. For customs and trade facilitation, several ISO standards are critical for data consistency and interoperability.

### Importance in JUL System

The JUL system implements multiple ISO standards to ensure:
- **Data Consistency**: Uniform data representation across systems
- **International Compatibility**: Seamless cross-border data exchange
- **Regulatory Compliance**: Meet international requirements
- **System Interoperability**: Integration with external systems

---

## ISO 3166 - Country Codes

### Standard Overview

**ISO 3166** defines codes for the names of countries, dependent territories, and special areas of geographical interest.

### Code Types

#### ISO 3166-1 alpha-2 (2-letter codes)
Most common format used in trade systems:

| Code | Country |
|------|---------|
| `AO` | Angola |
| `US` | United States |
| `GB` | United Kingdom |
| `BR` | Brazil |
| `CN` | China |
| `DE` | Germany |
| `FR` | France |
| `PT` | Portugal |
| `ZA` | South Africa |

#### ISO 3166-1 alpha-3 (3-letter codes)
More readable alternative:

| Code | Country |
|------|---------|
| `AGO` | Angola |
| `USA` | United States |
| `GBR` | United Kingdom |
| `BRA` | Brazil |
| `CHN` | China |

#### ISO 3166-1 numeric (3-digit codes)
Language-independent format:

| Code | Country |
|------|---------|
| `024` | Angola |
| `840` | United States |
| `826` | United Kingdom |
| `076` | Brazil |
| `156` | China |

### JUL Database Implementation

```sql
CREATE TABLE countries (
    country_id UUID PRIMARY KEY,
    alpha2_code VARCHAR(2) NOT NULL UNIQUE,
    alpha3_code VARCHAR(3) NOT NULL UNIQUE,
    numeric_code VARCHAR(3) NOT NULL UNIQUE,
    name_english VARCHAR(100) NOT NULL,
    name_portuguese VARCHAR(100) NOT NULL,
    name_french VARCHAR(100),
    official_name_english VARCHAR(200),
    region VARCHAR(50),
    sub_region VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    effective_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_alpha2 CHECK (alpha2_code ~ '^[A-Z]{2}$'),
    CONSTRAINT valid_alpha3 CHECK (alpha3_code ~ '^[A-Z]{3}$'),
    CONSTRAINT valid_numeric CHECK (numeric_code ~ '^[0-9]{3}$')
);

-- Regional groupings
CREATE TABLE country_regions (
    region_id UUID PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL UNIQUE,
    region_code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT
);

-- Trade agreements
CREATE TABLE trade_agreements (
    agreement_id UUID PRIMARY KEY,
    agreement_code VARCHAR(20) NOT NULL,
    agreement_name VARCHAR(100) NOT NULL,
    effective_date DATE NOT NULL,
    expiry_date DATE
);

CREATE TABLE agreement_countries (
    agreement_country_id UUID PRIMARY KEY,
    agreement_id UUID REFERENCES trade_agreements(agreement_id),
    country_id UUID REFERENCES countries(country_id),
    CONSTRAINT unique_agreement_country UNIQUE (agreement_id, country_id)
);

-- Sample data
INSERT INTO countries (country_id, alpha2_code, alpha3_code, numeric_code, name_english, name_portuguese, region) VALUES
(gen_random_uuid(), 'AO', 'AGO', '024', 'Angola', 'Angola', 'Africa'),
(gen_random_uuid(), 'US', 'USA', '840', 'United States', 'Estados Unidos', 'Americas'),
(gen_random_uuid(), 'BR', 'BRA', '076', 'Brazil', 'Brasil', 'Americas'),
(gen_random_uuid(), 'PT', 'PRT', '620', 'Portugal', 'Portugal', 'Europe'),
(gen_random_uuid(), 'CN', 'CHN', '156', 'China', 'China', 'Asia'),
(gen_random_uuid(), 'ZA', 'ZAF', '710', 'South Africa', 'África do Sul', 'Africa');
```

### C# Implementation

```csharp
public class CountryService
{
    public async Task<Country> GetCountryByAlpha2(string alpha2Code)
    {
        if (!Regex.IsMatch(alpha2Code, "^[A-Z]{2}$"))
        {
            throw new ArgumentException("Invalid ISO 3166-1 alpha-2 code format");
        }
        
        var country = await _database.Countries
            .FirstOrDefaultAsync(c => c.Alpha2Code == alpha2Code && c.IsActive);
        
        if (country == null)
        {
            throw new CountryNotFoundException($"Country with code {alpha2Code} not found");
        }
        
        return country;
    }
    
    public async Task<List<Country>> GetCountriesByRegion(string region)
    {
        return await _database.Countries
            .Where(c => c.Region == region && c.IsActive)
            .OrderBy(c => c.NameEnglish)
            .ToListAsync();
    }
    
    public async Task<bool> IsTradeAgreementMember(string countryCode, string agreementCode)
    {
        return await _database.AgreementCountries
            .Include(ac => ac.Agreement)
            .Include(ac => ac.Country)
            .AnyAsync(ac => 
                ac.Country.Alpha2Code == countryCode &&
                ac.Agreement.AgreementCode == agreementCode &&
                ac.Agreement.EffectiveDate <= DateTime.UtcNow &&
                (ac.Agreement.ExpiryDate == null || ac.Agreement.ExpiryDate > DateTime.UtcNow));
    }
}
```

---

## ISO 4217 - Currency Codes

### Standard Overview

**ISO 4217** defines three-letter codes for currencies, along with their numeric codes and decimal places.

### Currency Code Structure

```
AOA - Angolan Kwanza
├─ AO: Country code (Angola)
└─ A: Currency designation (first letter of currency name)

USD - United States Dollar
├─ US: Country code (United States)
└─ D: Currency designation (Dollar)
```

### Common Currencies in Trade

| Code | Currency | Decimal Places | Numeric Code |
|------|----------|----------------|--------------|
| `AOA` | Angolan Kwanza | 2 | 973 |
| `USD` | US Dollar | 2 | 840 |
| `EUR` | Euro | 2 | 978 |
| `GBP` | British Pound | 2 | 826 |
| `CNY` | Chinese Yuan | 2 | 156 |
| `ZAR` | South African Rand | 2 | 710 |
| `BRL` | Brazilian Real | 2 | 986 |

### Special Cases

- **JPY** (Japanese Yen): 0 decimal places
- **BHD** (Bahraini Dinar): 3 decimal places
- **XAU** (Gold): Precious metal, not country-specific

### JUL Database Implementation

```sql
CREATE TABLE currencies (
    currency_id UUID PRIMARY KEY,
    alpha_code VARCHAR(3) NOT NULL UNIQUE,
    numeric_code VARCHAR(3) NOT NULL UNIQUE,
    currency_name_english VARCHAR(100) NOT NULL,
    currency_name_portuguese VARCHAR(100) NOT NULL,
    minor_unit_digits INTEGER NOT NULL DEFAULT 2,
    symbol VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT valid_alpha_code CHECK (alpha_code ~ '^[A-Z]{3}$'),
    CONSTRAINT valid_numeric_code CHECK (numeric_code ~ '^[0-9]{3}$'),
    CONSTRAINT valid_minor_units CHECK (minor_unit_digits >= 0 AND minor_unit_digits <= 4)
);

-- Exchange rates
CREATE TABLE exchange_rates (
    rate_id UUID PRIMARY KEY,
    from_currency_id UUID NOT NULL REFERENCES currencies(currency_id),
    to_currency_id UUID NOT NULL REFERENCES currencies(currency_id),
    rate_date DATE NOT NULL,
    rate DECIMAL(18,10) NOT NULL,
    source VARCHAR(50), -- 'CENTRAL_BANK', 'COMMERCIAL_RATE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_rate_date UNIQUE (from_currency_id, to_currency_id, rate_date, source),
    CONSTRAINT positive_rate CHECK (rate > 0)
);

-- Sample data
INSERT INTO currencies (currency_id, alpha_code, numeric_code, currency_name_english, currency_name_portuguese, minor_unit_digits, symbol) VALUES
(gen_random_uuid(), 'AOA', '973', 'Angolan Kwanza', 'Kwanza Angolano', 2, 'Kz'),
(gen_random_uuid(), 'USD', '840', 'US Dollar', 'Dólar Americano', 2, '$'),
(gen_random_uuid(), 'EUR', '978', 'Euro', 'Euro', 2, '€'),
(gen_random_uuid(), 'GBP', '826', 'Pound Sterling', 'Libra Esterlina', 2, '£'),
(gen_random_uuid(), 'CNY', '156', 'Yuan Renminbi', 'Yuan Renminbi', 2, '¥'),
(gen_random_uuid(), 'ZAR', '710', 'South African Rand', 'Rand Sul-Africano', 2, 'R');
```

### C# Implementation

```csharp
public class CurrencyService
{
    public async Task<decimal> ConvertCurrency(
        decimal amount,
        string fromCurrency,
        string toCurrency,
        DateTime rateDate)
    {
        if (fromCurrency == toCurrency)
        {
            return amount;
        }
        
        // Get exchange rate
        var rate = await GetExchangeRate(fromCurrency, toCurrency, rateDate);
        
        // Get currency info for proper rounding
        var targetCurrency = await _database.Currencies
            .FirstOrDefaultAsync(c => c.AlphaCode == toCurrency);
        
        if (targetCurrency == null)
        {
            throw new CurrencyNotFoundException($"Currency {toCurrency} not found");
        }
        
        // Convert and round to appropriate decimal places
        var converted = amount * rate;
        return Math.Round(converted, targetCurrency.MinorUnitDigits, MidpointRounding.AwayFromZero);
    }
    
    public async Task<decimal> GetExchangeRate(
        string fromCurrency,
        string toCurrency,
        DateTime rateDate)
    {
        // Try direct rate
        var directRate = await _database.ExchangeRates
            .Include(r => r.FromCurrency)
            .Include(r => r.ToCurrency)
            .Where(r => 
                r.FromCurrency.AlphaCode == fromCurrency &&
                r.ToCurrency.AlphaCode == toCurrency &&
                r.RateDate == rateDate.Date &&
                r.Source == "CENTRAL_BANK")
            .FirstOrDefaultAsync();
        
        if (directRate != null)
        {
            return directRate.Rate;
        }
        
        // Try inverse rate
        var inverseRate = await _database.ExchangeRates
            .Include(r => r.FromCurrency)
            .Include(r => r.ToCurrency)
            .Where(r => 
                r.FromCurrency.AlphaCode == toCurrency &&
                r.ToCurrency.AlphaCode == fromCurrency &&
                r.RateDate == rateDate.Date &&
                r.Source == "CENTRAL_BANK")
            .FirstOrDefaultAsync();
        
        if (inverseRate != null)
        {
            return 1 / inverseRate.Rate;
        }
        
        // Try cross-rate via AOA (base currency)
        if (fromCurrency != "AOA" && toCurrency != "AOA")
        {
            var fromAOARate = await GetExchangeRate(fromCurrency, "AOA", rateDate);
            var toAOARate = await GetExchangeRate("AOA", toCurrency, rateDate);
            return fromAOARate * toAOARate;
        }
        
        throw new ExchangeRateNotFoundException(
            $"No exchange rate found for {fromCurrency} to {toCurrency} on {rateDate:yyyy-MM-dd}");
    }
    
    public string FormatCurrency(decimal amount, string currencyCode)
    {
        var currency = _database.Currencies
            .FirstOrDefault(c => c.AlphaCode == currencyCode);
        
        if (currency == null)
        {
            return $"{amount:N2} {currencyCode}";
        }
        
        var formatted = amount.ToString($"N{currency.MinorUnitDigits}");
        return $"{currency.Symbol} {formatted}";
    }
}
```

---

## ISO 8601 - Date and Time

### Standard Overview

**ISO 8601** defines an international standard for representing dates and times to avoid confusion between different date formats.

### Date Formats

#### Basic Format (YYYYMMDD)
```
20251231 - December 31, 2025
20260115 - January 15, 2026
```

#### Extended Format (YYYY-MM-DD)
```
2025-12-31 - December 31, 2025
2026-01-15 - January 15, 2026
```

### Time Formats

#### 24-Hour Format
```
14:30:00 - 2:30:00 PM
09:15:45 - 9:15:45 AM
```

#### With Timezone
```
2025-12-31T14:30:00Z - UTC time
2025-12-31T14:30:00+01:00 - WAT (West Africa Time)
2025-12-31T14:30:00.123Z - With milliseconds
```

### JUL Implementation

```csharp
public class ISO8601Helper
{
    // Angola uses WAT (West Africa Time) = UTC+1
    private static readonly TimeZoneInfo WATTimeZone = 
        TimeZoneInfo.FindSystemTimeZoneById("W. Central Africa Standard Time");
    
    public static string ToISO8601Date(DateTime date)
    {
        return date.ToString("yyyy-MM-dd");
    }
    
    public static string ToISO8601DateTime(DateTime dateTime)
    {
        // Convert to UTC and format
        var utc = TimeZoneInfo.ConvertTimeToUtc(dateTime, WATTimeZone);
        return utc.ToString("yyyy-MM-ddTHH:mm:ssZ");
    }
    
    public static string ToISO8601DateTimeWithTimezone(DateTime dateTime)
    {
        // Keep timezone information
        return dateTime.ToString("yyyy-MM-ddTHH:mm:sszzz");
    }
    
    public static DateTime ParseISO8601(string iso8601String)
    {
        if (DateTime.TryParse(iso8601String, 
            CultureInfo.InvariantCulture,
            DateTimeStyles.RoundtripKind,
            out DateTime result))
        {
            // Convert to WAT for local display
            return TimeZoneInfo.ConvertTime(result, WATTimeZone);
        }
        
        throw new FormatException($"Invalid ISO 8601 date/time: {iso8601String}");
    }
    
    public static string ToEDIFACTDate(DateTime date)
    {
        // EDIFACT uses CCYYMMDD format (102)
        return date.ToString("yyyyMMdd");
    }
    
    public static string ToEDIFACTDateTime(DateTime dateTime)
    {
        // EDIFACT uses CCYYMMDDHHMM format (203)
        return dateTime.ToString("yyyyMMddHHmm");
    }
}
```

### Database Storage

```sql
-- Always store dates/times with timezone awareness
CREATE TABLE declarations (
    declaration_id UUID PRIMARY KEY,
    created_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_datetime TIMESTAMP WITH TIME ZONE,
    acceptance_datetime TIMESTAMP WITH TIME ZONE,
    clearance_datetime TIMESTAMP WITH TIME ZONE
);

-- Use DATE type for date-only fields
CREATE TABLE licenses (
    license_id UUID PRIMARY KEY,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    application_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ISO 6346 - Container Identification

### Standard Overview

**ISO 6346** defines the coding, identification, and marking of intermodal (shipping) containers.

### Container Number Format

```
ABCD 123456 7
├─────┘ │     └─ Check Digit
│       └─────── Serial Number (6 digits)
└───────────── Owner Code (4 letters)
```

### Example

```
MAEU 123456 7
├─ MAEU: Maersk Line (owner)
├─ 123456: Serial number
└─ 7: Check digit (calculated)
```

### Validation Implementation

```csharp
public class ContainerValidator
{
    public bool IsValidContainerNumber(string containerNumber)
    {
        // Remove spaces and convert to uppercase
        containerNumber = containerNumber.Replace(" ", "").ToUpper();
        
        // Check format: 4 letters + 6 digits + 1 digit
        if (!Regex.IsMatch(containerNumber, @"^[A-Z]{4}\d{7}$"))
        {
            return false;
        }
        
        // Extract parts
        var ownerCode = containerNumber.Substring(0, 4);
        var serialNumber = containerNumber.Substring(4, 6);
        var checkDigit = int.Parse(containerNumber.Substring(10, 1));
        
        // Fourth letter must be U, J, or Z
        var categoryIdentifier = ownerCode[3];
        if (categoryIdentifier != 'U' && categoryIdentifier != 'J' && categoryIdentifier != 'Z')
        {
            return false;
        }
        
        // Calculate check digit
        var calculated = CalculateCheckDigit(ownerCode + serialNumber);
        
        return calculated == checkDigit;
    }
    
    private int CalculateCheckDigit(string containerBase)
    {
        // Convert letters to numbers (A=10, B=12, C=13, ..., Z=38)
        // Skip 11, 22, 33 as per ISO 6346
        var values = new Dictionary<char, int>();
        int value = 10;
        for (char c = 'A'; c <= 'Z'; c++)
        {
            if (value == 11 || value == 22 || value == 33)
            {
                value++;
            }
            values[c] = value++;
        }
        
        // Calculate weighted sum
        int sum = 0;
        for (int i = 0; i < containerBase.Length; i++)
        {
            char c = containerBase[i];
            int digitValue = char.IsDigit(c) ? c - '0' : values[c];
            sum += digitValue * (int)Math.Pow(2, i);
        }
        
        // Calculate check digit
        int checkDigit = (sum % 11) % 10;
        
        return checkDigit;
    }
    
    public string FormatContainerNumber(string containerNumber)
    {
        containerNumber = containerNumber.Replace(" ", "").ToUpper();
        
        if (containerNumber.Length != 11)
        {
            throw new ArgumentException("Invalid container number length");
        }
        
        // Format as ABCD 123456 7
        return $"{containerNumber.Substring(0, 4)} {containerNumber.Substring(4, 6)} {containerNumber.Substring(10, 1)}";
    }
}
```

---

## ISO 27001 - Information Security

### Standard Overview

**ISO 27001** specifies requirements for establishing, implementing, maintaining, and continually improving an information security management system (ISMS).

---

## ISO 9001 - Quality Management

### Standard Overview

**ISO 9001:2015** is the world's most recognized quality management standard, providing a framework for consistent quality in products and services.

### Application in JUL System

#### Quality Management Principles
- **Customer Focus**: Understanding and meeting trader requirements
- **Leadership**: Clear direction and unified purpose
- **Engagement of People**: Competent, empowered staff
- **Process Approach**: Systematic management of processes
- **Improvement**: Continuous enhancement of performance
- **Evidence-based Decision Making**: Data-driven decisions
- **Relationship Management**: Mutually beneficial relationships with stakeholders

#### JUL Quality Controls
```csharp
public class QualityMetrics
{
    public decimal DeclarationAccuracyRate { get; set; }
    public decimal ProcessingTimeCompliance { get; set; }
    public decimal CustomerSatisfactionScore { get; set; }
    public decimal SystemAvailability { get; set; }
    public int ComplaintsResolved { get; set; }
    public decimal ErrorRate { get; set; }
}

public class QualityManagementService
{
    public async Task<QualityMetrics> CalculateQualityMetrics(DateTime startDate, DateTime endDate)
    {
        var metrics = new QualityMetrics();
        
        // Declaration accuracy
        var totalDeclarations = await _database.Declarations
            .Where(d => d.SubmissionDateTime >= startDate && d.SubmissionDateTime <= endDate)
            .CountAsync();
        
        var accurateDeclarations = await _database.Declarations
            .Where(d => d.SubmissionDateTime >= startDate && 
                       d.SubmissionDateTime <= endDate &&
                       !d.Amendments.Any())
            .CountAsync();
        
        metrics.DeclarationAccuracyRate = totalDeclarations > 0 ? 
            (decimal)accurateDeclarations / totalDeclarations * 100 : 0;
        
        // Processing time compliance (target: < 3 seconds for 95%)
        var processingTimes = await _database.AuditLogs
            .Where(a => a.Action == "DECLARATION_PROCESSED" &&
                       a.Timestamp >= startDate && a.Timestamp <= endDate)
            .Select(a => a.ProcessingTimeMs)
            .ToListAsync();
        
        if (processingTimes.Any())
        {
            processingTimes.Sort();
            var p95Index = (int)(processingTimes.Count * 0.95);
            var p95Time = processingTimes[p95Index];
            metrics.ProcessingTimeCompliance = p95Time < 3000 ? 100 : 
                (3000m / p95Time) * 100;
        }
        
        // System availability (target: 99.9%)
        var totalMinutes = (endDate - startDate).TotalMinutes;
        var downtimeMinutes = await _database.SystemDowntimes
            .Where(d => d.StartTime >= startDate && d.StartTime <= endDate)
            .SumAsync(d => (d.EndTime - d.StartTime).TotalMinutes);
        
        metrics.SystemAvailability = ((totalMinutes - downtimeMinutes) / totalMinutes) * 100;
        
        return metrics;
    }
}
```

---

## ISO 14001 - Environmental Management

### Standard Overview

**ISO 14001:2015** specifies requirements for an environmental management system to enhance environmental performance.

### JUL Environmental Initiatives

#### Paperless Operations
- **Digital Declarations**: 100% electronic submission
- **Electronic Certificates**: No paper clearance certificates
- **Document Management**: Digital storage in MinIO
- **Notifications**: Email/SMS instead of paper notices

#### Energy Efficiency
- **Green Data Centers**: Energy-efficient servers
- **Optimized Code**: Reduced processing power requirements
- **Auto-scaling**: Resources allocated based on demand
- **Carbon Footprint Monitoring**: Track and reduce emissions

```csharp
public class EnvironmentalMetrics
{
    public long PaperSheetsSaved { get; set; }
    public decimal CO2ReductionKg { get; set; }
    public decimal EnergyConsumptionKWh { get; set; }
    public int ElectronicTransactions { get; set; }
    
    public static EnvironmentalMetrics Calculate(int declarations)
    {
        return new EnvironmentalMetrics
        {
            // Average 25 sheets per declaration
            PaperSheetsSaved = declarations * 25,
            // 5kg CO2 per ream (500 sheets)
            CO2ReductionKg = (declarations * 25 * 5m) / 500,
            ElectronicTransactions = declarations
        };
    }
}
```

---

## ISO 45001 - Occupational Health and Safety

### Standard Overview

**ISO 45001:2018** specifies requirements for an occupational health and safety management system.

### Application in Customs Operations

#### Worker Safety
- **Cargo Inspection Safety**: Protective equipment for physical inspections
- **Radiation Safety**: X-ray and gamma-ray scanner operation
- **Chemical Hazards**: Handling of dangerous goods
- **Ergonomic Workstations**: Computer workstation design
- **Emergency Procedures**: Incident response plans

---

## ISO 28000 - Supply Chain Security

### Standard Overview

**ISO 28000:2022** specifies requirements for security management systems in the supply chain.

### JUL Supply Chain Security

#### Security Controls
- **Cargo Tracking**: Real-time shipment monitoring
- **Tamper-evident Seals**: Container seal verification
- **Access Control**: Restricted access to cargo areas
- **Surveillance**: CCTV monitoring at ports
- **Risk Assessment**: Automated threat detection

```csharp
public class SupplyChainSecurityCheck
{
    public bool VerifyContainerSeal(string containerNumber, string sealNumber)
    {
        var container = _database.Containers
            .FirstOrDefault(c => c.IdentificationId == containerNumber);
        
        if (container == null) return false;
        
        // Verify seal number matches manifest
        if (container.SealId != sealNumber)
        {
            _alertService.RaiseSecurityAlert(
                "Seal tampering detected",
                $"Container {containerNumber}: Expected seal {container.SealId}, found {sealNumber}");
            return false;
        }
        
        // Check seal in tampering database
        var tampered = _database.TamperedSeals
            .Any(t => t.SealNumber == sealNumber);
        
        if (tampered)
        {
            _alertService.RaiseSecurityAlert(
                "Known tampered seal",
                $"Seal {sealNumber} is on tampering watchlist");
            return false;
        }
        
        return true;
    }
}
```

---

## ISO 10383 - Market Identifier Codes

### Standard Overview

**ISO 10383** specifies a universal method of identifying exchanges, trading platforms, regulated or non-regulated markets and trade reporting facilities.

### Relevance to Trade

Used for identifying:
- Stock exchanges for traded goods
- Commodity markets
- Trading platforms for declaration of goods values

---

## ISO/IEC 20000 - IT Service Management

### Standard Overview

**ISO/IEC 20000-1:2018** specifies requirements for establishing, implementing, maintaining and continually improving a service management system (SMS).

### JUL IT Service Management

#### Service Catalog
- **Declaration Submission Service**: 99.9% availability
- **Document Management Service**: 99.5% availability
- **Payment Processing Service**: 99.95% availability
- **Notification Service**: 99.0% availability
- **Reporting Service**: 98.0% availability

#### Incident Management
```csharp
public enum IncidentPriority
{
    Critical = 1,  // System down - 15 min response
    High = 2,      // Major function impaired - 1 hour response
    Medium = 3,    // Minor function impaired - 4 hour response
    Low = 4        // Cosmetic issue - 1 day response
}

public class ITSMIncident
{
    public Guid IncidentId { get; set; }
    public DateTime ReportedDateTime { get; set; }
    public string ReportedBy { get; set; }
    public IncidentPriority Priority { get; set; }
    public string ServiceAffected { get; set; }
    public string Description { get; set; }
    public DateTime? ResponseDateTime { get; set; }
    public DateTime? ResolutionDateTime { get; set; }
    public string Resolution { get; set; }
    public bool SLAMet { get; set; }
}
```

### Key Controls for JUL System

#### A.5 - Information Security Policies
```
- Security policy document
- Review and update procedures
- Management approval and communication
```

#### A.9 - Access Control
```
- User access management
- Privileged access rights
- User access provisioning
- Review of user access rights
```

#### A.12 - Operations Security
```
- Documented operating procedures
- Change management
- Capacity management
- Malware protection
- Backup procedures
- Logging and monitoring
```

#### A.14 - System Acquisition, Development and Maintenance
```
- Security requirements analysis
- Secure development lifecycle
- Security testing
- Change control procedures
```

### JUL Implementation

```csharp
public class SecurityAuditLog
{
    public Guid AuditId { get; set; }
    public DateTime Timestamp { get; set; }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string Action { get; set; }
    public string Resource { get; set; }
    public string IPAddress { get; set; }
    public string UserAgent { get; set; }
    public string Result { get; set; } // Success, Failure, Denied
    public string Details { get; set; }
}

// Audit logging service
public class AuditService
{
    public async Task LogSecurityEvent(
        string userId,
        string action,
        string resource,
        string result,
        string details = null)
    {
        var audit = new SecurityAuditLog
        {
            AuditId = Guid.NewGuid(),
            Timestamp = DateTime.UtcNow,
            UserId = userId,
            UserName = await GetUserName(userId),
            Action = action,
            Resource = resource,
            IPAddress = _httpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = _httpContext.Request.Headers["User-Agent"].ToString(),
            Result = result,
            Details = details
        };
        
        await _database.SecurityAuditLogs.AddAsync(audit);
        await _database.SaveChangesAsync();
        
        // Alert on suspicious activity
        if (result == "Denied" || result == "Failure")
        {
            await CheckForSuspiciousActivity(userId, action);
        }
    }
}
```

---

## Best Practices

### 1. Data Validation

```csharp
public class ISODataValidator
{
    public ValidationResult ValidateInternationalData(Declaration declaration)
    {
        var errors = new List<string>();
        
        // Validate country codes (ISO 3166)
        if (!IsValidCountryCode(declaration.OriginCountryCode))
        {
            errors.Add($"Invalid origin country code: {declaration.OriginCountryCode}");
        }
        
        // Validate currency code (ISO 4217)
        if (!IsValidCurrencyCode(declaration.CurrencyCode))
        {
            errors.Add($"Invalid currency code: {declaration.CurrencyCode}");
        }
        
        // Validate date format (ISO 8601)
        if (!IsValidISO8601Date(declaration.DeclarationDate))
        {
            errors.Add("Invalid declaration date format");
        }
        
        // Validate containers (ISO 6346)
        foreach (var container in declaration.Containers)
        {
            if (!_containerValidator.IsValidContainerNumber(container.Number))
            {
                errors.Add($"Invalid container number: {container.Number}");
            }
        }
        
        return new ValidationResult(errors.Count == 0, errors);
    }
}
```

### 2. Master Data Synchronization

```csharp
public class MasterDataSync
{
    public async Task SyncISOData()
    {
        // Sync country codes
        await SyncCountries();
        
        // Sync currency codes
        await SyncCurrencies();
        
        // Update exchange rates
        await UpdateExchangeRates();
    }
    
    private async Task UpdateExchangeRates()
    {
        // Get rates from Central Bank of Angola
        var rates = await _centralBankService.GetExchangeRates();
        
        foreach (var rate in rates)
        {
            var existingRate = await _database.ExchangeRates
                .FirstOrDefaultAsync(r => 
                    r.FromCurrency.AlphaCode == "AOA" &&
                    r.ToCurrency.AlphaCode == rate.CurrencyCode &&
                    r.RateDate == rate.Date);
            
            if (existingRate == null)
            {
                // Add new rate
                await _database.ExchangeRates.AddAsync(new ExchangeRate
                {
                    RateId = Guid.NewGuid(),
                    FromCurrencyId = await GetCurrencyId("AOA"),
                    ToCurrencyId = await GetCurrencyId(rate.CurrencyCode),
                    RateDate = rate.Date,
                    Rate = rate.Value,
                    Source = "CENTRAL_BANK"
                });
            }
        }
        
        await _database.SaveChangesAsync();
    }
}
```

---

## References

### Official Standards
- **ISO 3166**: [ISO Country Codes](https://www.iso.org/iso-3166-country-codes.html)
- **ISO 4217**: [ISO Currency Codes](https://www.iso.org/iso-4217-currency-codes.html)
- **ISO 8601**: [ISO Date and Time](https://www.iso.org/iso-8601-date-and-time-format.html)
- **ISO 6346**: [ISO Container Codes](https://www.iso.org/standard/83558.html)
- **ISO 27001**: [ISO Information Security](https://www.iso.org/isoiec-27001-information-security.html)

### JUL Project Documents
- [WCO Data Model](wco-data-model.md)
- [Data Architecture](../implementation/data-architecture.md)
- JUL High Level Design Document

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Author**: JUL Technical Team  
**Status**: Production Ready
