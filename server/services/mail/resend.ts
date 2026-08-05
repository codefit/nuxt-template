import { Resend } from 'resend'

export interface SendEmailInput {
  to: string | string[]
  from?: string
  html: string
  subject: string
}

export function createResend(apiKey: string) {
  return new Resend(apiKey)
}

export async function sendEmail(apiKey: string, input: SendEmailInput) {
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing Resend API key',
    })
  }

  const resend = createResend(apiKey)
  const { data, error } = await resend.emails.send({
    from: input.from || 'onboarding@resend.dev',
    to: input.to,
    subject: input.subject,
    html: input.html,
  })

  if (error) {
    throw createError({
      statusCode: 502,
      statusMessage: error.message || 'Resend send failed',
    })
  }

  return data
}
