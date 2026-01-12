import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile',
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your account and preferences
        </p>
      </div>

      {/* Placeholder */}
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-gray-600">
          Profile page - future implementation
        </p>
      </div>
    </div>
  )
}
