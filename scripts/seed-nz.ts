import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const nzRules: RuleNode[] = [
  {
    id: 'NZ-PA2020-212',
    country: 'NZ',
    law: 'Privacy Act 2020 (New Zealand)',
    article: 'Section 212 / IPP 12',
    dimension: 'cross_border_transfer',
    requirement_type: 'conditional',
    mechanism: ['comparable_safeguards', 'individual_consent', 'recipient_binding'],
    text_en: 'An agency that transfers personal information outside New Zealand must not do so unless the agency believes on reasonable grounds that the recipient is subject to privacy laws, binding corporate rules or contractual obligations that provide comparable safeguards to the Privacy Act 2020. Alternatively, the individual must have expressly authorised the transfer after being informed that the destination country may not provide comparable protection.',
    source_url: 'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    effective_date: '2020-12-01',
    source_authority: 'official_law',
  },
  {
    id: 'NZ-PA2020-IPP2',
    country: 'NZ',
    law: 'Privacy Act 2020 (New Zealand)',
    article: 'Information Privacy Principle 2',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['collection_from_individual', 'authorised_collection', 'sensitive_data_care'],
    text_en: 'Personal information must be collected directly from the individual concerned unless the individual has authorised collection from another source, the information is publicly available, or direct collection would prejudice the purposes of collection. An agency must take special care when collecting information that is sensitive in nature, including information about health, sexual orientation or religious beliefs.',
    source_url: 'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    effective_date: '2020-12-01',
    source_authority: 'official_law',
  },
  {
    id: 'NZ-PA2020-IPP5',
    country: 'NZ',
    law: 'Privacy Act 2020 (New Zealand)',
    article: 'Information Privacy Principle 5',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['storage_safeguards', 'access_controls', 'disposal_procedures'],
    text_en: 'An agency that holds personal information must ensure that the information is protected, by such security safeguards as it is reasonable in the circumstances to take, against loss, access, use, modification or disclosure that is not authorised, and against other misuse. Where personal information is to be disposed of or given to another person, the agency must take reasonable steps to prevent loss or unauthorised use.',
    source_url: 'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    effective_date: '2020-12-01',
    source_authority: 'official_law',
  },
  {
    id: 'NZ-PA2020-113',
    country: 'NZ',
    law: 'Privacy Act 2020 (New Zealand)',
    article: 'Section 113',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['Privacy_Commissioner_notification', 'individual_notification', 'harm_threshold'],
    text_en: 'An agency must notify the Privacy Commissioner as soon as practicable after becoming aware of a privacy breach that it is reasonable to believe has caused or is likely to cause serious harm to an affected individual. The agency must also notify each affected individual of the breach unless doing so would itself cause serious harm or be contrary to the interests of national security.',
    source_url: 'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    effective_date: '2020-12-01',
    source_authority: 'official_law',
  },
  {
    id: 'NZ-PA2020-IPP6',
    country: 'NZ',
    law: 'Privacy Act 2020 (New Zealand)',
    article: 'Information Privacy Principle 6',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['access_right', 'correction_right', 'objection_right'],
    text_en: 'An individual is entitled to request access to personal information about themselves held by an agency, and to request correction of such information if they believe it is inaccurate, incomplete, out of date, misleading or given in breach of an information privacy principle. An agency must respond to access and correction requests within 20 working days.',
    source_url: 'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    effective_date: '2020-12-01',
    source_authority: 'official_law',
  },
  {
    id: 'NZ-PA2020-IPP1',
    country: 'NZ',
    law: 'Privacy Act 2020 (New Zealand)',
    article: 'Information Privacy Principle 1 / IPP 3',
    dimension: 'privacy_policy',
    requirement_type: 'mandatory',
    mechanism: ['purpose_limitation', 'collection_notice', 'agency_identification'],
    text_en: 'Personal information must be collected for a lawful purpose connected with a function or activity of the agency, and collection must be reasonably necessary for that purpose. At the time of collection an agency must take reasonable steps to ensure the individual is aware of the purpose of collection, the intended recipients, whether supply is voluntary or mandatory, and the individual\'s rights to access and correction.',
    source_url: 'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    effective_date: '2020-12-01',
    source_authority: 'official_law',
  },
  {
    id: 'NZ-PA2020-IPP9',
    country: 'NZ',
    law: 'Privacy Act 2020 (New Zealand)',
    article: 'Information Privacy Principle 9',
    dimension: 'retention',
    requirement_type: 'mandatory',
    mechanism: ['purpose_limitation', 'no_indefinite_retention'],
    text_en: 'An agency that holds personal information must not keep that information for longer than is required for the purpose for which the information may lawfully be used. Once personal information is no longer required for the authorised purpose, the agency must take steps to ensure it is securely destroyed or de-identified.',
    source_url: 'https://www.legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    effective_date: '2020-12-01',
    source_authority: 'official_law',
  },
  {
    id: 'NZ-PA2020-ALG',
    country: 'NZ',
    law: 'Privacy Act 2020 — OPC Guidance on Algorithm Use',
    article: 'OPC Algorithmic Decision-Making Guidance 2023',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['transparency_notice', 'human_review_right', 'DPIA_recommended'],
    text_en: 'The Office of the Privacy Commissioner\'s 2023 guidance states that agencies using algorithms or automated tools to make decisions about individuals must be transparent about the use of such tools, provide meaningful explanation of how decisions are reached, and offer human review of significant automated decisions. Privacy impact assessments are recommended before deploying high-risk automated systems.',
    source_url: 'https://www.privacy.org.nz/publications/guidance-resources/algorithm-use-and-privacy/',
    effective_date: '2023-03-01',
    source_authority: 'ministry_guideline',
  },
]

async function seed() {
  const conn = await pool.getConnection()
  try {
    for (const rule of nzRules) {
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
    console.log(`✓ Seeded ${nzRules.length} NZ rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seed().catch(console.error)
