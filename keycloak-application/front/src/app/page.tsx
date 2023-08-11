'use client'

import { useKeycloack } from "@/providers/KeycloakProvider"

export default function Home() {
  const state = useKeycloack()

  console.log('STATE: ', state)

  const testProtectedRoute = async () => {
    try {
      const response = await fetch('http://localhost:3333/protected', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      })

      console.log('Response api: ', await response.json())
    } catch (error) {
      console.error('ERROR: ', error)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <button
        onClick={testProtectedRoute}
        className="text-gray-800 rounded rounded-s bg-green-400 h-11 w-[300px]"
      >
        Test api endpoint
      </button>
    </main>
  )
}
