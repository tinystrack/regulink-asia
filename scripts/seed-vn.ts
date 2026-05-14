import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const vnRules: RuleNode[] = [
  {
    id: 'VN-D13-25',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 25',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['impact_assessment', 'ministry_notification', 'consent'],
    text_en: 'The transfer of personal data of Vietnamese citizens to a foreign country must satisfy all of the following conditions: the data subject has consented; the original purpose of processing is maintained; the transferring party has conducted a personal data protection impact assessment; the Ministry of Public Security has been notified and the dossier submitted for review.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206990',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'VN-D13-25-2',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 25 (Paragraph 2)',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['ministry_of_public_security_dossier'],
    text_en: 'The transferring party shall submit a dossier to the Ministry of Public Security including: a description of the transfer, the legal basis, the security measures in place, the data subject categories and volume, the receiving country and recipient details, and the data protection impact assessment results. Processing may commence after the Ministry confirms receipt of the complete dossier.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206990',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'VN-D13-11',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 11',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['explicit_consent', 'written_consent'],
    text_en: 'Consent of the data subject is only valid when: the data subject voluntarily consents with full knowledge of the type of personal data processed, the purpose, the processing organisation, and the rights of the data subject. Consent must be expressed through written, verbal, tick-box, consent syntax via message, or other affirmative action. Silence or non-response shall not be considered consent.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206990',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'VN-D13-26',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 26',
    dimension: 'data_localisation',
    requirement_type: 'conditional',
    mechanism: ['local_storage_requirement'],
    text_en: 'Enterprises providing services in telecommunications, internet, cyberspace value-added services, e-commerce and financial technology in Vietnam that collect, exploit, analyse and process personal data of Vietnamese users must store such data in Vietnam for a minimum period prescribed by the competent authority, and must have a representative or branch office in Vietnam.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206990',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'VN-D13-23',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 23',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['data_protection_impact_assessment'],
    text_en: 'Personal data controllers and processors must conduct a personal data protection impact assessment for processing activities that are likely to result in high risk to the rights and freedoms of data subjects, including processing of sensitive personal data, large-scale processing, systematic monitoring, and cross-border transfers. The assessment must be documented and available to the Ministry of Public Security upon request.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206990',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'VN-D13-9',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 9',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['right_to_know', 'right_to_consent', 'right_to_access', 'right_to_deletion', 'right_to_restrict', 'right_to_object'],
    text_en: 'Data subjects have the following rights: the right to know about processing activities; the right to consent or withhold consent; the right to access their personal data; the right to withdraw consent at any time; the right to delete personal data; the right to restrict processing; the right to object to processing; the right to complain and seek compensation for violations.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206990',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
  {
    id: 'VN-D13-24',
    country: 'VN',
    law: 'Decree No. 13/2023/ND-CP on Personal Data Protection',
    article: 'Article 24',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['ministry_notification_72h', 'individual_notification'],
    text_en: 'In the event of a violation of personal data protection regulations, the personal data controller or processor shall notify the Ministry of Public Security within 72 hours of becoming aware of the violation, and shall notify the affected data subjects without undue delay. The notification shall describe the nature of the violation, the data categories and approximate number of data subjects affected, and the measures taken.',
    source_url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=206990',
    effective_date: '2023-07-01',
    source_authority: 'official_law',
  },
]

async function seedVN() {
  const conn = await pool.getConnection()
  try {
    for (const rule of vnRules) {
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
    console.log(`✓ Seeded ${vnRules.length} VN rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seedVN().catch(console.error)
