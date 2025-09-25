"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Skill {
  name: string
  category: string
}

interface Certification {
  name: string
  issuer: string
  date: string
  verified: boolean
}

interface StudentData {
  name: string
  skills: Skill[]
  certifications: Certification[]
}

const studentData: StudentData = {
  name: "Alexandra Chen",
  skills: [
    { name: "JavaScript", category: "Programming" },
    { name: "React", category: "Frontend" },
    { name: "Python", category: "Programming" },
    { name: "Node.js", category: "Backend" },
    { name: "TypeScript", category: "Programming" },
    { name: "Machine Learning", category: "AI/ML" },
    { name: "AWS", category: "Cloud" },
    { name: "Docker", category: "DevOps" },
    { name: "MongoDB", category: "Database" },
    { name: "GraphQL", category: "API" },
    { name: "Vue.js", category: "Frontend" },
    { name: "Kubernetes", category: "DevOps" },
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2024", verified: true },
    { name: "Google Cloud Professional", issuer: "Google Cloud", date: "2024", verified: true },
    { name: "React Developer Certification", issuer: "Meta", date: "2023", verified: true },
    { name: "Machine Learning Specialization", issuer: "Stanford Online", date: "2023", verified: true },
    { name: "Full Stack Web Development", issuer: "freeCodeCamp", date: "2023", verified: true },
  ],
}

export default function SkillWalletPage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const verifiedCertifications = studentData.certifications.filter((cert) => cert.verified)
  const maxScroll = 1000
  const rotationAngle = Math.min((scrollY / maxScroll) * 180, 180)

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
                <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">{studentData.name}</h1>
                <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
              </div>

              {/* Certification Count */}
              <div className="space-y-2">
                <div className="text-5xl font-bold text-accent">{verifiedCertifications.length}</div>
                <div className="text-lg text-muted-foreground font-medium">Verified Certifications</div>
              </div>

              {/* Decorative Elements */}
              <div className="flex gap-2">
                {[...Array(verifiedCertifications.length)].map((_, i) => (
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
                  {studentData.skills.map((skill, index) => (
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
