import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const jpRules: RuleNode[] = [
  {
    id: 'JP-APPI-24',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 24',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['consent', 'adequacy_decision', 'standard_contract'],
    text_en: 'A business operator handling personal information shall not provide personal information to a third party in a foreign country without obtaining in advance the consent of the principal, except where the foreign country has been designated by the Personal Information Protection Commission as having a personal data protection system equivalent to Japan, or where the third party has established a system conforming to the standards specified by the Commission.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'official_law',
  },
  {
    id: 'JP-APPI-24-2',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 24 (Information Provision)',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['disclosure_obligation'],
    text_en: 'When obtaining consent for cross-border transfer, the business operator must provide the principal with information necessary for making a decision, including the name of the foreign country, the personal data protection system of that country, and the measures taken by the third party to protect personal data.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'official_law',
  },
  {
    id: 'JP-APPI-17',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 17',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['purpose_specification', 'consent'],
    text_en: 'A business operator handling personal information shall specify the purpose of use of personal information as much as possible. A business operator shall not handle personal information beyond the scope necessary to achieve the specified purpose of use without obtaining the consent of the individual in advance.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'official_law',
  },
  {
    id: 'JP-APPI-26',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 26',
    dimension: 'breach_notification',
    requirement_type: 'mandatory',
    mechanism: ['ppc_notification', 'individual_notification'],
    text_en: 'When a business operator becomes aware of a leak, loss or damage of personal data that falls under the cases specified by the Personal Information Protection Commission rules, it must report to the Personal Information Protection Commission promptly (within 3 to 5 days for preliminary report, 30 days for full report) and notify the affected individuals without delay.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'official_law',
  },
  {
    id: 'JP-APPI-28',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 28',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['right_to_disclosure', 'right_to_correction', 'right_to_deletion'],
    text_en: 'When requested by the principal, a business operator handling personal information shall disclose retained personal data without delay. The principal may also request correction, addition or deletion of retained personal data if the content is contrary to fact, and cessation of use or erasure where the data has been handled in violation of the law.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'official_law',
  },
  {
    id: 'JP-APPI-23',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 23',
    dimension: 'data_localisation',
    requirement_type: 'not_regulated',
    mechanism: [],
    text_en: 'Japan does not impose general data localisation requirements. Personal data may be stored outside Japan. Cross-border transfers are governed by Article 24 consent and adequacy requirements rather than localisation mandates.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'ministry_guideline',
  },
  {
    id: 'JP-APPI-20',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 20',
    dimension: 'security_assessment',
    requirement_type: 'mandatory',
    mechanism: ['security_control_measures', 'employee_supervision', 'contractor_supervision'],
    text_en: 'A business operator handling personal information shall take necessary and appropriate measures for the prevention of leakage, loss or damage, and for other security control of personal data. The operator shall also exercise necessary and appropriate supervision over its employees and contractors who handle personal data.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'official_law',
  },
  {
    id: 'JP-APPI-16',
    country: 'JP',
    law: 'Act on the Protection of Personal Information (APPI) 2022 Amendment',
    article: 'Article 16',
    dimension: 'retention',
    requirement_type: 'conditional',
    mechanism: ['purpose_limitation', 'retention_period'],
    text_en: 'A business operator handling personal information shall endeavour to keep personal data accurate and up to date within the scope necessary to achieve the purpose of use, and shall endeavour to delete personal data without delay once the purpose of use has been achieved.',
    source_url: 'https://www.ppc.go.jp/en/legal/policy/houndation/',
    effective_date: '2022-04-01',
    source_authority: 'official_law',
  },
]

async function seedJP() {
  const conn = await pool.getConnection()
  try {
    for (const rule of jpRules) {
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
    console.log(`✓ Seeded ${jpRules.length} JP rules`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seedJP().catch(console.error)
