"use client"

import { useState } from "react"
import { ProfileDisplay } from "@/components/profile-display"
import { ProfileForm } from "@/components/profile-form"
import Link from "next/link"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          My Profile
        </h1>

        {isEditing ? (
          <div>
            <ProfileForm />
            <div className="text-center mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="text-blue-600 hover:text-blue-800 underline">
                Back to Profile
              </button>
            </div>
          </div>
        ) : (
          <ProfileDisplay
            showEditButton={true}
            onEdit={() => setIsEditing(true)}
          />
        )}

        <div className="text-center mt-4">
          <button className="text-blue-600 hover:text-blue-800 underline">
            <Link href="/">Back to Home</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
