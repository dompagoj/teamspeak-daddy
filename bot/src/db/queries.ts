export const GET_MESSAGES = `
  SELECT * from message  
`

export const GET_MESSAGES_BY_TRIGGER = `
  SELECT * from message
  WHERE trigger = $1
`
export const GET_MESSAGE_BY_ID = `
  SELECT * from message
  WHERE id = $1
  LIMIT 1
`

export const CREATE_MESSAGE = `
  INSERT INTO message(trigger, content) values (trim($1), trim($2)) RETURNING id
`
