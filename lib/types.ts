export type RequirementType = 'mandatory' | 'conditional' | 'voluntary' | 'prohibited' | 'not_regulated'
export type SourceAuthority = 'official_law' | 'official_amendment' | 'ministry_guideline' | 'paraphrase'
export type Dimension =
  | 'cross_border_transfer'
  | 'data_localisation'
  | 'consent'
  | 'security_assessment'
  | 'privacy_policy'
  | 'data_subject_rights'
  | 'breach_notification'
  | 'retention'

export interface RuleNode {
  id: string
  country: string
  law: string
  article: string
  dimension: Dimension
  requirement_type: RequirementType
  mechanism: string[]
  text_en: string
  text_zh?: string
  source_url: string
  effective_date: string
  source_authority: SourceAuthority
}

export interface Citation {
  rule_id: string
  country: string
  law: string
  article: string
  text_en: string
  source_url: string
}

export interface QueryResponse {
  answer: string
  citations: Citation[]
}

export interface DiffRow {
  dimension: string
  country_a: { requirement_type: RequirementType; mechanism: string[]; article: string; law: string } | null
  country_b: { requirement_type: RequirementType; mechanism: string[]; article: string; law: string } | null
}

export interface ComplianceAdvice {
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW'
  required_steps: { rule_id: string; law: string; article: string; requirement: string }[]
  citations: Citation[]
  summary: string
}
