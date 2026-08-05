import { sendEmail } from '~~/server/services/mail/resend'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  const data = await sendEmail(config.resendApiKey, {
    from: 'onboarding@resend.dev',
    to: 'moravskywebdesign@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
  })

  return { ok: true, id: data?.id ?? null }
})
