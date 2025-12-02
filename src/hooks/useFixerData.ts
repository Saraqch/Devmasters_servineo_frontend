import { useState, useEffect } from "react"
import { fixerService } from "@/services/fixerService"
import { JobWithFixers } from "@/types/fixer"

interface UseFixerDataReturn {
  jobsWithFixers: JobWithFixers[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useFixerData(): UseFixerDataReturn {
  const [jobsWithFixers, setJobsWithFixers] = useState<JobWithFixers[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fixerService.getJobsWithFixers()
      setJobsWithFixers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      console.error("Error fetching fixer data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    jobsWithFixers,
    loading,
    error,
    refetch: fetchData,
  }
}
