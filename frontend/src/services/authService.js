const USERS_KEY = 'project-hub-accounts'
const DEMO_USER = {
  id: 'demo-user',
  name: 'Alex Morgan',
  email: 'demo@projecthub.com',
  role: 'Product Designer',
  avatarColor: 'lavender',
}

function readUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    window.localStorage.removeItem(USERS_KEY)
    return []
  }
}

function waitForMockRequest() {
  return new Promise((resolve) => window.setTimeout(resolve, 450))
}

async function hashPassword(password, salt) {
  const encodedSalt = salt || window.crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await window.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encodedSalt, iterations: 120000, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  return {
    salt: Array.from(encodedSalt, (byte) => byte.toString(16).padStart(2, '0')).join(''),
    passwordHash: Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join(''),
  }
}

function saltFromHex(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
}

export async function registerUser({ name, email, password }) {
  await waitForMockRequest()
  const normalizedEmail = email.trim().toLowerCase()
  const users = readUsers()

  if (normalizedEmail === DEMO_USER.email || users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const user = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: 'Member',
    avatarColor: 'blue',
  }
  const credentials = await hashPassword(password)
  window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, { ...user, ...credentials }]))
  return user
}

export async function loginUser({ email, password }) {
  await waitForMockRequest()
  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail === DEMO_USER.email && password === 'password123') {
    return DEMO_USER
  }

  const user = readUsers().find((item) => item.email === normalizedEmail)
  if (!user?.salt || !user.passwordHash) throw new Error('Email or password is incorrect.')
  const candidate = await hashPassword(password, saltFromHex(user.salt))
  if (candidate.passwordHash !== user.passwordHash) throw new Error('Email or password is incorrect.')
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarColor: user.avatarColor,
  }
}
