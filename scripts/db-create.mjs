import postgres from 'postgres'

const sql = postgres('postgresql://postgres@localhost:5432/postgres')

try {
  await sql.unsafe(
    'CREATE DATABASE nuxt WITH ENCODING \'UTF8\' TEMPLATE template0',
  )
  console.log('Database nuxt created')
}
catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  if (message.includes('already exists')) {
    console.log('Database nuxt already exists')
  }
  else {
    throw error
  }
}
finally {
  await sql.end()
}
