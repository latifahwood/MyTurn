import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rkscbylennairngurayz.supabase.co'
const supabaseKey = 'sb_publishable_llkq1zvIgcU2kp6twS4NSQ_NxhNa5NW'

export const supabase = createClient(supabaseUrl, supabaseKey)