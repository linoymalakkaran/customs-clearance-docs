---
id: clarification
title: Clarifications & Standards Considerations
sidebar_label: Clarifications
---

# Clarifications & Standards Considerations

This document consolidates:
- Standards-driven considerations for building JUL Single Window capabilities across port + customs clearance.
- WCO Time Release Study (TRS) benchmarks to design for measurable performance.
- Open questions/clarifications to resolve before finalizing integrations and process design.

---

## A. Standards-driven build considerations (what to implement)

### 1) Canonical data model (WCO Data Model 3.10)
Reference: [standards/wco-data-model](standards/wco-data-model)

Build the internal domain model and APIs around WCO concepts so port and customs use the same “single source of truth”:
- Declaration structure and elements
- Party information
- Goods items
- Transport and logistics
- Valuation and duty calculation

Key principles to enforce:
- Information reusability: define each data element once and reuse it across processes.
- Reference data: use shared code lists across all declarations.
- Extensibility: support Angola-specific extensions without breaking the core model.

### 2) Message exchange / interoperability (UN/EDIFACT)
Reference: [standards/un-edifact](standards/un-edifact)

If integrating with customs or legacy systems via EDI, treat EDIFACT as an integration format:
- Outbound: CUSDEC (customs declaration)
- Inbound: CUSRES (customs response/assessment)
- Cargo reporting (future/where applicable): CUSCAR

Clarify notification/response mechanisms:
- REST vs EDI, or hybrid (e.g., REST for portal + EDI for ASYCUDA).

### 3) Classification (HS) and policy/routing logic
Reference: [standards/hs-classification](standards/hs-classification)

HS is central to:
- Duty/tax calculation
- Risk rules and channeling
- OGA routing (different agencies depending on commodity)
- Restrictions, permits, and prohibitions

Design implications:
- Support HS versions (e.g., 2017 and 2022) and national extensions.
- Maintain mapping between versions (one-to-many and many-to-one).
- Handle ambiguity (user selection + audit trail).

### 4) ISO reference data and security baselines
Reference: [standards/iso-standards](standards/iso-standards)

Standardize system-wide representations:
- ISO 3166: country codes
- ISO 4217: currency codes
- ISO 8601: date/time
- ISO 6346: container identification
- ISO 27001: information security management practices

### 4a) Standardize data and identifiers (cross-standard)
Use these standards consistently across UI forms, APIs, storage, and integrations:
- WCO Data Model 3.10 (canonical structure)
- UN/EDIFACT messages (integration format where applicable)
- ISO standards (countries, currencies, date/time, container identification)
- GS1 standards (product identification) where required by business/partners

### 5) Single Window process (single submission and coordinated routing)
Target user experience and orchestration pattern:

Trader submits ONCE to JUL Portal:
└── Single electronic submission
    ├── Automatically routed to AGT
    ├── Automatically routed to INAMAR
    ├── Automatically routed to Health Ministry
    ├── Automatically routed to Agriculture Ministry
    ├── Automatically routed to Central Bank
    ├── Automatically routed to Standards Agency
    └── Consolidated response back to trader

Result: 6–24 hours, zero office visits, paperless, cost-effective.

Implementation notes:
- Identify data capture and re-use points as part of harmonization.
- Define orchestration states and final “consolidated outcome” rules.

### 6) AEO programs (WCO)
Reference: [standards/comprehensive-standards-overview](standards/comprehensive-standards-overview)

Consider AEO/trusted trader features as a cross-cutting requirement:
- Reduced inspections, priority processing
- Simplified procedures, deferred payment options (if policy allows)
- Mutual recognition (future)

### 7) Hazardous cargo
Build explicit handling for hazardous/dangerous goods:
- Additional documents/approvals
- Different inspection workflows and hold/release rules
- Port safety constraints and segregation requirements

---

## B. WCO Time Release Study (TRS) benchmarks (performance targets)

Angola measures clearance times against international best practices. Use these benchmarks as non-functional requirements (NFRs) for process design, SLAs, and monitoring.

| Phase | Duration | Responsible Party | WCO Target |
|---|---:|---|---:|
| Pre-arrival Processing | 1–24 hours before arrival | Importer/Agent | 24–48h before |
| Cargo Discharge | 2–6 hours | Carrier/Port | 3–4 hours |
| Declaration Submission | 2–4 hours | Importer/Agent | 1–2 hours |
| Customs Assessment | 2–8 hours | AGT (Customs) | 2–4 hours |
| Payment | 1–2 hours | Importer | Under 1 hour |
| Inspection (if required) | 4–12 hours | AGT Inspector | 6–8 hours |
| Release Authorization | 1–2 hours | AGT | Under 1 hour |
| Total (Green Channel) | 6–14 hours | All Parties | Under 6 hours |
| Total (Yellow Channel) | 1–2 days | All Parties | Under 12 hours |
| Total (with Inspection) | 2–3 days | All Parties | Under 24 hours |

Express/Low-Value Shipments:
- Target immediate release upon arrival for shipments under $200.

Why pre-arrival matters:
- Pre-arrival processing is a WCO best practice allowing customs to assess risk and expedite clearance before goods physically arrive.

---

## C. Clarifications / open questions (what needs agreement)

### 1) Integration architecture and middleware
- Any middleware/integration layer to transform the data: confirm whether it already exists; if yes, reuse it.
- JUL backend to Angola service backend integrations: agree authentication approach (noted: basic auth needs agreement).
- Notification mechanism: REST, EDI, or both?
- How translations work in API (JSON or XML) vs EDI-level mappings.

### 2) Process orchestration and status synchronization
- Sync mechanism for declaring actual request progress is not available: define how JUL will track state transitions and source-of-truth per step.
- Single Window process: confirm the end-to-end state machine for:
  - submission → validation → routing → acknowledgements → assessments → payment → release → post-clearance

### 3) Master data and reference data
- Master data sync not agreed upon: define ownership and sync strategy for:
  - parties (importer/exporter/broker/carrier)
  - locations (ports, depots, customs offices)
  - HS/tariff tables and measures
  - permits/licences

### 4) OGA routing rules
- Different OGA integrations based on HS-codes: define rule engine inputs and outputs:
  - HS + origin + regime + risk flags → required agencies + required docs + holds

### 5) Duty and tax calculation
- Duty and tax calculation: confirm calculation ownership and authoritative engine:
  - inside JUL vs inside customs backend vs hybrid
- Confirm required inputs (valuation method, currency, exchange rate source/date, exemptions, preferences, quotas).

### 6) User flows and identity
- User import and create flow: clarify onboarding and identity proofing:
  - importer/exporter registration
  - broker nomination (see below)
  - roles and delegation

### 7) Payments and credit controls
- Payment part needs clarification (including commercial invoice handling).
- Payment methods: enumerate supported methods and settlement flows.
- Credit limit check before proceeding:
  - online vs offline payment
  - when to place holds/releases

### 8) Risk assessment and channeling
- Risk assessment and channels (Green, Yellow, Orange, Red): clarify:
  - who assigns the channel (AGT vs JUL vs shared)
  - who notifies JUL of channel/inspection requirements and via which interface

### 9) Audit logging and compliance
- Which audit logs must be captured and at what levels:
  - user actions (create/edit/submit)
  - data changes (before/after)
  - routing decisions (why an OGA was required)
  - risk/channel decisions (source + timestamp)
  - payment attempts/confirmations
  - release/hold events

### 10) Customs broker nomination (authority & integration)
- Broker nomination needs clarity:
  - how the trader appoints a broker
  - validation of broker authority
  - data sharing boundaries
  - integration requirements with customs backend

### 11) Enforcement: penalties, pending payments, bans
- Penalty and pending payment scenarios:
  - how holds are applied
  - banning of importer/exporter rules and data sources
  - reinstatement and appeal workflows

### 12) Special cases handling
- Diplomatic goods
- Humanitarian aid and donations

---

## D. Practical build checklist (minimum decisions before development)

1. Decide canonical model (WCO DM 3.10) and publish a field list for declarations (align UI “customs declaration form fields” to WCO elements).
2. Confirm integration patterns (REST vs EDIFACT) and message sets (CUSDEC/CUSRES/CUSCAR).
3. Define master data ownership + sync mechanisms.
4. Define OGA routing rules (HS-driven), and versioning of rules.
5. Define duty/tax calculation ownership and calculation inputs.
6. Define payment methods and credit/limit checks.
7. Define risk channels ownership and notification mechanism.
8. Define audit log events, retention, and access.
9. Define broker nomination process and authorization checks.
10. Define special cases (diplomatic/humanitarian) and hazardous cargo flows.
11. Define TRS monitoring KPIs and target SLAs per phase.
