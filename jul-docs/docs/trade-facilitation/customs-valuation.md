# Customs Valuation

**Complete Guide to WTO Valuation Agreement Implementation in Angola**

---

## Table of Contents

1. [Overview](#overview)
2. [WTO Valuation Agreement](#wto-valuation-agreement)
3. [Six Valuation Methods](#six-valuation-methods)
4. [Transaction Value Method](#transaction-value-method)
5. [Valuation Adjustments](#valuation-adjustments)
6. [Related Party Transactions](#related-party-transactions)
7. [Transfer Pricing](#transfer-pricing)
8. [Special Cases](#special-cases)
9. [Advance Rulings](#advance-rulings)
10. [Disputes and Appeals](#disputes-and-appeals)

---

## Overview

### What is Customs Valuation?

**Customs Valuation** is the process of determining the **customs value** of imported goods for the purpose of:
- Calculating import duties (ad valorem)
- Collecting accurate tax revenue
- Compiling trade statistics
- Applying trade policy measures
- Monitoring quantitative restrictions

**Importance**:
- Determines duty base for taxation
- Impacts trade competitiveness
- Affects government revenue
- Subject to international rules
- Can be disputed between traders and customs

### Legal Framework

**International**:
- **WTO Valuation Agreement** (Agreement on Implementation of Article VII of GATT 1994)
- **WCO Technical Committee on Customs Valuation** decisions
- **WCO Guide to Customs Valuation and Transfer Pricing**

**Angola**:
- **Código Aduaneiro** (Customs Code) - Articles on valuation
- **Regulamento da Pauta Aduaneira** - Tariff regulation
- **Despachos Normativos AGT** - AGT normative orders on valuation

### Customs Value vs Commercial Value

**Key Differences**:

| Aspect | Commercial Value | Customs Value |
|--------|-----------------|---------------|
| **Basis** | Negotiated price between parties | Statutory adjustments to transaction value |
| **Currency** | Any agreed currency | Converted to AOA at official rate |
| **Inclusions** | As per sales contract | Mandatory additions (freight, insurance, assists) |
| **Exclusions** | As per sales contract | Mandatory deductions (post-import costs) |
| **Purpose** | Commercial transaction | Duty calculation |
| **Regulation** | Contract law | Customs law (WTO Agreement) |

**Example**:
```
Commercial Invoice:
- FOB Price: $10,000
- Freight to Luanda: $1,500
- Insurance: $100
- Total Invoice: $11,600

Customs Value (CIF):
- FOB Price: $10,000
- Freight: $1,500
- Insurance: $100
- Royalty (paid separately): $500
- Packing costs: $200
= Customs Value: $12,300
```

---

## WTO Valuation Agreement

### Purpose and Principles

**Objectives**:
- Fair, uniform, and neutral system
- Reflect economic reality
- Prohibit arbitrary or fictitious values
- Prevent protectionist valuation
- Provide certainty and predictability

**Core Principles**:

1. **Positive System**: Based on actual transaction value, not notional/constructed values
2. **Sequential Application**: Methods applied in hierarchical order
3. **Transaction Value Primacy**: Transaction value preferred unless specific conditions unmet
4. **Consultation**: Right to explanation and consultation with importer
5. **Appeal Rights**: Right to appeal valuation decisions

### The Six Methods

Methods must be applied **sequentially** - move to next method only if previous is inapplicable:

1. **Transaction Value of Imported Goods** (Primary method)
2. **Transaction Value of Identical Goods**
3. **Transaction Value of Similar Goods**
4. **Deductive Value Method**
5. **Computed Value Method**
6. **Fall-back Method** (reasonable means consistent with principles)

**Flexibility**: Methods 4 and 5 can be reversed at importer's request.

```csharp
public class ValuationMethodSelector
{
    public async Task<CustomsValue> DetermineCustomsValue(ImportDeclaration declaration)
    {
        // Method 1: Transaction Value
        var transactionValue = await TryTransactionValue(declaration);
        if (transactionValue.IsAcceptable)
            return transactionValue;
        
        // Method 2: Identical Goods
        var identicalValue = await TryIdenticalGoods(declaration);
        if (identicalValue.Found)
            return identicalValue;
        
        // Method 3: Similar Goods
        var similarValue = await TrySimilarGoods(declaration);
        if (similarValue.Found)
            return similarValue;
        
        // Methods 4 & 5: Can be reversed at importer request
        if (declaration.PreferComputedMethod)
        {
            var computedValue = await TryComputedMethod(declaration);
            if (computedValue.Feasible)
                return computedValue;
            
            var deductiveValue = await TryDeductiveMethod(declaration);
            if (deductiveValue.Feasible)
                return deductiveValue;
        }
        else
        {
            var deductiveValue = await TryDeductiveMethod(declaration);
            if (deductiveValue.Feasible)
                return deductiveValue;
            
            var computedValue = await TryComputedMethod(declaration);
            if (computedValue.Feasible)
                return computedValue;
        }
        
        // Method 6: Fall-back
        return await ApplyFallbackMethod(declaration);
    }
}
```

---

## Six Valuation Methods

### Method 1: Transaction Value

**Definition**: The price actually paid or payable for goods when sold for export to the country of importation, adjusted as required.

**Conditions for Acceptance**:
1. Sale for export to Angola exists
2. No restrictions on use (except those by law, limit geographical area, or don't affect value)
3. Sale not subject to conditions that can't be valued
4. No proceeds revert to seller unless can be quantified
5. Buyer and seller not related, OR relationship didn't influence price

**Formula**:
```
Transaction Value = Price Paid/Payable
                    + Adjustments (additions)
                    - Deductions (exclusions)
```

**When to Reject**:
- No actual sale (consignment, leasing)
- Price contingent on unknowable conditions
- Related party transaction where price influenced
- Insufficient information to make adjustments

### Method 2: Identical Goods

**Definition**: Transaction value of **identical goods** sold for export to Angola at/near same time.

**"Identical" Criteria**:
- Same physical characteristics
- Same quality and reputation
- Same country of origin
- Same producer (if possible)

**Acceptable Differences**:
- Minor differences in appearance (don't affect value)

**Adjustments Required**:
- Commercial level (wholesale vs retail)
- Quantity (volume discounts)
- Transportation costs to port of importation

**Example**:
```typescript
interface IdenticalGoodsComparison {
    targetGoods: {
        description: "Apple iPhone 15 Pro, 256GB, Black";
        quantity: 100;
        origin: "China";
        manufacturer: "Apple Inc.";
        transactionValue: null; // Being determined
    };
    
    identicalGoodsFound: {
        description: "Apple iPhone 15 Pro, 256GB, Black";
        quantity: 200;  // Different quantity
        origin: "China";
        manufacturer: "Apple Inc.";
        transactionValue: 110000; // Per 200 units
        importDate: "2025-12-15"; // Within 90 days
    };
    
    adjustments: {
        quantityAdjustment: -5000; // Volume discount for 200 units
        freightDifference: 2000;   // Different shipping route
        adjustedValue: 107000;     // For 200 units
        perUnitValue: 535;         // 107000 / 200
        targetCustomsValue: 53500; // 535 * 100 units
    };
}
```

**Time Proximity**: "Same time" typically means within 90 days.

### Method 3: Similar Goods

**Definition**: Transaction value of **similar goods** sold for export to Angola at/near same time.

**"Similar" Criteria**:
- Commercially interchangeable
- Like characteristics and materials
- Same function
- Same quality/reputation
- Same country of origin
- Same producer (if possible)

**Not Required to be Identical**:
- Can have minor differences
- Must be commercially interchangeable
- Must perform same functions

**Hierarchy**:
1. Prefer identical goods over similar
2. Prefer same producer
3. Prefer exports at same commercial level
4. Prefer same quantity

**Example**:
```
Target: Samsung Galaxy S24, 128GB, Violet
Similar: Samsung Galaxy S24, 128GB, Black (different color but same specs)

Target: Nike Air Max 270, Size 42, Blue
Similar: Nike Air Max 270, Size 42, Red (same model, different color)
```

### Method 4: Deductive Value

**Definition**: Based on resale price in Angola, working backwards.

**Formula**:
```
Deductive Value = Unit Resale Price
                  - Commission/Profit
                  - Transport/Insurance in Angola
                  - Customs Duties/Taxes
                  - Value Added in Angola
```

**Requirements**:
- Goods resold in Angola "as imported" (unchanged condition)
- Resale at/near time of importation (usually within 90 days)
- Importer provides sufficient data

**Three Options** (in order):

**Option 1**: Resale of imported goods at/near time of importation
```csharp
public decimal CalculateDeductiveValue_Option1(ResaleData resale)
{
    decimal unitPrice = resale.ResalePrice / resale.QuantitySold;
    
    // Deductions
    decimal commission = resale.CommissionPaid;
    decimal profit = resale.GeneralExpenses + resale.Profit;
    decimal inlandCosts = resale.TransportInAngola + resale.HandlingInAngola;
    decimal dutiesPaid = resale.CustomsDuty + resale.VAT + resale.Excise;
    
    return unitPrice - commission - profit - inlandCosts - dutiesPaid;
}
```

**Option 2**: Resale of identical/similar goods at/near time of importation

**Option 3**: Resale of imported goods after further processing
```csharp
public decimal CalculateDeductiveValue_Option3(ProcessedResaleData resale)
{
    decimal unitPrice = resale.ResalePrice / resale.QuantitySold;
    
    // Additional deduction for value added
    decimal valueAdded = resale.ProcessingCosts + 
                        resale.MaterialsAdded + 
                        resale.ProfitFromProcessing;
    
    return CalculateDeductiveValue_Option1(resale) - valueAdded;
}
```

**When Unusable**:
- Goods not resold in Angola
- Further processing makes valuation impossible
- Importer doesn't maintain records

### Method 5: Computed Value

**Definition**: Built up from production costs and profit.

**Formula**:
```
Computed Value = Materials & Fabrication Costs
                 + Profit and General Expenses (export sales)
                 + Packing Costs
                 + Freight/Insurance to Port
                 + Loading/Handling Charges
```

**Requirements**:
- Producer cooperation (must provide cost data)
- Access to producer's accounting records
- Verifiable costs
- Consistent with commercial accounting principles in producer country

**Example**:
```typescript
interface ComputedValueCalculation {
    // Production costs
    directMaterials: 5000;        // Raw materials
    directLabor: 2000;            // Manufacturing labor
    factoryOverhead: 1500;        // Allocated overhead
    
    // Profit and general expenses
    profitMargin: 1000;           // Typical profit on exports
    generalExpenses: 800;          // Admin, selling costs
    
    // Other costs
    packingForExport: 300;
    freightToPort: 800;
    insurance: 50;
    loadingCharges: 150;
    
    // Total computed value
    computedValue: 11600;
}
```

**Challenges**:
- Producer may refuse to provide data
- Commercial sensitivity
- Different accounting standards
- Transfer pricing complications

**Rarely Used**: Because of difficulty obtaining producer cooperation.

### Method 6: Fall-back

**Definition**: Flexible method using reasonable means consistent with WCO principles and Article VII of GATT.

**Acceptable Approaches**:
- Modify methods 1-5 with flexibility
- Use previously determined values
- Reference price databases
- Expert opinions
- Comparable goods analysis

**Prohibited Approaches**:
- Selling price in country of exportation
- Higher of two alternative values
- Price in domestic market of importing country
- Cost of production (other than computed value)
- Arbitrary or fictitious values
- Minimum customs values

**Example**:
```csharp
public class FallbackMethodService
{
    public async Task<CustomsValue> ApplyFallbackMethod(ImportDeclaration decl)
    {
        // Option 1: Flexible application of Transaction Value
        if (decl.HasSaleButMinorIssue)
        {
            var flexibleTV = await ApplyFlexibleTransactionValue(decl);
            if (flexibleTV.Reasonable)
                return flexibleTV;
        }
        
        // Option 2: Database comparison
        var databaseValue = await ConsultValuationDatabase(
            decl.HSCode, 
            decl.OriginCountry, 
            decl.Quantity
        );
        if (databaseValue.ReliableComparison)
            return databaseValue;
        
        // Option 3: Expert valuation
        var expertOpinion = await RequestExpertValuation(decl);
        
        // Document rationale
        await LogFallbackJustification(decl, expertOpinion);
        
        return expertOpinion;
    }
}
```

---

## Transaction Value Method

### Price Actually Paid or Payable

**Definition**: Total payment made or to be made by buyer to seller for imported goods.

**Includes**:
- All payments as condition of sale
- Direct payments to seller
- Indirect payments for seller's benefit
- Payments to third party to satisfy seller's obligation

**Forms of Payment**:
- Cash/bank transfer
- Letters of credit
- Promissory notes
- Barter/countertrade (fair value)
- Debt settlement

**Example - Direct Payment**:
```
Invoice Amount: $50,000
Payment Terms: 30% advance, 70% on delivery
Total Paid/Payable: $50,000
```

**Example - Indirect Payment**:
```
Invoice to Seller: $40,000
Buyer also pays seller's debt to third party: $5,000
Total Price Paid/Payable: $45,000
```

**Not Included**:
- Dividends (normal return on investment, not condition of sale)
- Post-importation costs (after goods enter Angola)
- Buying commissions (paid by buyer to own agent)

### Sale for Export

**Requirements**:
1. Must be genuine sale (transfer of ownership)
2. For export to country of importation
3. Documented by contract/invoice

**Not Considered "Sale"**:
- Consignment shipments
- Leasing/rental agreements
- Free samples
- Warranty replacements
- Goods on approval

**Test for Sale**:
```typescript
interface SaleTest {
    criteriaChecked: {
        transferOfOwnership: boolean;       // Buyer becomes owner
        assumptionOfRisk: boolean;          // Buyer bears loss risk
        paymentObligation: boolean;         // Buyer must pay
        rightToResell: boolean;             // Buyer can resell freely
    };
    
    documentaryEvidence: {
        salesContract: boolean;
        commercialInvoice: boolean;
        paymentRecords: boolean;
    };
    
    isSale: boolean; // True if all criteria met
}
```

### Time of Sale

**Relevant Time**: When goods sold for export, NOT when:
- Contract signed (if earlier)
- Goods manufactured
- Shipped
- Imported

**Impact on Valuation**:
- Determines applicable exchange rate
- Identifies relevant adjustments
- Establishes comparison timeframe for identical/similar goods

---

## Valuation Adjustments

### Additions to Price Paid/Payable

Must be added if:
1. Incurred by buyer
2. Not already included in price
3. Based on objective and quantifiable data

#### 1. Commissions and Brokerage

**Buying Commissions** ❌ NOT added:
- Paid by buyer to own purchasing agent
- For services of representing buyer
- Buyer's cost, not seller's revenue

**Selling Commissions** ✅ ADDED:
- Paid by buyer to seller's agent
- Seller's remuneration for sale
- Part of transaction value

```typescript
interface CommissionAdjustment {
    sellingCommission: {
        amount: 2000;
        paidTo: "Seller's Sales Agent";
        addToValue: true;
    };
    
    buyingCommission: {
        amount: 1500;
        paidTo: "Buyer's Purchasing Office";
        addToValue: false;  // Excluded
    };
}
```

#### 2. Packing Costs

**Included** ✅:
- Containers for transport
- Pallets, crates, boxes
- Packing materials
- Labor for packing

**Example**:
```csharp
public decimal CalculatePackingCosts(ShipmentDetails shipment)
{
    decimal containerCost = shipment.ContainerRental;
    decimal cratingCost = shipment.WoodenCrates;
    decimal packagingMaterial = shipment.BubbleWrap + shipment.Strapping;
    decimal packingLabor = shipment.PackingHours * shipment.LaborRate;
    
    return containerCost + cratingCost + packagingMaterial + packingLabor;
}
```

#### 3. Assists

**Definition**: Goods or services provided by buyer to seller, free or at reduced cost, for use in production/sale of imported goods.

**Categories**:

**Materials** ✅:
- Components incorporated
- Raw materials
- Parts and ingredients
- Consumables used in production

**Tools/Molds/Dies** ✅:
- Equipment used to produce goods
- Molds for injection molding
- Dies for stamping
- Patterns for casting

**Engineering/Development** ✅:
- Design work done outside Angola
- Development work
- Engineering
- Plans and sketches

**Example**:
```typescript
interface Assists {
    materials: {
        components: 5000;      // Electronic chips provided to manufacturer
        rawMaterials: 0;
        addToValue: 5000;
    };
    
    toolsDiesMolds: {
        injectionMold: 50000;  // Mold cost $50k, useful life 5 years
        unitsProduced: 10000;  // Expected units over life
        thisShipment: 2000;    // Current shipment quantity
        allocation: 10000;     // (50000 / 10000) * 2000
        addToValue: 10000;
    };
    
    engineering: {
        designFees: 20000;     // Design work in Italy
        allocatedToShipment: 4000;
        addToValue: 4000;
    };
    
    totalAssists: 19000;
}
```

**Apportionment**: Assist value apportioned over:
- Number of units produced using assist
- Period of time assist used
- Reasonable method consistent with GAAP

**Not Assists**:
- Engineering in Angola (post-importation)
- Buyer's routine business costs
- Marketing materials

#### 4. Royalties and License Fees

**Added if** ✅:
1. Paid by buyer (directly or indirectly)
2. Related to imported goods
3. Condition of sale
4. Not already included in price

**Examples Added**:
- Trademark license fees
- Patent royalties
- Copyright fees for reproductions
- Brand name usage fees

**Examples NOT Added**:
- Right to reproduce goods in Angola (post-import)
- Franchise fees for business operation
- Royalties unrelated to imported goods

```csharp
public class RoyaltyAnalysis
{
    public bool ShouldAddRoyalty(RoyaltyAgreement royalty, ImportedGoods goods)
    {
        // Test 1: Paid by buyer?
        if (!royalty.PaidByBuyer)
            return false;
        
        // Test 2: Related to imported goods?
        if (!IsRelatedToGoods(royalty, goods))
            return false;
        
        // Test 3: Condition of sale?
        if (!royalty.IsConditionOfSale)
            return false;
        
        // Test 4: Already in invoice?
        if (royalty.IncludedInInvoicePrice)
            return false;
        
        return true; // Add to customs value
    }
    
    private bool IsRelatedToGoods(RoyaltyAgreement royalty, ImportedGoods goods)
    {
        // Related if:
        // - Paid for right to use IP in/on the goods
        // - Calculated based on imported goods (per unit)
        // - Required to purchase goods
        
        return royalty.AppliesToProduct && 
               (royalty.CalculationBasis == "PER_UNIT" || 
                royalty.RequiredForPurchase);
    }
}
```

#### 5. Proceeds of Resale

**Added if** ✅:
- Part of resale value reverts to seller
- Condition of sale arrangement
- Quantifiable amount

**Example**:
```
Buyer purchases smartphones for $100,000
Agreement: Buyer pays seller 10% of resale proceeds
Buyer resells for $150,000
Additional payment to seller: $15,000

Customs Value = $100,000 + $15,000 = $115,000
```

**Rare in Practice**: Unusual arrangement.

#### 6. Freight and Insurance

**To Place of Importation** ✅:
- International freight
- Marine/air insurance
- Loading charges at export
- Handling at transshipment points

**Formula**:
```
CIF Value = FOB Value + International Freight + Insurance
```

**Example**:
```typescript
interface FreightInsuranceAdjustment {
    invoice: {
        fobValue: 10000;           // Ex-works Shanghai
        incoterm: "FOB Shanghai";
    };
    
    additions: {
        freightShanghai_Luanda: 1500;
        marineInsurance: 100;
        loadingCharges: 50;
    };
    
    cifValue: 11650; // 10000 + 1500 + 100 + 50
}
```

**Insurance Rate**: If not declared, customs may use 0.5% of FOB + freight.

### Deductions from Price

**Excluded from Customs Value** ❌:

#### 1. Post-Importation Costs

- Inland transport in Angola
- Construction/installation after import
- Assembly work in Angola
- After-sales service
- Warranty costs

**Example**:
```
Invoice shows:
- FOB Equipment: $50,000
- Freight to Luanda: $5,000
- Installation in Luanda: $8,000
- Training of staff: $2,000
Total Invoice: $65,000

Customs Value: $55,000 (excludes installation & training)
```

#### 2. Customs Duties and Taxes

- Import duties
- VAT
- Excise taxes
- Other fiscal charges

**Important**: Must be shown separately on invoice.

#### 3. Interest Charges

Excluded if:
- Financing arrangement separate from sale
- Interest identified separately
- Interest rate not excessive

```typescript
interface FinancingArrangement {
    goodsPrice: 100000;
    interest: {
        amount: 5000;
        period: "12 months";
        rate: "5% per annum";
        shownSeparately: true;
        rateReasonable: true;
    };
    customsValue: 100000; // Excludes interest
}
```

---

## Related Party Transactions

### Definition of Related Parties

**Related if**:

1. **Officers/Directors**: One person is officer/director of other's business
2. **Partners**: Business partners
3. **Employer-Employee**: Employment relationship
4. **Ownership (5% rule)**: 
   - Person directly/indirectly owns 5%+ of both entities
   - One person owns/controls both
5. **Family**: Members of same family
6. **Control**: One controls the other
7. **Together Control**: Both controlled by third person
8. **Collectively Control**: Together control a third person

**Example - Ownership**:
```
Company A (Angola) imports from Company B (China)
Person X owns 30% of Company A and 20% of Company B
= Related parties (5%+ ownership in both)
```

**Example - Control**:
```
Parent Company (USA)
├── Subsidiary A (Angola) - 100% owned
└── Subsidiary B (China) - 100% owned

Subsidiary A importing from Subsidiary B = Related parties
```

### Test for Related Party Influence

**Two-Stage Process**:

**Stage 1**: Are buyer and seller related?
- If NO → Transaction value acceptable (if other conditions met)
- If YES → Proceed to Stage 2

**Stage 2**: Did relationship influence price?
- If NO → Transaction value acceptable
- If YES → Transaction value rejected, use alternative method

```csharp
public class RelatedPartyTest
{
    public ValuationDecision EvaluateRelatedPartyTransaction(
        ImportDeclaration declaration)
    {
        // Stage 1: Check if related
        bool areRelated = IsRelatedParty(
            declaration.Buyer, 
            declaration.Seller
        );
        
        if (!areRelated)
        {
            return new ValuationDecision
            {
                TransactionValueAcceptable = true,
                Reason = "Parties not related"
            };
        }
        
        // Stage 2: Check if price influenced
        bool priceInfluenced = WasPriceInfluenced(declaration);
        
        if (!priceInfluenced)
        {
            return new ValuationDecision
            {
                TransactionValueAcceptable = true,
                Reason = "Related but price not influenced - test values prove arm's length"
            };
        }
        
        return new ValuationDecision
        {
            TransactionValueAcceptable = false,
            Reason = "Relationship influenced price",
            AlternativeMethod = "Use Method 2 (Identical Goods)"
        };
    }
}
```

### Test Values

**Importer can prove price acceptable** using:

**Test 1 - Transaction Value Test**:
Compare to previously accepted transaction value for identical/similar goods from same seller to unrelated buyers in Angola.

```typescript
interface Test1_TransactionValue {
    relatedPartyPrice: 10000;
    
    unrelatedSales: {
        sale1: { price: 10200, buyer: "Unrelated Buyer A", date: "2025-10-15" };
        sale2: { price: 9900, buyer: "Unrelated Buyer B", date: "2025-11-20" };
        sale3: { price: 10100, buyer: "Unrelated Buyer C", date: "2025-12-01" };
    };
    
    analysis: {
        averageUnrelatedPrice: 10067;
        variance: 1.5; // % from average
        conclusion: "ACCEPTABLE - within normal price range";
    };
}
```

**Test 2 - Deductive Value Test**:
Compare to deductive value of identical/similar goods.

**Test 3 - Computed Value Test**:
Compare to computed value of identical/similar goods.

**Burden of Proof**: On importer to demonstrate price not influenced.

### Documentation Requirements

**Must Provide**:
1. Transfer pricing documentation
2. Comparables analysis
3. Functional analysis (OECD guidelines)
4. Profit and loss statements
5. Pricing policies
6. Intercompany agreements

---

## Transfer Pricing

### Relationship with Customs Valuation

**Different Objectives**:

| Aspect | Transfer Pricing | Customs Valuation |
|--------|-----------------|-------------------|
| **Purpose** | Tax allocation between countries | Duty calculation |
| **Authority** | Tax authorities | Customs authorities |
| **Legal Basis** | OECD Guidelines | WTO Valuation Agreement |
| **Principle** | Arm's length | Transaction value |
| **Timing** | Annual reconciliation | Importation |

**Potential Conflict**:
- Transfer pricing may set price higher (profit allocation)
- Customs valuation may be lower (actual transaction)
- Both must be defensible

### OECD Transfer Pricing Methods

**Comparison with WTO Methods**:

| OECD Method | WTO Method | Similarity |
|-------------|-----------|------------|
| Comparable Uncontrolled Price (CUP) | Transaction Value | Close match |
| Resale Price Method | Deductive Value | Similar concept |
| Cost Plus Method | Computed Value | Similar concept |
| Transactional Net Margin Method | No equivalent | - |
| Profit Split Method | No equivalent | - |

### Reconciliation Strategies

**Approach 1: Align TP with CV**:
```typescript
interface AlignmentStrategy {
    transferPrice: 12000;        // TP study determines arm's length price
    declareToCustoms: 12000;     // Use same value for customs
    
    benefits: {
        consistency: true;
        reduceAuditRisk: true;
        administrativeSimplicity: true;
    };
    
    risks: {
        higherDuties: true;        // If TP price higher than transaction value
        competitiveDisadvantage: false;
    };
}
```

**Approach 2: Accept Difference**:
```typescript
interface AcceptDifferenceStrategy {
    transactionPrice: 10000;     // Actual price paid (customs value)
    transferPrice: 12000;        // TP allocation (tax purposes)
    
    documentation: {
        customsValuation: "Based on actual transaction price paid";
        transferPricing: "Arm's length adjustment for profit allocation";
        justification: "Different purposes, both defensible";
    };
    
    risks: {
        doubleAudit: true;         // Both customs and tax scrutiny
        explanationBurden: true;
        needStrongDocumentation: true;
    };
}
```

### WCO Guide Recommendations

**Best Practices**:
1. Maintain contemporaneous documentation
2. Conduct functional analysis
3. Identify comparables
4. Demonstrate arm's length pricing
5. Cooperate with authorities
6. Consider Advance Pricing Agreements (APA) with Advance Valuation Rulings

---

## Special Cases

### Leased/Rented Goods

**Not "Sale"**: Transaction value cannot apply.

**Valuation Approach**:
- Use transaction value of identical/similar goods sold
- If none, use deductive or computed value
- Consider lease payments over ownership period
- Classify as temporary admission if returning

### Consignment Sales

**No Sale at Import**: Agent doesn't buy goods.

**Valuation**:
- Value determined when actual sale occurs
- Provisional entry possible
- Final adjustment when sold
- Or use comparable sales

### Software and Digital Products

**Physical Media**:
```
CD containing software valued at:
= Cost of carrier medium (CD)
+ Cost of data on medium
```

**Downloaded Software**: Not subject to customs duties (no importation of goods).

### Free of Charge Goods

**Samples**: Nominal value or production cost

**Warranty Replacements**: Original invoice value

**Gifts**: Fair market value

### Barter/Countertrade

**Valuation**: Fair market value of goods received in exchange.

### Restricted Goods

**Price includes restriction**: Use transaction value if quantifiable.

**Examples**:
- Geographic use restriction (doesn't affect value)
- Resale restriction (may affect value)
- Use restriction by law (doesn't affect value)

---

## Advance Rulings

### Valuation Advance Ruling

**Definition**: Binding decision by AGT on valuation treatment before goods imported.

**Benefits**:
- Certainty before transaction
- Faster clearance
- Reduced disputes
- Compliance assurance

### Application Process

**Steps**:

1. **Submit Application**:
   - Detailed product description
   - Proposed valuation method
   - Supporting documentation
   - Circumstances of sale

2. **AGT Review** (60-90 days):
   - Evaluate information
   - Request additional details if needed
   - Consult WCO guidance

3. **Ruling Issued**:
   - Written decision
   - Binding for 3 years
   - Can be revoked if facts change

4. **Implementation**:
   - Reference ruling in declarations
   - Provide ruling number
   - Faster assessment

```csharp
public class AdvanceRulingApplication
{
    public string ApplicantNIF { get; set; }
    public string ProductDescription { get; set; }
    public string HSCode { get; set; }
    
    public ValuationMethod ProposedMethod { get; set; }
    public decimal ProposedValue { get; set; }
    
    public SaleCircumstances Circumstances { get; set; }
    public RelatedPartyInfo RelatedPartyDetails { get; set; }
    public List<Document> SupportingDocs { get; set; }
    
    public string Justification { get; set; }
}
```

### When to Request

**Scenarios**:
- Complex valuation (assists, royalties)
- Related party transactions
- New product line
- High-value imports
- Frequent shipments
- Audit risk mitigation

---

## Disputes and Appeals

### Valuation Disputes

**Common Issues**:
1. Rejection of transaction value
2. Disagreement on adjustments
3. Related party pricing
4. Royalty treatment
5. Assist allocation

### Dispute Resolution Process

**Stage 1: Consultation (Informal)**:
```typescript
interface InformalConsultation {
    trigger: "AGT questions declared value";
    
    process: {
        agtExplainsReason: true;
        importerProvidesInfo: true;
        discussionOfFacts: true;
        mutualUnderstanding: "goal";
    };
    
    timeline: "5-10 business days";
    
    outcomes: [
        "Agreement reached - value accepted",
        "Importer provides additional docs - resolved",
        "Disagreement persists - escalate to formal appeal"
    ];
}
```

**Stage 2: Formal Appeal**:

1. **First Level - AGT Review**:
   - Written appeal within 30 days
   - Submit evidence
   - AGT reconsiders (30-45 days)

2. **Second Level - Administrative Tribunal**:
   - Appeal within 15 days of first decision
   - Hearing scheduled
   - Decision (60-90 days)

3. **Third Level - Courts**:
   - Judicial review
   - Full legal process
   - Final determination

```csharp
public class ValuationAppeal
{
    public string DeclarationNumber { get; set; }
    public DateTime AppealDate { get; set; }
    
    public ValuationPosition ImporterPosition { get; set; }
    public ValuationPosition CustomsPosition { get; set; }
    
    public decimal DisputedAmount { get; set; }
    public decimal DutyImpact { get; set; }
    
    public List<Document> Evidence { get; set; }
    public string LegalArgument { get; set; }
    
    public List<WTOPrecedent> RelevantCases { get; set; }
    public List<WCOAdvisory> RelevantOpinions { get; set; }
}
```

### Best Practices for Dispute Avoidance

**Preventive Measures**:
1. Request advance ruling for complex cases
2. Maintain comprehensive documentation
3. Transparent communication with customs
4. Regular compliance reviews
5. Seek broker/consultant advice
6. Monitor WCO/WTO developments

---

## Valuation Database

### National Valuation Database

**Purpose**:
- Reference for customs officers
- Identify under-valued imports
- Consistency across ports
- Risk profiling

**Contents**:
- Historical import values
- By HS code, origin, quantity
- Price ranges and averages
- Outlier identification

**Use in Declarations**:
```csharp
public class ValuationDatabaseCheck
{
    public async Task<ValidationResult> CheckAgainstDatabase(
        Declaration declaration)
    {
        var historicalData = await _database.GetHistoricalValues(
            declaration.HSCode,
            declaration.OriginCountry,
            declaration.Quantity
        );
        
        if (!historicalData.Any())
            return new ValidationResult { Status = "NO_DATA" };
        
        var average = historicalData.Average(d => d.UnitValue);
        var declaredUnitValue = declaration.CustomsValue / declaration.Quantity;
        
        var variance = Math.Abs((declaredUnitValue - average) / average * 100);
        
        if (variance > 30) // 30% threshold
        {
            return new ValidationResult
            {
                Status = "QUERY",
                Message = $"Declared value {variance:F1}% below average",
                RequiresJustification = true
            };
        }
        
        return new ValidationResult { Status = "ACCEPTABLE" };
    }
}
```

**Not Determinative**: Database values are reference only, not minimum values.

---

## Summary

### Key Principles

1. **Transaction Value Primary**: Use actual price paid unless specific reasons exist
2. **Sequential Application**: Methods must be applied in order
3. **Objective Data**: All adjustments based on quantifiable data
4. **Consultation Rights**: Importers entitled to explanation
5. **Appeal Rights**: Valuation decisions can be appealed

### Common Errors to Avoid

**Importer Errors**:
- Under-declaring assists
- Omitting royalties
- Not documenting related party pricing
- Insufficient proof for test values
- Missing post-import cost breakdown

**Customs Errors**:
- Rejecting transaction value without valid reason
- Using minimum values
- Applying wrong method sequence
- Not providing adequate explanation
- Arbitrary uplifts

### Documentation Checklist

**Essential Documents**:
- [ ] Commercial invoice (detailed)
- [ ] Sales contract/purchase order
- [ ] Payment records
- [ ] Freight and insurance invoices
- [ ] Packing list
- [ ] Certificate of origin
- [ ] Assist agreements (if any)
- [ ] Royalty/license agreements (if any)
- [ ] Transfer pricing documentation (related parties)
- [ ] Previous valuations (for comparison)

### Resources

**WTO**:
- Agreement on Customs Valuation (Article VII GATT)
- Technical Committee decisions

**WCO**:
- Customs Valuation Compendium
- Advisory Opinions
- Guide to Customs Valuation and Transfer Pricing
- Valuation Database Guidelines

**Angola AGT**:
- Valuation procedures manual
- Advance ruling application forms
- Appeal procedures

---

By understanding and properly applying WTO customs valuation principles, importers can ensure compliance, minimize disputes, and optimize duty payments while maintaining defensible positions in case of audit or disagreement.
