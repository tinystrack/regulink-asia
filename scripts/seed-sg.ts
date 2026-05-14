import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const sgRules: RuleNode[] = [
  {
    id: 'SG-PDPA-26',
    country: 'SG',
    law: 'Personal Data Protection Act 2012 (PDPA) as amended 2021',
    article: 'Section 26',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['adequate_protection', 'binding_corporate_rules', 'contractual_obligations'],
    text_en: 'An organisation shall not transfer personal data to a country or territory outside Singapore except in accordance with requirements prescribed under this Act to ensure that organisations provide a standard of protection to personal data so transferred that is comparable to the protection under this Act.',
    source_url: 'https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act',
    effective_date: '2021-02-01',
    source_authority: 'official_law',
  },
  {
    id: 'SG-PDPA-13',
    country: 'SG',
    law: 'Personal Data Protection Act 2012 (PDPA) as amended 2021',
    article: 'Section 13',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['consent', 'legitimate_interest', 'business_improvement'],
    text_en: 'An organisation shall not collect, use or disclose personal data about an individual unless the individual gives, or is deemed to have given, his or her consent to the collection, use or disclosure, as the case may be. An organisation may rely on deemed consent by notification where it notifies the individual of the purpose and the individual does not opt out within a reasonable period.',
    source_url: 'https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act',
    effective_date: '2021-02-01',
    source_authority: 'official_law',
  },
  {
    id: 'SG-PDPA-26A',
    country: 'SG',
    law: 'Personal Data Protection Act 2012 (PDPA) as amended 2021',
    article: 'Section 26A',
    dimension: 'data_localisation',
    requirement_type: 'not_regulated',
    mechanism: [],
    text_en: 'Singapore does not impose data localisation requirements under PDPA. Data may be stored and processed outside Singapore subject to the cross-border transfer obligations under Section 26.',
    source_url: 'https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act',
    effective_date: '2021-02-01',
    source_authority: 'ministry_guideline',
  },
  {
    id: 'SG-PDPA-26C',
    country: 'SG',
    law: 'Personal Data Protection Act 2012 (PDPA) as amended 2021',
    article: 'Section 26C',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['pdpc_notification_3days', 'individual_notification'],
    text_en: 'An organisation that has a data breach affecting 500 or more individuals, or that is likely to result in significant harm, must notify the Personal Data Protection Commission within 3 calendar days of assessing that a notifiable breach has occurred, and notify affected individuals as soon as practicable.',
    source_url: 'https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act',
    effective_date: '2021-02-01',
    source_authority: 'official_law',
  },
  {
    id: 'SG-PDPA-21',
    country: 'SG',
    law: 'Personal Data Protection Act 2012 (PDPA) as amended 2021',
    article: 'Section 21',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['right_to_access', 'right_to_correction', 'right_to_portability'],
    text_en: 'An individual is entitled to request access to personal data about the individual that is in the possession or under the control of the organisation and information about the ways in which the personal data has been or may have been used or disclosed within a year before the request. The 2021 amendment introduces a data portability right allowing individuals to request transmission of data to another organisation.',
    source_url: 'https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act',
    effective_date: '2021-02-01',
    source_authority: 'official_law',
  },
]

async function seedSG() {
  const conn = await pool.getConnection()
  try {
    for (const rule of sgRules) {
      await conn.execute(
        `INSERT INTO rules (id, country, law, article, dimension, requirement_type, mechanism, text_en, text_zh, source_url, effective_date, source_authority)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE text_en = VALUES(text_en)`,
        [
          rule.id, rule.country, rule.law, rule.article,
          rule.dimension, rule.requirement_type,
          JSON.stringify(rule.mechanism),
          rule.text_en, rule.text_zh || null,
          rule.source_url, rule.effective_date, rule.source_authority,
        ]
      )
    }
    console.log(`✓ Seeded ${sgRules.length} SG rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seedSG().catch(console.error)
