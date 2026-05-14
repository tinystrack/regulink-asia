import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const thRules: RuleNode[] = [
  {
    id: 'TH-PDPA-28',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 28',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['adequate_protection_standard'],
    text_en: 'A data controller shall not send or transfer personal data to a foreign country unless that foreign country has adequate personal data protection standards. The criteria for considering adequate personal data protection standards shall be as prescribed by the Committee.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-29',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 29',
    dimension: 'cross_border_transfer',
    requirement_type: 'conditional',
    mechanism: ['consent', 'contract_necessity', 'vital_interest', 'public_interest'],
    text_en: 'Notwithstanding Section 28, the data controller may send or transfer personal data to a foreign country in the following cases: the data subject has given explicit consent; it is necessary for the performance of a contract to which the data subject is a party; it is necessary for the performance of a contract between the data controller and a third party for the benefit of the data subject; it is necessary for preventing or suppressing a danger to the life, body or health of the data subject or other persons.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-6',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 6',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['explicit_consent', 'written_consent'],
    text_en: 'The collection of personal data shall be done only for the purpose specified to the data subject, and to the extent necessary for that purpose. The data controller shall not collect personal data without the consent of the data subject, except as otherwise provided in this Act.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-37',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 37',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['technical_measures', 'organizational_measures'],
    text_en: 'The data controller shall provide appropriate security measures for preventing unauthorised or unlawful loss, access to, use, alteration, correction, or disclosure of personal data, and shall review such measures when necessary or when technology has changed.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-40',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 40',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['authority_notification_72h', 'individual_notification'],
    text_en: 'In the event of a personal data breach, the data controller shall notify the Office of the Personal Data Protection Committee without delay and, where feasible, within 72 hours after becoming aware of it, unless the personal data breach is unlikely to result in a risk to the rights and freedoms of individuals.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-19',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 19',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['right_to_access', 'right_to_copy'],
    text_en: 'The data subject has the right to request access to and obtain a copy of the personal data relating to him or her which is under the responsibility of the data controller, or request the data controller to disclose the acquisition of personal data obtained without his or her consent.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
  {
    id: 'TH-PDPA-30',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 30',
    dimension: 'data_localisation',
    requirement_type: 'not_regulated',
    mechanism: [],
    text_en: 'Thailand PDPA does not impose general data localisation requirements. Data may be stored outside Thailand subject to adequate protection standards under Section 28 or the exemptions under Section 29.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'ministry_guideline',
  },
  {
    id: 'TH-PDPA-26',
    country: 'TH',
    law: 'Personal Data Protection Act B.E. 2562 (PDPA)',
    article: 'Section 26',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['explicit_consent'],
    text_en: 'Collection, use or disclosure of sensitive personal data including racial or ethnic origin, political opinions, religious or philosophical beliefs, sexual behaviour, criminal records, health data, disability, trade union information, genetic data, biometric data, or any other data which may affect the data subject in the same manner, shall be prohibited unless explicit consent is given by the data subject.',
    source_url: 'https://www.oic.go.th/FILEWEB/CABINFOCENTER3/DRAWER068/GENERAL/DATA0000/00000292.PDF',
    effective_date: '2022-06-01',
    source_authority: 'official_law',
  },
]

async function seedTH() {
  const conn = await pool.getConnection()
  try {
    for (const rule of thRules) {
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
    console.log(`✓ Seeded ${thRules.length} TH rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seedTH().catch(console.error)
