"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { profileService } from "@/lib/services/profiles"
import { Profile } from "@/lib/types/database"
import { User } from "@supabase/supabase-js"
import Image from "next/image"

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const getUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      const existingProfile = await profileService.getProfile(user.id)
      if (existingProfile) {
        setProfile(existingProfile)
        setFirstName(existingProfile.first_name || "")
        setLastName(existingProfile.last_name || "")
      }
    }
  }, [supabase.auth])

  useEffect(() => {
    getUser()
  }, [getUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      let avatarUrl = profile?.avatar_url
      console.log("Starting form submission...")
      console.log("Avatar file selected:", avatarFile)
      console.log("User ID:", user.id)

      // Upload avatar if a new file is selected
      if (avatarFile) {
        console.log("Uploading avatar...")
        avatarUrl = await profileService.uploadAvatar(avatarFile, user.id)
        console.log("Avatar upload result:", avatarUrl)

        if (!avatarUrl) {
          console.error("Avatar upload failed - no URL returned")
          alert("Avatar upload failed. Please check the console for errors.")
          return
        }
      }

      const profileData = {
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
      }

      console.log("Profile data to save:", profileData)

      let result
      if (profile) {
        // Update existing profile
        console.log("Updating existing profile...")
        result = await profileService.updateProfile(user.id, profileData)
      } else {
        // Create new profile
        console.log("Creating new profile...")
        result = await profileService.createProfile(profileData)
      }

      console.log("Profile save result:", result)

      if (result) {
        setProfile(result)
        alert("Profile saved successfully!")
        setAvatarFile(null)
        if (avatarInputRef.current) {
          avatarInputRef.current.value = ""
        }
      } else {
        alert("Error saving profile")
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error)
      alert(
        "Error saving profile: " +
          (error instanceof Error ? error.message : String(error))
      )
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">
          Please sign in to manage your profile.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {profile ? "Edit Profile" : "Create Profile"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700 mb-1">
            Avatar Picture
          </label>
          <input
            type="file"
            id="avatar"
            ref={avatarInputRef}
            accept="image/*"
            onChange={e => setAvatarFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="w-full text-sm text-gray-500">
            {avatarFile?.name || " "}
          </span>
        </div>

        {profile?.avatar_url && (
          <div className="flex justify-center">
            <Image
              src={profile.avatar_url}
              alt="Current avatar"
              width={80}
              height={80}
              className="rounded-full object-cover border-2 border-gray-300"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading
            ? "Saving..."
            : profile
            ? "Update Profile"
            : "Create Profile"}
        </button>
      </form>
    </div>
  )
}
