import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { DiffRow } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { country_a, country_b } = await req.json()

    if (!country_a || !country_b) {
      return NextResponse.json({ error: 'Both country_a and country_b are required' }, { status: 400 })
    }

    const ca = country_a.toUpperCase()
    const cb = country_b.toUpperCase()

    const [rows] = await pool.execute(
      `SELECT dimension,
        MAX(CASE WHEN country = ? THEN requirement_type END) as a_requirement_type,
        MAX(CASE WHEN country = ? THEN article END) as a_article,
        MAX(CASE WHEN country = ? THEN law END) as a_law,
        MAX(CASE WHEN country = ? THEN id END) as a_rule_id,
        MAX(CASE WHEN country = ? THEN source_url END) as a_source_url,
        MAX(CASE WHEN country = ? THEN mechanism END) as a_mechanism,
        MAX(CASE WHEN country = ? THEN requirement_type END) as b_requirement_type,
        MAX(CASE WHEN country = ? THEN article END) as b_article,
        MAX(CASE WHEN country = ? THEN law END) as b_law,
        MAX(CASE WHEN country = ? THEN id END) as b_rule_id,
        MAX(CASE WHEN country = ? THEN source_url END) as b_source_url,
        MAX(CASE WHEN country = ? THEN mechanism END) as b_mechanism
      FROM rules
      WHERE country IN (?, ?)
      GROUP BY dimension
      ORDER BY dimension`,
      [ca, ca, ca, ca, ca, ca, cb, cb, cb, cb, cb, cb, ca, cb]
    ) as any[]

    const diff: DiffRow[] = (rows as any[]).map((row: any) => {
      const parseMechanism = (val: any): string[] => {
        if (!val) return []
        if (Array.isArray(val)) return val
        if (typeof val === 'string') {
          try { return JSON.parse(val) } catch { return [] }
        }
        return []
      }

      return {
        dimension: row.dimension,
        country_a: row.a_requirement_type ? {
          requirement_type: row.a_requirement_type,
          mechanism: parseMechanism(row.a_mechanism),
          article: row.a_article,
          law: row.a_law,
        } : null,
        country_b: row.b_requirement_type ? {
          requirement_type: row.b_requirement_type,
          mechanism: parseMechanism(row.b_mechanism),
          article: row.b_article,
          law: row.b_law,
        } : null,
      }
    })

    return NextResponse.json({ country_a: ca, country_b: cb, diff })
  } catch (err) {
    console.error('Diff error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
