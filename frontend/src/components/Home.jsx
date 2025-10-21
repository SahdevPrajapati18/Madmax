import React from 'react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative pb-2 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Home
          </h1>
          <div className="absolute bottom-0 left-0 h-1 w-12 bg-blue-600 rounded-full"></div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-prose">
          Welcome to the app.
        </p>
      </div>
    </main>
  )
}
