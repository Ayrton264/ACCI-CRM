import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const body = req.body
    const update: any = {}
    const map: Record<string, string> = {
      projectName: 'project_name', gc: 'gc', location: 'location',
      scope: 'scope', estimator: 'estimator', status: 'status',
      bidDueDate: 'bid_due_date', takeoffDate: 'takeoff_date',
      bidPrice: 'bid_price', notes: 'notes', contactName: 'contact_name',
      contactEmail: 'contact_email', followUpDate: 'follow_up_date',
      submissionDate: 'submission_date',
    }
    for (const [k, col] of Object.entries(map)) {
      if (k in body) update[col] = body[k] === '' ? null : body[k]
    }
    if (update.bid_price) update.bid_price = parseFloat(update.bid_price)

    const { data, error } = await supabase.from('jobs').update(update).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('jobs').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
