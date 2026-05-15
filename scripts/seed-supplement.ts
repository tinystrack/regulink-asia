import pool from '../lib/db'
import { RuleNode } from '../lib/types'

// ── New-dimension top-ups for existing 8 jurisdictions ────────────────────────
// data_portability + algorithmic_decision for CN / JP / KR / TH / VN / SG / IN / ID
// Plus breach_notification / retention gap-fills where thin

const supplementRules: RuleNode[] = [

  // ── CHINA ──────────────────────────────────────────────────────────────────
  {
    id: 'CN-PIPL-45',
    country: 'CN',
    law: 'Personal Information Protection Law (PIPL)',
    article: 'Article 45',
    dimension: 'data_portability',
    requirement_type: 'mandatory',
    mechanism: ['portability_right', 'machine_readable_format', 'transfer_to_designated_processor'],
    text_en: 'Individuals have the right to request the portability of their personal information. Where an individual requests the transfer of personal information to a designated personal information processor, the original processor must provide a means of transfer if it meets the conditions prescribed by the national cyberspace authority.',
    source_url: 'http://www.npc.gov.cn/npc/c30834/202108/a8c4e3672c74491a80b53a172bb753fe.shtml',
    effective_date: '2021-11-01',
    source_authority: 'official_law',
  },
  {
    id: 'CN-PIPL-24',
    country: 'CN',
    law: 'Personal Information Protection Law (PIPL)',
    article: 'Article 24',
    dimension: 'algorithmic_decision',
    requirement_type: 'mandatory',
    mechanism: ['transparency_obligation', 'non_discrimination', 'human_review_right', 'opt_out_right'],
    text_en: 'When personal information processors use automated decision-making tools, they shall ensure transparency in the decision-making and the fairness and impartiality of results, and shall not implement unreasonable differential treatment of individuals in transaction price and other transaction conditions. Where automated decision-making has a significant impact on an individual\'s rights, the individual has the right to request an explanation and to reject decisions made solely by automated means.',
    source_url: 'http://www.npc.gov.cn/npc/c30834/202108/a8c4e3672c74491a80b53a172bb753fe.shtml',
    effective_date: '2021-11-01',
    source_authority: 'official_law',
  },
  {
    id: 'CN-PIPL-57',
    country: 'CN',
    law: 'Personal Information Protection Law (PIPL)',
    article: 'Article 57',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['authority_notification', 'individual_notification', 'remediation_measures'],
    text_en: 'Where a personal information leak, tampering or loss has occurred or may have occurred, the personal information processor shall immediately take remediation measures, and notify the competent department and the affected individuals in accordance with the regulations. Where the personal information leak, tampering or loss can be effectively prevented from harming individuals, notification to individuals may be omitted after a report to the competent department.',
    source_url: 'http://www.npc.gov.cn/npc/c30834/202108/a8c4e3672c74491a80b53a172bb753fe.shtml',
    effective_date: '2021-11-01',
    source_authority: 'official_law',
  },

  // ── JAPAN ──────────────────────────────────────────────────────────────────
  {
    id: 'JP-APPI-28',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 28',
    dimension: 'data_portability',
    requirement_type: 'conditional',
    mechanism: ['disclosure_in_electronic_format', 'request_right', 'operator_discretion'],
    text_en: 'When a principal requests disclosure of retained personal data, a personal information handling business operator must disclose it in the form of electronic records if the principal requests so, provided the operator has not established a specific method of disclosure. The operator may decline where disclosure would significantly impede business operations.',
    source_url: 'https://www.ppc.go.jp/files/pdf/240401_APPI_amendment.pdf',
    effective_date: '2022-04-01',
    source_authority: 'official_amendment',
  },
  {
    id: 'JP-APPI-ALG',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 — PPC Guidelines',
    article: 'PPC Guidelines (General) Chapter 3-5',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['purpose_transparency', 'opt_out_for_profiling', 'third_party_provision_restriction'],
    text_en: 'Under PPC guidelines, use of personal information for profiling or automated scoring that influences lending, employment or insurance decisions must be disclosed in the privacy notice. Data subjects may opt out of third-party provision of their data for profiling purposes. Businesses operating recommendation algorithms must specify the purpose of use with sufficient clarity to allow principals to anticipate the scope of processing.',
    source_url: 'https://www.ppc.go.jp/files/pdf/guidelines_tsushi.pdf',
    effective_date: '2022-04-01',
    source_authority: 'ministry_guideline',
  },
  {
    id: 'JP-APPI-26',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 26',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['PPC_report_within_30days', 'individual_notification', 'leak_assessment'],
    text_en: 'When a personal information handling business operator becomes aware of a leak, loss or damage of personal information falling under cases specified by PPC rules (including leaks of sensitive data, leaks likely to cause financial harm, or leaks involving 1,000 or more principals), it must report to the PPC promptly and within 30 days, and notify the affected principals without delay.',
    source_url: 'https://www.ppc.go.jp/files/pdf/240401_APPI_amendment.pdf',
    effective_date: '2022-04-01',
    source_authority: 'official_amendment',
  },

  // ── KOREA ──────────────────────────────────────────────────────────────────
  {
    id: 'KR-PIPA-35-2',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 35-2',
    dimension: 'data_portability',
    requirement_type: 'mandatory',
    mechanism: ['portability_right', 'transmission_to_third_party', 'machine_readable_format'],
    text_en: 'A data subject may request that a personal information controller transmit personal information concerning the data subject to the data subject themselves or to a designated third-party controller, where the processing is based on consent or on a contractual relationship. The controller must comply within the period prescribed by the Personal Information Protection Commission, in a structured, commonly used, machine-readable format.',
    source_url: 'https://www.pipc.go.kr/eng/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010010000&nttId=8862',
    effective_date: '2023-09-15',
    source_authority: 'official_amendment',
  },
  {
    id: 'KR-PIPA-37-2',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 37-2',
    dimension: 'algorithmic_decision',
    requirement_type: 'mandatory',
    mechanism: ['explanation_right', 'human_review_right', 'objection_right'],
    text_en: 'Where a personal information controller makes a decision that significantly affects the rights or interests of a data subject through automated means relying solely on personal information processing, the data subject has the right to demand an explanation of the criteria applied in reaching that decision, and to demand that the controller review the decision through human intervention. Controllers must establish and disclose procedures for exercising these rights.',
    source_url: 'https://www.pipc.go.kr/eng/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010010000&nttId=8862',
    effective_date: '2023-09-15',
    source_authority: 'official_amendment',
  },

  // ── THAILAND ───────────────────────────────────────────────────────────────
  {
    id: 'TH-PDPA-33',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (2019)',
    article: 'Section 33',
    dimension: 'data_portability',
    requirement_type: 'mandatory',
    mechanism: ['portability_right', 'electronic_format', 'transmission_to_third_party'],
    text_en: 'A data subject has the right to receive personal data concerning him or her from the data controller in a structured, commonly used and machine-readable format and has the right to request the data controller to send or transfer such personal data to another data controller where technically feasible, unless such processing is necessary for a task carried out in the public interest.',
    source_url: 'https://www.pdpa.pro/pdpa-the-act',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-ALG',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (2019)',
    article: 'Section 42',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['human_review_right', 'objection_right', 'significant_decision_scope'],
    text_en: 'A data subject has the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning the data subject or similarly significantly affects the data subject. This right does not apply if the decision is necessary for entering into or performing a contract, is authorised by law, or the data subject has given explicit consent.',
    source_url: 'https://www.pdpa.pro/pdpa-the-act',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-37',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (2019)',
    article: 'Section 37',
    dimension: 'retention',
    requirement_type: 'mandatory',
    mechanism: ['purpose_limitation', 'deletion_obligation', 'anonymisation_option'],
    text_en: 'The data controller shall retain personal data only for the period necessary to achieve the purposes for which such personal data was collected. Once the retention period expires or the purpose is fulfilled, the data controller shall delete, destroy or anonymise the personal data, unless retention is required by applicable law.',
    source_url: 'https://www.pdpa.pro/pdpa-the-act',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },

  // ── VIETNAM ────────────────────────────────────────────────────────────────
  {
    id: 'VN-D13-11',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 11',
    dimension: 'data_portability',
    requirement_type: 'mandatory',
    mechanism: ['portability_right', 'data_controller_obligation'],
    text_en: 'Data subjects have the right to retrieve personal data that they have provided to the personal data controller, in a common electronic format readable by electronic devices. The personal data controller is obliged to provide this data to the data subject upon request, unless doing so is technically infeasible.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206031',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'VN-D13-ALG',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 12 / Article 20',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['objection_right', 'impact_assessment_for_automated'],
    text_en: 'Data subjects in Vietnam have the right to object to and request a review of decisions made solely on the basis of automated processing that significantly affects their rights and interests. Personal data controllers must conduct a personal data impact assessment before deploying automated decision-making systems that process personal data at scale.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206031',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },

  // ── SINGAPORE ──────────────────────────────────────────────────────────────
  {
    id: 'SG-PDPA-26F',
    country: 'SG',
    law: 'Personal Data Protection Act 2012 (2021 Amendment)',
    article: 'Section 26F',
    dimension: 'data_portability',
    requirement_type: 'mandatory',
    mechanism: ['portability_obligation', 'machine_readable_format', 'designated_recipient'],
    text_en: 'Under the data portability obligation introduced by the 2021 PDPA amendment, organisations must, upon the request of an individual, transmit the individual\'s data to another organisation in a commonly used machine-readable format where technically feasible. The PDPC may prescribe by order which organisations, data types and destination organisations are covered.',
    source_url: 'https://sso.agc.gov.sg/Act/PDPA2012',
    effective_date: '2021-02-01',
    source_authority: 'official_amendment',
  },
  {
    id: 'SG-PDPA-ALG',
    country: 'SG',
    law: 'PDPC Advisory Guidelines on AI and Personal Data 2023',
    article: 'Advisory Guidelines — Chapter 4',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['explainability_obligation', 'human_review_option', 'DPIA_recommended'],
    text_en: 'The PDPC\'s 2023 advisory guidelines on AI and personal data require organisations using AI systems to make or support decisions affecting individuals to be able to explain the basis for such decisions in general terms. Where individuals are significantly affected, they should be offered meaningful human review. High-risk AI deployments should be preceded by a data protection impact assessment.',
    source_url: 'https://www.pdpc.gov.sg/guidelines-and-consultation/advisory-guidelines-on-ai',
    effective_date: '2023-06-01',
    source_authority: 'ministry_guideline',
  },

  // ── INDIA ───────────────────────────────────────────────────────────────────
  {
    id: 'IN-DPDP-16',
    country: 'IN',
    law: 'Digital Personal Data Protection Act 2023',
    article: 'Section 16',
    dimension: 'data_portability',
    requirement_type: 'conditional',
    mechanism: ['summary_right', 'grievance_redressal'],
    text_en: 'A Data Principal (individual) has the right to obtain a summary of personal data being processed by a Data Fiduciary (controller) and information about the Data Fiduciaries with whom their personal data has been shared. Full data portability in machine-readable format is not yet mandated under the 2023 Act; the Central Government may notify additional rights by rules.',
    source_url: 'https://www.meity.gov.in/data-protection-framework',
    effective_date: '2023-08-11',
    source_authority: 'official_law',
  },
  {
    id: 'IN-DPDP-ALG',
    country: 'IN',
    law: 'Digital Personal Data Protection Act 2023',
    article: 'Section 6 / Section 12',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['consent_based_processing', 'grievance_mechanism', 'future_rules_authority'],
    text_en: 'The DPDP Act 2023 does not yet contain an explicit right against automated decision-making. However, the consent requirements under Section 6 apply to automated profiling and the Central Government is empowered to prescribe further obligations. Data Principals have the right to a grievance redressal mechanism for any processing decision that affects them, including algorithmically-driven outcomes.',
    source_url: 'https://www.meity.gov.in/data-protection-framework',
    effective_date: '2023-08-11',
    source_authority: 'official_law',
  },
  {
    id: 'IN-DPDP-9',
    country: 'IN',
    law: 'Digital Personal Data Protection Act 2023',
    article: 'Section 9',
    dimension: 'retention',
    requirement_type: 'mandatory',
    mechanism: ['storage_limitation', 'erasure_obligation', 'purpose_fulfilment_trigger'],
    text_en: 'A Data Fiduciary shall erase personal data, and cause its Data Processors to erase, upon the Data Principal withdrawing consent or as soon as it is reasonable to assume that the specified purpose is no longer being served, unless retention is required by applicable law. The Central Government may prescribe the period after which data must be erased for specific categories of Data Fiduciaries.',
    source_url: 'https://www.meity.gov.in/data-protection-framework',
    effective_date: '2023-08-11',
    source_authority: 'official_law',
  },

  // ── INDONESIA ───────────────────────────────────────────────────────────────
  {
    id: 'ID-PDP-34',
    country: 'ID',
    law: 'Personal Data Protection Law (Law No. 27 of 2022)',
    article: 'Article 34',
    dimension: 'data_portability',
    requirement_type: 'mandatory',
    mechanism: ['portability_right', 'compatible_format', 'transmission_right'],
    text_en: 'Personal data subjects have the right to obtain and/or use their personal data from the personal data controller for their personal purposes, and to transmit such personal data to another personal data controller, provided the processing is technically compatible and the transmission does not harm other parties.',
    source_url: 'https://peraturan.go.id/id/uu-nomor-27-tahun-2022',
    effective_date: '2022-10-17',
    source_authority: 'official_law',
  },
  {
    id: 'ID-PDP-ALG',
    country: 'ID',
    law: 'Personal Data Protection Law (Law No. 27 of 2022)',
    article: 'Article 44 / Article 16',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['objection_right', 'human_review_right', 'impact_assessment'],
    text_en: 'Under the PDP Law, personal data subjects have the right to object to and request a delay or cessation of automated decision-making that produces legal or significant effects. Personal data controllers using automated decision-making systems must conduct personal data protection impact assessments and establish mechanisms to allow human review of significant automated decisions.',
    source_url: 'https://peraturan.go.id/id/uu-nomor-27-tahun-2022',
    effective_date: '2022-10-17',
    source_authority: 'official_law',
  },
  {
    id: 'ID-PDP-40',
    country: 'ID',
    law: 'Personal Data Protection Law (Law No. 27 of 2022)',
    article: 'Article 40',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['government_notification_14days', 'individual_notification', 'incident_response'],
    text_en: 'In the event of a failure to protect personal data, the Personal Data Controller must notify in writing to the Personal Data Subject and the Minister within 14 working days of the discovery of the failure. The notification must include at minimum the type of personal data compromised, when and how the failure occurred, and the steps being taken to address it.',
    source_url: 'https://peraturan.go.id/id/uu-nomor-27-tahun-2022',
    effective_date: '2022-10-17',
    source_authority: 'official_law',
  },
]

async function seed() {
  const conn = await pool.getConnection()
  try {
    for (const rule of supplementRules) {
      await conn.query(
        `INSERT INTO rules (id, country, law, article, dimension, requirement_type, mechanism, text_en, source_url, effective_date, source_authority)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           text_en = VALUES(text_en),
           mechanism = VALUES(mechanism),
           source_url = VALUES(source_url)`,
        [
          rule.id, rule.country, rule.law, rule.article, rule.dimension,
          rule.requirement_type, JSON.stringify(rule.mechanism),
          rule.text_en, rule.source_url, rule.effective_date, rule.source_authority,
        ]
      )
    }
    console.log(`✓ Seeded ${supplementRules.length} supplement rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seed().catch(console.error)
