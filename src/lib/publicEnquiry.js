import { supabase } from './supabase'

export async function submitPublicEnquiry(payload) {
  if (!supabase) {
    throw new Error('The enquiry service is unavailable because Supabase is not configured.')
  }
  const { data, error } = await supabase.functions.invoke('public-enquiry', { body: payload })
  if (error) {
    let message = 'Unable to send your enquiry right now. Please try WhatsApp or contact Tech In Air directly.'
    if (error.context instanceof Response) {
      try {
        const responseBody = await error.context.json()
        if (typeof responseBody?.error === 'string') message = responseBody.error
      } catch {
        // The Edge Function may return a non-JSON network error.
      }
    } else if (typeof error.message === 'string' && error.message) {
      message = error.message
    }
    throw new Error(message)
  }
  if (data?.accepted !== true) {
    throw new Error('The enquiry was not confirmed. Please try WhatsApp or contact Tech In Air directly.')
  }
  return data
}
