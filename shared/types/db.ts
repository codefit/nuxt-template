import { messages } from '@nuxthub/db/schema'

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type MessageForm = Pick<NewMessage, 'name' | 'email' | 'message'>
