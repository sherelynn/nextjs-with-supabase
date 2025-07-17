"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from "../supabase/client"
import { profileService } from "../services/profiles"
import { Profile } from "../types/database"
import { User } from "@supabase/supabase-js"

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  const supabase = createClient()

  const getProfile = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let targetUserId = userId

      if (!targetUserId) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
        targetUserId = user?.id
      }

      if (targetUserId) {
        const profileData = await profileService.getProfile(targetUserId)
        setProfile(profileData)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [userId, supabase.auth])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return null

    setLoading(true)
    try {
      const updatedProfile = await profileService.updateProfile(
        user.id,
        updates
      )
      if (updatedProfile) {
        setProfile(updatedProfile)
      }
      return updatedProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (
    profileData: Omit<Profile, "id" | "created_at" | "updated_at">
  ) => {
    if (!user?.id) return null

    setLoading(true)
    try {
      const newProfile = await profileService.createProfile({
        ...profileData,
        user_id: user.id,
      })
      if (newProfile) {
        setProfile(newProfile)
      }
      return newProfile
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    } finally {
      setLoading(false)
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!user?.id) return null

    try {
      const avatarUrl = await profileService.uploadAvatar(file, user.id)
      if (avatarUrl && profile) {
        const updatedProfile = await updateProfile({ avatar_url: avatarUrl })
        return updatedProfile
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      return null
    }
  }

  return {
    profile,
    loading,
    error,
    user,
    updateProfile,
    createProfile,
    uploadAvatar,
    refetch: () => {
      setProfile(null)
      setLoading(true)
      // The useEffect will trigger a refetch
    },
  }
}
