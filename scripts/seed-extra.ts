import pool from '../lib/db'
import { RuleNode } from '../lib/types'

const extraRules: RuleNode[] = [
  // India DPDP 2023
  {
    id: 'IN-DPDP-16',
    country: 'IN',
    law: 'Digital Personal Data Protection Act 2023 (DPDP)',
    article: 'Section 16',
    dimension: 'cross_border_transfer',
    requirement_type: 'conditional',
    mechanism: ['government_approved_countries'],
    text_en: 'The Central Government may, after an assessment of factors it considers necessary, notify countries or territories to which a Data Fiduciary may transfer personal data. Transfer is prohibited to countries not on the approved list. The Government may also restrict transfer to specific Data Fiduciaries in approved countries.',
    source_url: 'https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf',
    effective_date: '2023-08-11',
    source_authority: 'official_law',
  },
  {
    id: 'IN-DPDP-6',
    country: 'IN',
    law: 'Digital Personal Data Protection Act 2023 (DPDP)',
    article: 'Section 6',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['free_specific_informed_consent', 'clear_affirmative_action'],
    text_en: 'Consent of a Data Principal shall be free, specific, informed, unconditional and unambiguous with a clear affirmative action, and shall signify an agreement to the processing of personal data for the specified purpose. A notice must be given prior to obtaining consent specifying the personal data and the purpose of processing.',
    source_url: 'https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf',
    effective_date: '2023-08-11',
    source_authority: 'official_law',
  },
  {
    id: 'IN-DPDP-8',
    country: 'IN',
    law: 'Digital Personal Data Protection Act 2023 (DPDP)',
    article: 'Section 8',
    dimension: 'data_localisation',
    requirement_type: 'not_regulated',
    mechanism: [],
    text_en: 'India DPDP 2023 does not impose blanket data localisation. Cross-border transfers are governed by the approved country list under Section 16. The previous localisation requirements under older draft bills were removed in the final 2023 Act.',
    source_url: 'https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf',
    effective_date: '2023-08-11',
    source_authority: 'ministry_guideline',
  },
  {
    id: 'IN-DPDP-9',
    country: 'IN',
    law: 'Digital Personal Data Protection Act 2023 (DPDP)',
    article: 'Section 9',
    dimension: 'data_subject_rights',
    requirement_type: 'mandatory',
    mechanism: ['right_to_access', 'right_to_correction', 'right_to_erasure', 'right_to_grievance'],
    text_en: 'A Data Principal shall have the right to obtain from the Data Fiduciary a summary of personal data processed and processing activities; the identities of all Data Fiduciaries with whom personal data has been shared; and any other information as may be prescribed. The Data Principal also has the right to correction, completion, updating and erasure of personal data.',
    source_url: 'https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf',
    effective_date: '2023-08-11',
    source_authority: 'official_law',
  },
  // Indonesia PDP 2022
  {
    id: 'ID-PDP-56',
    country: 'ID',
    law: 'Law No. 27 of 2022 on Personal Data Protection (PDP Law)',
    article: 'Article 56',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['adequate_protection', 'binding_agreement', 'minister_approval'],
    text_en: 'Transfer of personal data to another country shall be conducted if: the destination country has a personal data protection level at least equivalent to Indonesia; binding and enforceable agreements or rules exist between the transferring and receiving parties; or the data subject has given consent after being informed of the risks. The transfer must be reported to the minister responsible for government affairs in the field of communication and informatics.',
    source_url: 'https://jdih.kominfo.go.id/produk_hukum/view/id/630/t/undangundang+nomor+27+tahun+2022',
    effective_date: '2022-10-17',
    source_authority: 'official_law',
  },
  {
    id: 'ID-PDP-20',
    country: 'ID',
    law: 'Law No. 27 of 2022 on Personal Data Protection (PDP Law)',
    article: 'Article 20',
    dimension: 'consent',
    requirement_type: 'mandatory',
    mechanism: ['explicit_consent', 'written_electronic_consent'],
    text_en: 'The processing of personal data shall be based on a valid legal basis, which includes: the explicit consent of the personal data subject; fulfillment of contractual obligations; fulfillment of legal obligations; protection of vital interests; implementation of duties in the public interest; and fulfillment of other legitimate interests. Consent must be given explicitly in written or electronic form.',
    source_url: 'https://jdih.kominfo.go.id/produk_hukum/view/id/630/t/undangundang+nomor+27+tahun+2022',
    effective_date: '2022-10-17',
    source_authority: 'official_law',
  },
  {
    id: 'ID-PDP-35',
    country: 'ID',
    law: 'Law No. 27 of 2022 on Personal Data Protection (PDP Law)',
    article: 'Article 35',
    dimension: 'data_localisation',
    requirement_type: 'conditional',
    mechanism: ['strategic_sector_localisation'],
    text_en: 'Personal data classified as strategic for the state and/or government administration must be processed and stored within Indonesian territory. The categories of strategic personal data and the sectors subject to this requirement shall be determined by Government Regulation.',
    source_url: 'https://jdih.kominfo.go.id/produk_hukum/view/id/630/t/undangundang+nomor+27+tahun+2022',
    effective_date: '2022-10-17',
    source_authority: 'official_law',
  },
  // RCEP Chapter 12
  {
    id: 'RCEP-12-15',
    country: 'RCEP',
    law: 'Regional Comprehensive Economic Partnership (RCEP) Agreement',
    article: 'Article 12.15',
    dimension: 'cross_border_transfer',
    requirement_type: 'voluntary',
    mechanism: ['best_endeavours', 'no_binding_obligation'],
    text_en: 'Each Party shall endeavour to adopt or maintain a legal framework that provides for the protection of the personal information of the users of electronic commerce. In the development of its legal framework for the protection of personal information, each Party should take into account principles or guidelines of relevant international bodies. Each Party recognises that key principles include limitation on collection, choice, data quality, purpose specification, use limitation, security safeguards, transparency, individual participation, and accountability.',
    source_url: 'https://www.dfat.gov.au/trade/agreements/in-force/rcep/rcep-text-and-associated-documents',
    effective_date: '2022-01-01',
    source_authority: 'official_law',
  },
  {
    id: 'RCEP-12-14',
    country: 'RCEP',
    law: 'Regional Comprehensive Economic Partnership (RCEP) Agreement',
    article: 'Article 12.14',
    dimension: 'data_localisation',
    requirement_type: 'voluntary',
    mechanism: ['no_binding_obligation'],
    text_en: 'RCEP Article 12.14 does not contain binding data localisation prohibitions. Unlike CPTPP, RCEP does not include enforceable cross-border data flow obligations. Parties may maintain data localisation measures subject to general exceptions. The provision is best-endeavours only.',
    source_url: 'https://www.dfat.gov.au/trade/agreements/in-force/rcep/rcep-text-and-associated-documents',
    effective_date: '2022-01-01',
    source_authority: 'official_law',
  },
  // CPTPP Chapter 14
  {
    id: 'CPTPP-14-13',
    country: 'CPTPP',
    law: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP)',
    article: 'Article 14.13',
    dimension: 'cross_border_transfer',
    requirement_type: 'mandatory',
    mechanism: ['free_flow_obligation', 'general_exceptions'],
    text_en: 'Each Party shall allow the cross-border transfer of information by electronic means, including personal information, when this activity is for the conduct of the business of a covered person. No Party shall prevent a covered person from transferring information, including personal information, across borders by electronic means if this activity is for the conduct of the business of a covered person. Exceptions apply for legitimate public policy objectives.',
    source_url: 'https://www.dfat.gov.au/trade/agreements/in-force/cptpp/cptpp-text-and-associated-documents',
    effective_date: '2018-12-30',
    source_authority: 'official_law',
  },
  {
    id: 'CPTPP-14-13-2',
    country: 'CPTPP',
    law: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership (CPTPP)',
    article: 'Article 14.13 (Data Localisation)',
    dimension: 'data_localisation',
    requirement_type: 'prohibited',
    mechanism: ['prohibition_on_localisation'],
    text_en: 'No Party shall require a covered person to use or locate computing facilities in that Party\'s territory as a condition for conducting business in that territory. This prohibition on data localisation requirements is subject to exceptions for legitimate public policy objectives that are necessary and not applied in a manner that constitutes a means of arbitrary or unjustifiable discrimination.',
    source_url: 'https://www.dfat.gov.au/trade/agreements/in-force/cptpp/cptpp-text-and-associated-documents',
    effective_date: '2018-12-30',
    source_authority: 'official_law',
  },
]

async function seedExtra() {
  const conn = await pool.getConnection()
  try {
    for (const rule of extraRules) {
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
    console.log(`✓ Seeded ${extraRules.length} rules (IN + ID + RCEP + CPTPP)`)
  } finally {
    conn.release()
    await pool.end()
  }
}

seedExtra().catch(console.error)
