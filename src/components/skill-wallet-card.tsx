import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Award, Star, Calendar, MapPin, Mail } from "lucide-react"

interface Skill {
  name: string
  level: number
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
  studentId: string
  email: string
  university: string
  major: string
  year: string
  location: string
  avatar: string
  skills: Skill[]
  certifications: Certification[]
  gpa: number
  totalCredits: number
}

const studentData: StudentData = {
  name: "Alexandra Chen",
  studentId: "CS2024-0847",
  email: "alexandra.chen@university.edu",
  university: "Stanford University",
  major: "Computer Science",
  year: "Senior",
  location: "Palo Alto, CA",
  avatar: "/professional-student-portrait.png",
  gpa: 3.87,
  totalCredits: 142,
  skills: [
    { name: "JavaScript", level: 95, category: "Programming" },
    { name: "React", level: 90, category: "Frontend" },
    { name: "Python", level: 88, category: "Programming" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "TypeScript", level: 82, category: "Programming" },
    { name: "Machine Learning", level: 78, category: "AI/ML" },
    { name: "AWS", level: 75, category: "Cloud" },
    { name: "Docker", level: 72, category: "DevOps" },
  ],
  certifications: [
    { name: "AWS Solutions Architect", issuer: "Amazon Web Services", date: "2024", verified: true },
    { name: "Google Cloud Professional", issuer: "Google Cloud", date: "2024", verified: true },
    { name: "React Developer Certification", issuer: "Meta", date: "2023", verified: true },
    { name: "Machine Learning Specialization", issuer: "Stanford Online", date: "2023", verified: true },
    { name: "Full Stack Web Development", issuer: "freeCodeCamp", date: "2023", verified: true },
  ],
}

export function SkillWalletCard() {
  const topSkills = studentData.skills.slice(0, 6)
  const verifiedCertifications = studentData.certifications.filter((cert) => cert.verified)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Main Card Container */}
        <Card className="floating-card glow-effect relative overflow-hidden bg-card/80 backdrop-blur-sm border-2 border-accent/20 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl transform translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
          </div>

          <div className="relative z-10 p-8 md:p-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-accent shadow-xl">
                  <AvatarImage src={studentData.avatar || "/placeholder.svg"} alt={studentData.name} />
                  <AvatarFallback className="text-2xl font-bold bg-accent text-accent-foreground">
                    {studentData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full p-2 shadow-lg">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 text-balance">
                    {studentData.name}
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium">
                    {studentData.major} • {studentData.year}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{studentData.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{studentData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{studentData.email}</span>
                  </div>
                </div>

                <div className="flex gap-6 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{studentData.gpa}</div>
                    <div className="text-sm text-muted-foreground">GPA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{studentData.totalCredits}</div>
                    <div className="text-sm text-muted-foreground">Credits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{verifiedCertifications.length}</div>
                    <div className="text-sm text-muted-foreground">Certifications</div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Student ID</div>
                <div className="font-mono text-lg font-semibold text-foreground">{studentData.studentId}</div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Core Skills</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topSkills.map((skill, index) => (
                  <div key={skill.name} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{skill.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {skill.category}
                      </Badge>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-accent h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                      <span className="absolute right-0 -top-6 text-sm font-bold text-accent">{skill.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">Verified Certifications</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verifiedCertifications.map((cert, index) => (
                  <Card
                    key={index}
                    className="p-4 bg-secondary/50 border-accent/20 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm text-foreground leading-tight">{cert.name}</h3>
                        {cert.verified && (
                          <Badge className="bg-accent text-accent-foreground text-xs ml-2 flex-shrink-0">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{cert.date}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Digital Skill Wallet • Generated {new Date().getFullYear()} • Verified Credentials
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
