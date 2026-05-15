import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const phRules: RuleNode[] = [
  {
    id: 'PH-DPA-21',
    country: 'PH',
    law: 'Data Privacy Act of 2012 (Republic Act No. 10173)',
    article: 'Section 21',
    dimension: 'cross_border_transfer',
    requirement_type: 'conditional',
    mechanism: ['adequacy_finding', 'contractual_safeguards', 'NPC_approval'],
    text_en: 'Personal information may be transferred to a third country only if adequate protection is provided for the data, comparable to the standards of the Data Privacy Act. The National Privacy Commission may issue standard contractual clauses or binding corporate rules to facilitate such transfers. Without an adequacy determination, organisations must obtain NPC approval or rely on approved contractual safeguards.',
    source_url: 'https://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html',
    effective_date: '2012-09-08',
    source_authority: 'official_law',
  },
  {
    id: 'PH-DPA-13',
    country: 'PH',
    law: 'Data Privacy Act of 2012 (Republic Act No. 10173)',
    article: 'Section 13',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['freely_given_consent', 'sensitive_PI_explicit_consent', 'withdrawal_right'],
    text_en: 'The processing of sensitive personal information shall be prohibited except in specified cases, including where the data subject has given their prior consent, specific, informed and freely given. Any consent given under compulsion, or as a precondition to availing of a service, shall be deemed invalid. The data subject may withdraw consent at any time, and such withdrawal shall not affect the lawfulness of processing based on consent prior to withdrawal.',
    source_url: 'https://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html',
    effective_date: '2012-09-08',
    source_authority: 'official_law',
  },
  {
    id: 'PH-DPA-20',
    country: 'PH',
    law: 'Data Privacy Act of 2012 (Republic Act No. 10173)',
    article: 'Section 20',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['organizational_security', 'physical_security', 'technical_security', 'DPO_appointment'],
    text_en: 'Personal information controllers must implement reasonable and appropriate organisational, physical and technical measures for protection of personal information against accidental or unlawful destruction, alteration and disclosure, as well as against any other unlawful processing. A Data Protection Officer (DPO) must be appointed by every personal information controller or processor required to register with the NPC.',
    source_url: 'https://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html',
    effective_date: '2012-09-08',
    source_authority: 'official_law',
  },
  {
    id: 'PH-DPA-20B',
    country: 'PH',
    law: 'Data Privacy Act of 2012 — NPC Circular 16-03',
    article: 'Section 20(f) / NPC Circular 16-03',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['NPC_notification_72h', 'individual_notification', 'breach_log'],
    text_en: 'A personal information controller must notify the National Privacy Commission and affected data subjects within 72 hours upon knowledge of or reasonable belief that a personal data breach has occurred where sensitive personal information may have been acquired by an unauthorized person, and the breach is likely to give rise to a real risk of serious harm to the data subjects.',
    source_url: 'https://www.privacy.gov.ph/npc-circular-16-03-personal-data-breach-management/',
    effective_date: '2016-12-15',
    source_authority: 'ministry_guideline',
  },
  {
    id: 'PH-DPA-16',
    country: 'PH',
    law: 'Data Privacy Act of 2012 (Republic Act No. 10173)',
    article: 'Section 16',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['access_right', 'rectification_right', 'erasure_right', 'object_right', 'portability_right'],
    text_en: 'The data subject shall have the right to: be informed whether personal information pertaining to him is being processed; reasonable access to such data upon demand; dispute the inaccuracy or error in the personal information and have it corrected; suspend, withdraw or order blocking, removal or destruction of data; obtain a copy of data in an electronic or structured format; and be indemnified for damages sustained due to inaccurate, incomplete, outdated or unlawfully obtained data.',
    source_url: 'https://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html',
    effective_date: '2012-09-08',
    source_authority: 'official_law',
  },
  {
    id: 'PH-DPA-15',
    country: 'PH',
    law: 'Data Privacy Act of 2012 (Republic Act No. 10173)',
    article: 'Section 15',
    dimension: 'retention',
    requirement_type: 'mandatory',
    mechanism: ['purpose_limitation', 'disposal_obligation', 'legal_retention_exception'],
    text_en: 'Personal information shall not be retained in a form which permits identification of data subjects for longer than is necessary for the fulfilment of the purposes for which they were collected and processed. Personal information collected for a specific purpose shall be disposed of or discarded properly and promptly after fulfillment of said purpose.',
    source_url: 'https://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html',
    effective_date: '2012-09-08',
    source_authority: 'official_law',
  },
  {
    id: 'PH-DPA-11',
    country: 'PH',
    law: 'Data Privacy Act of 2012 (Republic Act No. 10173)',
    article: 'Section 11 / IRR Rule IV',
    dimension: 'privacy_policy',
    requirement_type: 'mandatory',
    mechanism: ['privacy_notice', 'purpose_disclosure', 'NPC_registration'],
    text_en: 'Personal information must be collected for specified, explicit and legitimate purposes and not further processed in a way incompatible with those purposes. Personal information controllers must provide data subjects with a privacy notice at or before collection, disclosing the identity of the controller, the purpose of processing, recipients of the data and the rights of the data subject.',
    source_url: 'https://www.lawphil.net/statutes/repacts/ra2012/ra_10173_2012.html',
    effective_date: '2012-09-08',
    source_authority: 'official_law',
  },
  {
    id: 'PH-DPA-NPC2023-ALG',
    country: 'PH',
    law: 'NPC Advisory Opinion 2023-012',
    article: 'Advisory Opinion 2023-012',
    dimension: 'algorithmic_decision',
    requirement_type: 'conditional',
    mechanism: ['human_review_right', 'transparency_obligation', 'DPIA_requirement'],
    text_en: 'The NPC has advised that automated processing of personal data that produces legal or similarly significant effects on data subjects requires transparency about the logic involved. Data subjects retain the right to request human review of automated decisions. Personal information controllers deploying AI-based decision systems must conduct a Data Privacy Impact Assessment (DPIA) before deployment.',
    source_url: 'https://www.privacy.gov.ph/advisory-opinions/',
    effective_date: '2023-06-01',
    source_authority: 'ministry_guideline',
  },
]

async function seed() {
  const conn = await pool.getConnection()
  try {
    for (const rule of phRules) {
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
    console.log(`✓ Seeded ${phRules.length} PH rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seed().catch(console.error)
