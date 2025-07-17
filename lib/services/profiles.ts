import { createClient } from "../supabase/client"
import { Profile, ProfileInsert, ProfileUpdate } from "../types/database"

export class ProfileService {
  private supabase = createClient()

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  }

  async createProfile(profile: ProfileInsert): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single()

    if (error) {
      console.error("Error creating profile:", error)
      return null
    }

    return data
  }

  async updateProfile(
    userId: string,
    updates: ProfileUpdate
  ): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      return null
    }

    return data
  }

  async deleteProfile(userId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from("profiles")
      .delete()
      .eq("user_id", userId)

    if (error) {
      console.error("Error deleting profile:", error)
      return false
    }

    return true
  }

  async uploadAvatar(file: File, userId: string): Promise<string | null> {
    console.log("ProfileService.uploadAvatar called with:", {
      fileName: file.name,
      fileSize: file.size,
      userId,
    })

    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = fileName

    console.log("Generated file path:", filePath)

    const { error: uploadError } = await this.supabase.storage
      .from("avatars")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError)
      console.error("Upload error details:", {
        message: uploadError.message,
        name: uploadError.name,
      })
      return null
    }

    console.log("Avatar upload successful, getting public URL...")

    const { data } = this.supabase.storage
      .from("avatars")
      .getPublicUrl(filePath)

    console.log("Public URL generated:", data.publicUrl)

    return data.publicUrl
  }
}

export const profileService = new ProfileService()
