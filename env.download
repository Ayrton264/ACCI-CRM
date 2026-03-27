import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabase'
import SEED_JOBS from '../../../lib/seedData'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Check if already seeded
  const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true })
  if (count && count > 0) {
    return res.status(200).json({ message: 'Already seeded', count })
  }

  // Insert in batches of 200
  const batchSize = 200
  let inserted = 0
  for (let i = 0; i < SEED_JOBS.length; i += batchSize) {
    const batch = SEED_JOBS.slice(i, i + batchSize).map((j: any) => ({
      job_number: j.jobNumber,
      project_name: j.projectName || '',
      gc: j.gc || null,
      location: j.location || null,
      scope: j.scope || null,
      estimator: j.estimator || null,
      status: j.status || 'Upcoming',
      bid_due_date: j.bidDueDate || null,
      takeoff_date: j.takeoffDate || null,
      bid_price: j.bidPrice ? parseFloat(j.bidPrice) : null,
      notes: j.notes || null,
      contact_name: j.contactName || null,
      contact_email: j.contactEmail || null,
      follow_up_date: j.followUpDate || null,
      submission_date: j.submissionDate || null,
    }))

    const { error } = await supabase.from('jobs').upsert(batch, { onConflict: 'job_number' })
    if (error) return res.status(500).json({ error: error.message, batch: i })
    inserted += batch.length
  }

  return res.status(200).json({ success: true, inserted })
}
