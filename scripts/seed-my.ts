import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const myRules: RuleNode[] = [
  {
    id: 'MY-PDPA-129',
    country: 'MY',
    law: 'Personal Data Protection Act 2010 (Act 709)',
    article: 'Section 129',
    dimension: 'cross_border_transfer',
    requirement_type: 'prohibited',
    mechanism: ['whitelist_countries', 'consent_exception', 'contract_exception'],
    text_en: 'A data user shall not transfer any personal data of a data subject to a place outside Malaysia unless that place is specified by the Minister in a notice published in the Gazette, the data subject has consented to the transfer, the transfer is necessary for the performance of a contract between the data subject and the data user, or is necessary for reasons of public interest.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2019/09/Personal-Data-Protection-Act-2010.pdf',
    effective_date: '2013-11-15',
    source_authority: 'official_law',
  },
  {
    id: 'MY-PDPA-6',
    country: 'MY',
    law: 'Personal Data Protection Act 2010 (Act 709)',
    article: 'Section 6',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['written_consent', 'sensitive_data_explicit_consent', 'withdrawal_right'],
    text_en: 'Personal data of a data subject shall not be processed without the consent of the data subject. Sensitive personal data shall not be processed without the explicit consent of the data subject. Consent may be withdrawn at any time by the data subject, and on such withdrawal the data user shall cease processing the personal data.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2019/09/Personal-Data-Protection-Act-2010.pdf',
    effective_date: '2013-11-15',
    source_authority: 'official_law',
  },
  {
    id: 'MY-PDPA-9',
    country: 'MY',
    law: 'Personal Data Protection Act 2010 (Act 709)',
    article: 'Section 9',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['technical_measures', 'organisational_measures', 'processor_contractual_obligation'],
    text_en: 'A data user shall take practical steps to protect personal data from any loss, misuse, modification, unauthorised or accidental access or disclosure, alteration or destruction. Where processing is carried out by a data processor on behalf of the data user, the data user must ensure by contract that the processor applies equivalent security measures.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2019/09/Personal-Data-Protection-Act-2010.pdf',
    effective_date: '2013-11-15',
    source_authority: 'official_law',
  },
  {
    id: 'MY-PDPA-7',
    country: 'MY',
    law: 'Personal Data Protection Act 2010 (Act 709)',
    article: 'Section 7',
    dimension: 'privacy_policy',
    requirement_type: 'mandatory',
    mechanism: ['written_notice', 'purpose_disclosure', 'third_party_disclosure_notice'],
    text_en: 'A data user shall inform the data subject in writing before or at the time of collecting personal data of: the description of personal data being collected; the purpose for which it is collected; the right of the data subject to request access and correction; the class of third parties to whom the data user discloses or may disclose the data; and whether the supply of data is obligatory or voluntary.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2019/09/Personal-Data-Protection-Act-2010.pdf',
    effective_date: '2013-11-15',
    source_authority: 'official_law',
  },
  {
    id: 'MY-PDPA-12',
    country: 'MY',
    law: 'Personal Data Protection Act 2010 (Act 709)',
    article: 'Section 12',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['access_right', 'correction_right', '21_day_response'],
    text_en: 'A data subject shall be entitled to access personal data relating to themselves that is being processed by a data user, and to correct personal data that is inaccurate, incomplete, misleading or not up to date. The data user must comply with an access or correction request within 21 days of receipt.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2019/09/Personal-Data-Protection-Act-2010.pdf',
    effective_date: '2013-11-15',
    source_authority: 'official_law',
  },
  {
    id: 'MY-PDPA-10',
    country: 'MY',
    law: 'Personal Data Protection Act 2010 (Act 709)',
    article: 'Section 10',
    dimension: 'retention',
    requirement_type: 'mandatory',
    mechanism: ['purpose_limitation', 'destruction_obligation'],
    text_en: 'Personal data processed for any purpose shall not be kept longer than is necessary for the fulfilment of that purpose. A data user must take all reasonable steps to ensure that personal data that is no longer required is destroyed or permanently deleted.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2019/09/Personal-Data-Protection-Act-2010.pdf',
    effective_date: '2013-11-15',
    source_authority: 'official_law',
  },
  {
    id: 'MY-PDPA-2024-BREACH',
    country: 'MY',
    law: 'Personal Data Protection (Amendment) Act 2024',
    article: 'Section 12B (amended)',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['Commissioner_notification_72h', 'individual_notification', 'harm_threshold'],
    text_en: 'Under the 2024 amendments to the PDPA, a data user who becomes aware of a personal data breach must notify the Personal Data Protection Commissioner within 72 hours of becoming aware of the breach. Where the breach is likely to result in significant harm to data subjects, those individuals must also be notified without undue delay.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2024/PDPA-Amendment-2024.pdf',
    effective_date: '2024-10-01',
    source_authority: 'official_amendment',
  },
  {
    id: 'MY-PDPA-2024-DPO',
    country: 'MY',
    law: 'Personal Data Protection (Amendment) Act 2024',
    article: 'Section 12A (amended)',
    dimension: 'data_localisation',
    requirement_type: 'not_regulated',
    mechanism: [],
    text_en: 'Malaysia does not impose a general data localisation requirement. The 2024 PDPA amendments focus on breach notification, data portability and DPO appointment but do not introduce domestic storage mandates. Cross-border transfers remain governed by the whitelist mechanism under Section 129.',
    source_url: 'https://www.pdp.gov.my/jpdpv2/assets/2024/PDPA-Amendment-2024.pdf',
    effective_date: '2024-10-01',
    source_authority: 'official_amendment',
  },
]

async function seed() {
  const conn = await pool.getConnection()
  try {
    for (const rule of myRules) {
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
    console.log(`✓ Seeded ${myRules.length} MY rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seed().catch(console.error)
