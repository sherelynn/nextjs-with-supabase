"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { profileService } from "@/lib/services/profiles"
import { Profile } from "@/lib/types/database"
import Image from "next/image"

interface ProfileDisplayProps {
  userId?: string
  showEditButton?: boolean
  onEdit?: () => void
}

export function ProfileDisplay({
  userId,
  showEditButton = false,
  onEdit,
}: ProfileDisplayProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const getProfile = useCallback(async () => {
    setLoading(true)

    let targetUserId = userId

    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      targetUserId = user?.id
    }

    if (targetUserId) {
      const profileData = await profileService.getProfile(targetUserId)
      setProfile(profileData)
    }

    setLoading(false)
  }, [userId, supabase.auth])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">No profile found.</p>
        {showEditButton && (
          <button
            onClick={onEdit}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Create Profile
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        {profile.avatar_url && (
          <div className="flex justify-center mb-4">
            <Image
              src={profile.avatar_url}
              alt={`${profile.first_name} ${profile.last_name}`}
              width={80}
              height={80}
              className="rounded-full object-cover border-2 border-gray-300"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {profile.first_name} {profile.last_name}
        </h2>

        <p className="text-gray-600 mb-4">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </p>

        {showEditButton && (
          <button
            onClick={onEdit}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}
