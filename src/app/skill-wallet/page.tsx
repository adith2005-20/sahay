"use client"
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

// The interfaces for your data structures remain the same
interface Skill {
  name: string
  category: string
}

interface Certification {
  // Assuming your database table for certifications has these fields
  name: string
  issuer: string
  date_issued: string // e.g., "2024-09-26"
  is_verified: boolean
}

// Interface for the expected API response
interface ApiData {
  certifications: Certification[]
  count: number
  mainSkills: string[]
  secondarySkills: string[]
}


export default function SkillWalletPage() {
  // 1. STATE MANAGEMENT: States for data, loading, and errors
  const [userName, setUserName] = useState("Your Name") // You can fetch this separately
  const [skills, setSkills] = useState<Skill[]>([])
  const [certificationCount, setCertificationCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for the scroll animation
  const [scrollY, setScrollY] = useState(0)

  // 2. DATA FETCHING: useEffect to fetch data on component mount
  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        const supabase = await createClient();
        // Destructure to get the session object directly
        const { data: { session } } = await supabase.auth.getSession();

        // Handle cases where the user is not logged in
        if (!session) {
          throw new Error("You must be logged in to view this page.");
        }

        const userId = session.user.id;
        // Get the user's name from the session metadata and update the state
        const name = session.user.user_metadata?.full_name || session.user.email || "Anonymous User";
        setUserName(name);

        const response = await fetch('/api/certifications/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch skill wallet data.')
        }

        const data: ApiData = await response.json()

        // 3. DATA TRANSFORMATION: Prepare the data for rendering
        // Combine main and secondary skills from the API
        const allSkills = [...data.mainSkills, ...data.secondarySkills]
        const formattedSkills: Skill[] = allSkills.map(skillName => ({
          name: skillName,
          category: "Verified Skill", // Assign a default category
        }))
        
        // Update the state with fetched data
        setSkills(formattedSkills)
        setCertificationCount(data.count)

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkillData()
  }, []) // The empty array [] ensures this runs only once on mount

  // useEffect for the scroll animation handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate rotation based on scroll position
  const maxScroll = 1000
  const rotationAngle = Math.min((scrollY / maxScroll) * 180, 180)

  // 4. CONDITIONAL RENDERING: Show a loading message
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading Skill Wallet...</p>
      </div>
    )
  }

  // Show an error message if the fetch failed
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-500">Error: {error}</p>
      </div>
    )
  }

  // Render the main component with the fetched data
  return (
    <div className="min-h-[200vh] bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden">
      {/* Main Card Container - Fixed in center */}
      <div className="fixed inset-0 flex items-center justify-center p-8">
        <div
          className="w-96 h-64 relative"
          style={{
            transform: `perspective(1000px) rotateY(${rotationAngle}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <Card className="absolute inset-0 w-full h-full bg-card/90 backdrop-blur-md border-2 border-accent/30 shadow-2xl backface-hidden">
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
              {/* Student Name */}
              <div>
                {/* Now using state */}
                <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">{userName}</h1>
                <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
              </div>

              {/* Certification Count */}
              <div className="space-y-2">
                {/* Now using state */}
                <div className="text-5xl font-bold text-accent">{certificationCount}</div>
                <div className="text-lg text-muted-foreground font-medium">Verified Certifications</div>
              </div>

              {/* Decorative Elements */}
              <div className="flex gap-2">
                {/* Now using state */}
                {[...Array(certificationCount)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-accent rounded-full opacity-60"></div>
                ))}
              </div>
            </div>
          </Card>

          <Card
            className="absolute inset-0 w-full h-full bg-card/90 backdrop-blur-md border-2 border-accent/30 shadow-2xl backface-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            <div className="h-full flex flex-col p-6 overflow-hidden">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-foreground">Skills</h2>
                <div className="w-12 h-0.5 bg-accent mx-auto mt-2"></div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {/* Now mapping over the skills state */}
                  {skills.map((skill) => (
                    <div key={skill.name} className="text-center p-2 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="text-sm font-medium text-foreground">{skill.name}</div>
                      <div className="text-xs text-muted-foreground">{skill.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm text-muted-foreground mb-2">Scroll to flip card</div>
        <div className="w-1 h-8 bg-accent/30 mx-auto rounded-full">
          <div
            className="w-full bg-accent rounded-full transition-all duration-100"
            style={{ height: `${(rotationAngle / 180) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

