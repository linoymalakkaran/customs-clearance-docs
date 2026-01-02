import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  docs: [
    {
      type: 'doc',
      id: 'intro',
      label: '🏠 Welcome to JUL',
    },
    {
      type: 'category',
      label: '🎯 Customs Clearance',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'customs-clearance-overview',
          label: 'Overview & Scenarios',
        },
        {
          type: 'category',
          label: '📥 Import & Export',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'customs-clearance/import-clearance',
              label: 'Import Clearance',
            },
            {
              type: 'doc',
              id: 'customs-clearance/export-clearance',
              label: 'Export Clearance',
            },
          ],
        },
        {
          type: 'category',
          label: '🚛 Transit & Temporary',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'customs-clearance/transit-operations',
              label: 'Transit Operations',
            },
            {
              type: 'doc',
              id: 'customs-clearance/temporary-admission',
              label: 'Temporary Admission',
            },
          ],
        },
        {
          type: 'category',
          label: '🏢 Warehousing & Procedures',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'customs-clearance/customs-warehousing',
              label: 'Customs Warehousing',
            },
            {
              type: 'doc',
              id: 'customs-clearance/simplified-procedures',
              label: 'Simplified Procedures',
            },
          ],
        },
        {
          type: 'category',
          label: '✅ Compliance & Audit',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'customs-clearance/risk-based-clearance',
              label: 'Risk-Based Clearance',
            },
            {
              type: 'doc',
              id: 'customs-clearance/post-clearance-audit',
              label: 'Post-Clearance Audit',
            },
          ],
        },
        {
          type: 'category',
          label: '⚖️ Disputes & Special Cases',
          collapsed: false,
          items: [
            {
              type: 'doc',
              id: 'customs-clearance/appeals-disputes',
              label: 'Appeals and Disputes',
            },
            {
              type: 'doc',
              id: 'customs-clearance/special-cases',
              label: 'Special Cases',
            },
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '🪟 Single Window Concept',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'single-window-overview',
          label: 'Overview & Architecture',
        },
      ],
    },
    {
      type: 'category',
      label: '⚓ Port & Logistics',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'port-logistics-overview',
          label: 'Port Operations Overview',
        },
        {
          type: 'doc',
          id: 'port-to-door-delivery',
          label: 'Port to Door Delivery',
        },
      ],
    },
    {
      type: 'category',
      label: '� Trade Facilitation',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'trade-facilitation/customs-brokers-freight-forwarders',
          label: 'Customs Brokers & Freight Forwarders',
        },
        {
          type: 'doc',
          id: 'trade-facilitation/customs-valuation',
          label: 'Customs Valuation',
        },
        {
          type: 'doc',
          id: 'trade-facilitation/trade-finance-insurance',
          label: 'Trade Finance & Insurance',
        },
      ],
    },
    {
      type: 'category',
      label: '�📋 Standards & Compliance',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'standards/comprehensive-standards-overview',
          label: 'Comprehensive Standards',
        },
        {
          type: 'doc',
          id: 'standards/wco-data-model',
          label: 'WCO Data Model',
        },
        {
          type: 'doc',
          id: 'standards/un-edifact',
          label: 'UN/EDIFACT',
        },
        {
          type: 'doc',
          id: 'standards/hs-classification',
          label: 'HS Classification',
        },
        {
          type: 'doc',
          id: 'standards/iso-standards',
          label: 'ISO Standards',
        },
      ],
    },
    {
      type: 'category',
      label: '📖 Process Guides',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'guides/customs-clearance-process',
          label: 'Customs Clearance Process',
        },
      ],
    },
    {
      type: 'category',
      label: '📚 Reference',
      collapsed: true,
      items: [
        {
          type: 'doc',
          id: 'reference/glossary',
          label: 'Glossary & Terms',
        },
      ],
    },
  ],
};

export default sidebars;
