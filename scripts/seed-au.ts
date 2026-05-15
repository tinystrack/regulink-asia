import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const auRules: RuleNode[] = [
  {
    id: 'AU-PA-16C',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Australian Privacy Principles',
    article: 'APP 8 / Section 16C',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['accountability_principle', 'recipient_compliance', 'individual_consent'],
    text_en: 'Before disclosing personal information to an overseas recipient, an APP entity must take reasonable steps to ensure the recipient does not breach the Australian Privacy Principles. The disclosing entity remains accountable for any act or practice by the overseas recipient that would breach the APPs, unless the individual consented after being informed of the risk.',
    source_url: 'https://www.legislation.gov.au/Details/C2022C00199',
    effective_date: '1988-12-21',
    source_authority: 'official_law',
  },
  {
    id: 'AU-PA-APP3',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Australian Privacy Principles',
    article: 'APP 3',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['notice', 'collection_limitation', 'sensitive_data_consent'],
    text_en: 'An APP entity must not collect personal information unless it is reasonably necessary for one or more of the entity\'s functions or activities. Sensitive information, including health information, racial or ethnic origin, and biometric data, must not be collected without the individual\'s consent unless a legal exception applies.',
    source_url: 'https://www.legislation.gov.au/Details/C2022C00199',
    effective_date: '2014-03-12',
    source_authority: 'official_law',
  },
  {
    id: 'AU-PA-APP11',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Australian Privacy Principles',
    article: 'APP 11',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['technical_safeguards', 'organisational_measures', 'destruction_or_deidentification'],
    text_en: 'An APP entity must take reasonable steps to protect the personal information it holds from misuse, interference and loss, as well as unauthorised access, modification or disclosure. When personal information is no longer needed for any purpose, the entity must take reasonable steps to destroy or de-identify it, unless retention is required by law.',
    source_url: 'https://www.legislation.gov.au/Details/C2022C00199',
    effective_date: '2014-03-12',
    source_authority: 'official_law',
  },
  {
    id: 'AU-NDB-26WE',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Notifiable Data Breaches Scheme',
    article: 'Section 26WE',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['OAIC_notification', 'individual_notification', '30_day_assessment'],
    text_en: 'An entity that is aware that there are reasonable grounds to believe that an eligible data breach has occurred must notify the Australian Information Commissioner and affected individuals as soon as practicable. An eligible data breach occurs where there is unauthorised access to or disclosure of personal information that is likely to result in serious harm to any individual to whom the information relates.',
    source_url: 'https://www.legislation.gov.au/Details/C2022C00199',
    effective_date: '2018-02-22',
    source_authority: 'official_law',
  },
  {
    id: 'AU-PA-APP12',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Australian Privacy Principles',
    article: 'APP 12',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['access_right', 'correction_right', '30_day_response'],
    text_en: 'An APP entity must, on request by an individual, give the individual access to the personal information the entity holds about them within 30 days. An individual may also request correction of personal information that is inaccurate, out of date, incomplete, irrelevant or misleading, and the entity must take reasonable steps to correct it.',
    source_url: 'https://www.legislation.gov.au/Details/C2022C00199',
    effective_date: '2014-03-12',
    source_authority: 'official_law',
  },
  {
    id: 'AU-PA-APP1',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Australian Privacy Principles',
    article: 'APP 1 / APP 5',
    dimension: 'privacy_policy',
    requirement_type: 'mandatory',
    mechanism: ['public_privacy_policy', 'collection_notice', 'purpose_disclosure'],
    text_en: 'An APP entity must have a clearly expressed and up-to-date privacy policy that describes what kinds of personal information it holds, how it collects, holds, uses and discloses that information, how an individual may access and correct information, how to make a complaint, and whether the entity is likely to disclose information to overseas recipients.',
    source_url: 'https://www.legislation.gov.au/Details/C2022C00199',
    effective_date: '2014-03-12',
    source_authority: 'official_law',
  },
  {
    id: 'AU-PA-APP7',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Australian Privacy Principles',
    article: 'APP 7',
    dimension: 'data_portability',
    requirement_type: 'conditional',
    mechanism: ['direct_marketing_optout', 'CDR_portability'],
    text_en: 'Under the Consumer Data Right (CDR) framework inserted into the Competition and Consumer Act 2010, designated businesses must transfer consumer data to accredited third parties upon the consumer\'s request in a machine-readable format. APP 7 separately requires entities using personal information for direct marketing to provide a simple opt-out mechanism on every communication.',
    source_url: 'https://www.legislation.gov.au/Details/C2022C00199',
    effective_date: '2020-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'AU-PA-APP1-ALG',
    country: 'AU',
    law: 'Privacy Act 1988 (Cth) — Privacy Act Review Report 2022',
    article: 'Recommendation 19',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['transparency_notice', 'human_review_right', 'impact_assessment'],
    text_en: 'The 2022 Privacy Act Review recommended that individuals be given a right to request meaningful information about how a decision significantly affecting them was made using their personal information, including where automated processing was used. Entities should be required to conduct privacy impact assessments for high-risk automated decision-making activities.',
    source_url: 'https://www.ag.gov.au/rights-and-protections/publications/privacy-act-review-report',
    effective_date: '2022-02-25',
    source_authority: 'ministry_guideline',
  },
]

async function seed() {
  const conn = await pool.getConnection()
  try {
    for (const rule of auRules) {
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
    console.log(`✓ Seeded ${auRules.length} AU rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seed().catch(console.error)
