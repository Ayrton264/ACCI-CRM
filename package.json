import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabase'

function generateJobNumber(existingNumbers: string[]): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `${yy}${mm}`
  const seqs = existingNumbers
    .filter(n => n && n.startsWith(prefix + '-'))
    .map(n => parseInt(n.split('-')[1], 10))
    .filter(n => !isNaN(n))
  const next = seqs.length > 0 ? Math.max(...seqs) + 1 : 1
  return `${prefix}-${String(next).padStart(2, '0')}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { status, estimator, gc, q } = req.query
    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false })
    if (status && status !== 'All') query = query.eq('status', status)
    if (estimator && estimator !== 'All') query = query.eq('estimator', estimator)
    if (gc && gc !== 'All') query = query.ilike('gc', `%${gc}%`)
    if (q) query = query.or(`project_name.ilike.%${q}%,job_number.ilike.%${q}%`)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    // Get existing job numbers to generate next one atomically
    const { data: existing } = await supabase.from('jobs').select('job_number')
    const existingNums = (existing || []).map((j: any) => j.job_number)
    const jobNumber = generateJobNumber(existingNums)

    const body = req.body
    const { data, error } = await supabase.from('jobs').insert([{
      job_number: jobNumber,
      project_name: body.projectName || '',
      gc: body.gc || null,
      location: body.location || null,
      scope: body.scope || null,
      estimator: body.estimator || null,
      status: body.status || 'Upcoming',
      bid_due_date: body.bidDueDate || null,
      takeoff_date: body.takeoffDate || null,
      bid_price: body.bidPrice ? parseFloat(body.bidPrice) : null,
      notes: body.notes || null,
      contact_name: body.contactName || null,
      contact_email: body.contactEmail || null,
      follow_up_date: body.followUpDate || null,
      submission_date: body.submissionDate || null,
    }]).select().single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(201).json(data)
  }

  res.status(405).end()
}
