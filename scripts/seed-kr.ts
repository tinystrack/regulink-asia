import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const krRules: RuleNode[] = [
  {
    id: 'KR-PIPA-28-8',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 28-8',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['consent', 'contract_necessity', 'adequacy_decision', 'standard_contract', 'certification'],
    text_en: 'A personal information controller that intends to provide personal information to a third party in a foreign country shall obtain consent from the data subject, or satisfy one of the following: the foreign country has been recognized as having an adequate level of protection; the personal information controller has concluded a standard contract with the overseas recipient; the overseas recipient has obtained certification from an authorized institution.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'official_law',
  },
  {
    id: 'KR-PIPA-28-9',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 28-9',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['prior_notice'],
    text_en: 'Prior to transferring personal information overseas, the personal information controller shall notify the data subject of the following: the items of personal information to be transferred; the name and contact information of the recipient; the purpose of use by the recipient; the retention and use period by the recipient; and the fact that the data subject has the right to withdraw consent.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'official_law',
  },
  {
    id: 'KR-PIPA-15',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 15',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['consent', 'contract_necessity', 'legal_obligation', 'vital_interest', 'legitimate_interest'],
    text_en: 'A personal information controller may collect personal information and use it for the purpose of collection only in the following cases: where the data subject has given consent; where it is necessary for the performance of a contract with the data subject or for taking pre-contractual steps; where it is necessary for compliance with a legal obligation; where it is necessary to protect the vital interests of the data subject or another person.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'official_law',
  },
  {
    id: 'KR-PIPA-34',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 34',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['pipc_notification_72h', 'individual_notification'],
    text_en: 'When a personal information controller becomes aware of a breach of personal information, it shall notify the affected data subjects without delay and report to the Personal Information Protection Commission within 72 hours. The notification shall include the items of personal information breached, the time of breach, measures that the data subject can take, and remedial measures by the controller.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'official_law',
  },
  {
    id: 'KR-PIPA-35',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 35',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['right_to_access', 'right_to_correction', 'right_to_deletion', 'right_to_suspend'],
    text_en: 'A data subject may request the personal information controller to provide access to the personal information held about them, to correct any inaccuracies, to delete personal information, and to suspend processing. The controller shall comply with such requests without delay and within the period prescribed by Presidential Decree.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'official_law',
  },
  {
    id: 'KR-PIPA-29',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 29',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['technical_measures', 'managerial_measures', 'physical_measures'],
    text_en: 'A personal information controller shall take technical, managerial and physical measures necessary to ensure safety, such as establishing an internal management plan, controlling access to personal information processing systems, installing access control systems, encrypting personal information, and installing and operating security programs.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'official_law',
  },
  {
    id: 'KR-PIPA-24-2',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 24-2',
    dimension: 'data_localisation',
    requirement_type: 'not_regulated',
    mechanism: [],
    text_en: 'Korea does not impose general data localisation requirements under PIPA. However, certain sector-specific laws (e.g. financial sector) may impose localisation requirements. Cross-border transfers are governed by Article 28-8 consent and adequacy requirements.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'ministry_guideline',
  },
  {
    id: 'KR-PIPA-23',
    country: 'KR',
    law: 'Personal Information Protection Act (PIPA) 2023 Amendment',
    article: 'Article 23',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['explicit_consent'],
    text_en: 'A personal information controller shall not process sensitive information such as ideology, belief, trade union or political party membership, political opinions, health or medical records, sexual life, criminal records, biometric data for identifying individuals, or genetic information, without the explicit consent of the data subject.',
    source_url: 'https://www.pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS217&mCode=D010030000&nttId=9175',
    effective_date: '2023-09-15',
    source_authority: 'official_law',
  },
]

async function seedKR() {
  const conn = await pool.getConnection()
  try {
    for (const rule of krRules) {
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
    console.log(`✓ Seeded ${krRules.length} KR rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seedKR().catch(console.error)
