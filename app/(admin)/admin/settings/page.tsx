import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-gray-600">
          Platform configuration and preferences
        </p>
      </div>

      {/* Placeholder */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-gray-600">
          Settings page - future implementation
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Will include: Platform config, Email templates, Feature flags
        </p>
      </div>
    </div>
  )
}
